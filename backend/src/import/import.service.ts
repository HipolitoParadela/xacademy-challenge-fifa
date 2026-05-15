import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import * as fs from 'fs';

import csv from 'csv-parser';

import { Club } from '../clubs/club.model';
import { Player } from '../players/player.model';
import { Skill } from '../skills/skill.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';
import { PlayerSkill } from '../player-skills/player-skill.model';
import * as iconv from 'iconv-lite';

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

  private readonly skillColumns = [
    'pace',
    'shooting',
    'passing',
    'dribbling',
    'defending',
    'physic',

    'attacking_crossing',
    'attacking_finishing',
    'attacking_heading_accuracy',
    'attacking_short_passing',
    'attacking_volleys',

    'skill_dribbling',
    'skill_curve',
    'skill_fk_accuracy',
    'skill_long_passing',
    'skill_ball_control',

    'movement_acceleration',
    'movement_sprint_speed',
    'movement_agility',
    'movement_reactions',
    'movement_balance',

    'power_shot_power',
    'power_jumping',
    'power_stamina',
    'power_strength',
    'power_long_shots',

    'mentality_aggression',
    'mentality_interceptions',
    'mentality_positioning',
    'mentality_vision',
    'mentality_penalties',
    'mentality_composure',

    'defending_marking_awareness',
    'defending_standing_tackle',
    'defending_sliding_tackle',

    'goalkeeping_diving',
    'goalkeeping_handling',
    'goalkeeping_kicking',
    'goalkeeping_positioning',
    'goalkeeping_reflexes',
    'goalkeeping_speed',
  ];

  async processCsv(filePath: string, genero: string) {
    await this.loadCaches();

    const rows: any[] = [];

    const ignoredColumns = [
      'player_id',
      'player_url',
      'fifa_version',
      'fifa_update',
      'fifa_update_date',
      'short_name',
      'long_name',
      'player_positions',
      'overall',
      'potential',
      'value_eur',
      'wage_eur',
      'age',
      'dob',
      'height_cm',
      'weight_kg',
      'league_id',
      'league_name',
      'league_level',
      'club_team_id',
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
      'player_face_url',
    ];

    return new Promise((resolve, reject) => {
      let headersProcessed = false;

      fs.createReadStream(filePath)
        .pipe(iconv.decodeStream('utf8'))

        .pipe(
          csv({
            separator: ';',
          }),
        )

        .on('headers', async (headers) => {
          if (headersProcessed) {
            return;
          }

          headersProcessed = true;

          const skillColumns = headers.filter(
            (header) => header && !ignoredColumns.includes(header),
          );

          for (const rawSkillName of skillColumns) {
            const skillName = rawSkillName.trim().toLowerCase();

            if (!skillName) {
              continue;
            }

            // Evita procesar headers inválidos
            if (skillName.includes(';')) {
              console.log(`Header inválido detectado: ${skillName}`);
              continue;
            }

            // Ya existe en cache
            if (this.skillCache.has(skillName)) {
              continue;
            }

            // Busca o crea para evitar duplicate entry
            const [skill] = await this.skillModel.findOrCreate({
              where: {
                name: skillName,
              },
              defaults: {
                name: skillName,
              },
            });

            this.skillCache.set(skill.name, skill.id);
          }

          console.log(`Skills cargadas: ${this.skillCache.size}`);
        })

        .on('data', (row) => {
          rows.push(row);
        })

        .on('end', async () => {
          try {
            for (const row of rows) {
              try {
                const playerId = await this.resolvePlayer(row, genero);

                const clubId = await this.resolveClub(row);

                const fifaVersionId = await this.resolveFifaVersion(row);

                await this.savePlayerSkills(row, playerId, fifaVersionId);

                console.log({
                  playerId,
                  clubId,
                  fifaVersionId,
                });
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
  }

  private async resolveClub(row: any) {
    const externalId = Number(row.club_team_id);

    if (!externalId || Number.isNaN(externalId)) {
      return null;
    }

    if (this.clubCache.has(externalId)) {
      return this.clubCache.get(externalId)!;
    }

    const club = await this.clubModel.create({
      external_id: externalId,

      name: row.club_name,
    });

    this.clubCache.set(externalId, club.id);

    return club.id;
  }

  private async resolvePlayer(row: any, genero: string) {
    const externalId = Number(row.player_id);

    if (this.playerCache.has(externalId)) {
      return this.playerCache.get(externalId)!;
    }

    const player = await this.playerModel.create({
      external_id: externalId,
      name: row.short_name,
      genero,
      image: row.player_face_url || null,
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

    const version = await this.fifaVersionModel.create({
      version_number: versionNumber,

      year: 2000 + versionNumber,
    });

    this.fifaVersionCache.set(versionNumber, version.id);

    return version.id;
  }

  private async savePlayerSkills(
    row: any,
    playerId: number,
    fifaVersionId: number,
  ) {
    for (const skillName of this.skillColumns) {
      if (!this.skillCache.has(skillName)) {
        continue;
      }

      const rawValue = row[skillName];

      if (rawValue === null || rawValue === undefined || rawValue === '') {
        continue;
      }

      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        continue;
      }

      await this.playerSkillModel.create({
        player_id: playerId,

        fifa_version_id: fifaVersionId,

        skill_id: this.skillCache.get(skillName)!,

        value: numericValue,
      });
    }
  }
}
