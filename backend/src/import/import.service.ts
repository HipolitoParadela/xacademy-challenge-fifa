import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import * as fs from 'fs';
import csv from 'csv-parser';
import * as iconv from 'iconv-lite';

import { Club } from '../clubs/club.model';
import { Player } from '../players/players.model';
import { Skill } from '../skills/skill.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';
import { PlayerSkill } from '../player-skills/player-skill.model';

@Injectable()
export class ImportService {
  constructor(
    @InjectModel(Club)
    private clubModel: typeof Club,

    @InjectModel(Player)
    private playerModel: typeof Player,

    @InjectModel(Skill)
    private skillModel: typeof Skill,

    @InjectModel(FifaVersion)
    private fifaVersionModel: typeof FifaVersion,

    @InjectModel(PlayerSkill)
    private playerSkillModel: typeof PlayerSkill,
  ) {}

  private clubCache = new Map<number, number>();
  private playerCache = new Map<number, number>();
  private fifaVersionCache = new Map<number, number>();
  private skillCache = new Map<string, number>();

  private readonly ignoredColumns = [
    'player_id',
    'player_url',
    'fifa_version',
    'fifa_update',
    'fifa_update_date',
    'short_name',
    'long_name',
    'wage_eur',
    'dob',
    'height_cm',
    'weight_kg',
    'league_id',
    'league_name',
    'league_level',
    'club_name',
    'club_position',
    'club_jersey_number',
    'club_loaned_from',
    'club_joined_date',
    'club_contract_valid_until_year',
    'nationality_id',
    'nationality_name',
    'nation_team_id',
    'nation_position',
    'nation_jersey_number',
    'preferred_foot',
    'weak_foot',
    'skill_moves',
    'international_reputation',
    'work_rate',
    'body_type',
    'real_face',
    'release_clause_eur',
    'player_tags',
    'player_traits',
    'ls',
    'st',
    'rs',
    'lw',
    'lf',
    'cf',
    'rf',
    'rw',
    'lam',
    'cam',
    'ram',
    'lm',
    'lcm',
    'cm',
    'rcm',
    'rm',
    'lwb',
    'ldm',
    'cdm',
    'rdm',
    'rwb',
    'lb',
    'lcb',
    'cb',
    'rcb',
    'rb',
    'gk',
    'player_face_url',

    'attacking_heading_accuracy',
    'attacking_short_passing',
    'attacking_volleys',

    'movement_agility',
    'movement_reactions',
    'movement_balance',

    'skill_fk_accuracy',
    'skill_long_passing',
    'skill_ball_control',

    'mentality_aggression',
    'mentality_interceptions',
    'mentality_positioning',
    'mentality_vision',
    'mentality_penalties',
    'mentality_composure',

    'power_stamina',
    'power_strength',
    'power_long_shots',

    'goalkeeping_diving',
    'goalkeeping_handling',
    'goalkeeping_kicking',
    'goalkeeping_positioning',
    'goalkeeping_reflexes',
    'goalkeeping_speed',
  ];

  private readonly skillColumns = [
    'club_team_id',
    'value_eur',
    'age',
    'pace',
    'shooting',
    'passing',
    'dribbling',
    'defending',
    'physic',
    
    'overall',
    'potential',
    'player_positions',

    'attacking_crossing',
    'attacking_finishing',

    'skill_dribbling',
    'skill_curve',

    'movement_acceleration',
    'movement_sprint_speed',

    'power_shot_power',
    'power_jumping',

    'defending_marking_awareness',
    'defending_standing_tackle',
    'defending_sliding_tackle',
  ];

  async processCsv(filePath: string, genero: string) {
    await this.loadCaches();

    await this.prepareSkills(filePath);

    // Carga las filas del CSV en memoria para procesarlas después, esto permite separar la lectura del archivo del procesamiento y manejar mejor los errores
    const rows: any[] = [];

    // Comienza el procesamiento del CSV
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        //.pipe(iconv.decodeStream('utf8'))
        .pipe(iconv.decodeStream('latin1'))
        .pipe(
          csv({
            separator: ';', // o ';', Indico que el separador de filas es ";", si no se indica, el parser asume que es "," y no parsea correctamente el archivo
          }),
        )

        .on('data', (row) => {
          rows.push(row);
        })

        .on('end', async () => {
          //console.log('Rows obtenidas', rows);

          try {
            for (const row of rows) {
              try {
                if (!row.player_id || !row.short_name) {
                  continue; // Si no tiene player_id o short_name, no se procesa porque es un registro inválido
                }

                const playerId = await this.resolvePlayer(row, genero);

                await this.resolveClub(row);

                const fifaVersionId = await this.resolveFifaVersion(row);

                // Hasta este punto, tenemos el playerId y fifaVersionId resueltos,
                // ahora podemos guardar las skills del jugador sin preocuparnos por consultas repetidas o problemas de integridad referencial
                await this.savePlayerSkills(row, playerId, fifaVersionId);

                console.log(`Jugador procesado: ${row.short_name}`);
              } catch (error) {
                console.error('Error procesando fila:', error);
              }
            }

            resolve({
              success: true,
              totalRows: rows.length,
            });
          } catch (error) {
            reject(error);
          }
        })

        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // Carga las skills desde el CSV para asegurarse que todas existan antes de procesar los jugadores y evitar consultas repetidas durante el procesamiento
  private async prepareSkills(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      let processed = false;

      fs.createReadStream(filePath)
        //.pipe(iconv.decodeStream('utf8'))
        .pipe(iconv.decodeStream('latin1'))
        .pipe(
          csv({
            separator: ';',
          }),
        )

        .on('headers', async (headers) => {
          if (processed) {
            return;
          }

          processed = true;

          try {
            const skillColumns = headers.filter(
              (header) => header && !this.ignoredColumns.includes(header),
            );

            for (const rawSkillName of skillColumns) {
              const skillName = rawSkillName.trim().toLowerCase();

              if (!skillName) {
                continue;
              }

              const [skill] = await this.skillModel.findOrCreate({
                where: {
                  name: skillName,
                },
                defaults: {
                  name: skillName,
                } as any,
              });

              this.skillCache.set(skill.name, skill.id);
            }

            console.log(`Skills cargadas: ${this.skillCache.size}`);

            resolve();
          } catch (error) {
            reject(error);
          }
        })

        .on('error', reject);
    });
  }

  // Realiza una primer busqueda de clubs, jugadores, versiones y skills para cargar los caches y evitar consultas repetidas durante el procesamiento
  private async loadCaches() {
    const clubs = await this.clubModel.findAll();

    clubs.forEach((club) => {
      this.clubCache.set(club.external_id, club.id);
    });

    const players = await this.playerModel.findAll();

    players.forEach((player) => {
      this.playerCache.set(player.external_id, player.id);
    });

    const versions = await this.fifaVersionModel.findAll();

    versions.forEach((version) => {
      this.fifaVersionCache.set(version.version_number, version.id);
    });

    const skills = await this.skillModel.findAll();

    skills.forEach((skill) => {
      this.skillCache.set(skill.name, skill.id);
    });

    //console.log("skillCache cargada", this.skillCache);
  }

  private async resolveClub(row: any) {
    const externalId = Number(row.club_team_id);

    if (!externalId || Number.isNaN(externalId)) {
      return null;
    }

    if (this.clubCache.has(externalId)) {
      return this.clubCache.get(externalId)!;
    }

    const [club] = await this.clubModel.findOrCreate({
      where: {
        external_id: externalId,
      },
      defaults: {
        external_id: externalId,
        name: row.club_name,
      },
    });

    this.clubCache.set(externalId, club.id);

    return club.id;
  }

  private async resolvePlayer(row: any, genero: string) {
    const externalId = Number(row.player_id);

    if (!externalId || Number.isNaN(externalId)) {
      throw new Error(`player_id inválido: ${row.player_id}`);
    }

    if (this.playerCache.has(externalId)) {
      return this.playerCache.get(externalId)!;
    }

    const [player] = await this.playerModel.findOrCreate({
      where: {
        external_id: externalId,
      },
      defaults: {
        external_id: externalId,
        name: row.short_name?.trim() || 'Unknown',
        genero,
        image: row.player_face_url || null,
      },
    });

    this.playerCache.set(externalId, player.id);

    return player.id;
  }

  private async resolveFifaVersion(row: any) {
    const versionNumber = Number(row.fifa_version);

    if (!versionNumber || Number.isNaN(versionNumber)) {
      throw new Error(`fifa_version inválido: ${row.fifa_version}`);
    }

    if (this.fifaVersionCache.has(versionNumber)) {
      return this.fifaVersionCache.get(versionNumber)!;
    }

    const [version] = await this.fifaVersionModel.findOrCreate({
      where: {
        version_number: versionNumber,
      },
      defaults: {
        version_number: versionNumber,
        year: 2000 + versionNumber,
      },
    });

    this.fifaVersionCache.set(versionNumber, version.id);

    return version.id;
  }

  private async savePlayerSkills(
    row: any,
    playerId: number,
    fifaVersionId: number,
  ) {
    const playerSkills: {
      player_id: number;
      fifa_version_id: number;
      skill_id: number;
      value: string;
    }[] = [];

    //console.log("Skill Cache", this.skillCache);

    for (const skillName of this.skillColumns) {
      const skillId = this.skillCache.get(skillName);

      if (!skillId) {
        console.log('Skill no encontrada en cache, se omite:', skillName);
        continue;
      }

      const rawValue = row[skillName];

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        continue;
      }

      const skillValue = String(rawValue);

      /* if (Number.isNaN(skillValue)) {
        continue;
      } */

      playerSkills.push({
        player_id: playerId,
        fifa_version_id: fifaVersionId,
        skill_id: skillId,
        value: skillValue,
      });
    }

    if (playerSkills.length > 0) {
      await this.playerSkillModel.bulkCreate(playerSkills, {
        ignoreDuplicates: true,
      });
    }
  }
}
