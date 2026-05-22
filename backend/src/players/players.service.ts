import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { Player } from './players.model';
import { PlayerSkill } from '../player-skills/player-skill.model';
import { Skill } from '../skills/skill.model';
import { Club } from '../clubs/club.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {

  constructor(
    @InjectModel(Player)
    private readonly playerModel: typeof Player,

    @InjectModel(PlayerSkill)
    private readonly playerSkillModel: typeof PlayerSkill,

    @InjectModel(Skill)
    private readonly skillModel: typeof Skill,

    @InjectModel(Club)
    private readonly clubModel: typeof Club,

    @InjectModel(FifaVersion)
    private readonly fifaVersionModel: typeof FifaVersion,
  ) { }


  async findAll(params: {
    search?: string;
    limit?: number;
    offset?: number;
    position?: string;
    clubId?: number;
    fifaVersionId?: number;
    gender?: string;
  }) {
    const {
      search,
      limit = 50,
      offset = 0,
      position,
      clubId,
      fifaVersionId,
      gender,
    } = params;

    const playerWhere: any = {};

    // search
    if (search) {
      playerWhere.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // gender
    if (
      gender &&
      gender !== 'all'
    ) {
      playerWhere.genero =
        gender;
    }

    // versión FIFA
    let versionId =
      fifaVersionId;

    if (!versionId) {
      const latest =
        await this.fifaVersionModel.findOne(
          {
            order: [
              [
                'version_number',
                'DESC',
              ],
            ],
          },
        );

      versionId =
        latest?.id;
    }

    if (!versionId) {
      return {
        count: 0,
        rows: [],
      };
    }

    // skills necesarias para filtros
    const filterSkills =
      await this.skillModel.findAll(
        {
          where: {
            name: [
              'player_positions',
              'club_team_id',
            ],
          },
        },
      );

    const skillIds =
      new Map<
        string,
        number
      >();

    filterSkills.forEach(
      (s) => {
        skillIds.set(
          s.name,
          s.id,
        );
      },
    );

    const positionSkillId =
      skillIds.get(
        'player_positions',
      );

    const clubSkillId =
      skillIds.get(
        'club_team_id',
      );

    // include base
    const include: any[] = [
      {
        model: PlayerSkill,
        as: 'skills',
        required: true,
        where: {
          fifa_version_id:
            versionId,
        },
        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: [
              'name',
            ],
          },
        ],
      },
    ];

    // filtro posición
    if (
      position &&
      positionSkillId
    ) {
      include.push({
        model: PlayerSkill,
        as: 'positionFilter',
        required: true,
        where: {
          fifa_version_id:
            versionId,
          skill_id:
            positionSkillId,
          value: {
            [Op.like]:
              `%${position}%`,
          },
        },
      });
    }

    // filtro club
    if (
      clubId &&
      clubSkillId
    ) {
      include.push({
        model: PlayerSkill,
        as: 'clubFilter',
        required: true,
        where: {
          fifa_version_id:
            versionId,
          skill_id:
            clubSkillId,
          value:
            String(
              clubId,
            ),
        },
      });
    }

    // query principal
    const players =
      await this.playerModel.findAndCountAll(
        {
          where:
            playerWhere,
          include,
          distinct: true,
          limit,
          offset,
        },
      );

    // map skills
    const rows =
      players.rows.map(
        (
          player: any,
        ) => {
          const skillMap:
            Record<
              string,
              string
            > = {};

          player.skills?.forEach(
            (s: any) => {
              if (
                s.skill?.name
              ) {
                skillMap[
                  s.skill.name
                ] = s.value;
              }
            },
          );

          return {
            id: player.id,
            external_id:
              player.external_id,
            name: player.name,
            image:
              player.image,
            genero:
              player.genero,

            player_positions:
              skillMap.player_positions ??
              null,

            overall:
              Number(
                skillMap.overall ||
                0,
              ),

            potential:
              Number(
                skillMap.potential ||
                0,
              ),

            value_eur:
              Number(
                skillMap.value_eur ||
                0,
              ),

            age: Number(
              skillMap.age ||
              0,
            ),

            club_team_id:
              Number(
                skillMap.club_team_id ||
                0,
              ),
          };
        },
      );

    // ordenar por overall
    rows.sort(
      (
        a,
        b,
      ) =>
        b.overall -
        a.overall,
    );

    // clubs
    const clubIds =
      [
        ...new Set(
          rows.map(
            (
              r,
            ) =>
              r.club_team_id,
          ),
        ),
      ];

    const clubs =
      await this.clubModel.findAll(
        {
          where: {
            external_id:
            {
              [Op.in]:
                clubIds,
            },
          },
        },
      );

    const clubMap =
      new Map<
        number,
        string
      >();

    clubs.forEach(
      (c) => {
        clubMap.set(
          c.external_id,
          c.name,
        );
      },
    );

    const finalRows =
      rows
        .map((r) => ({
          ...r,
          club:
            clubMap.get(
              r.club_team_id,
            ) ||
            null,
        }))
        .sort(
          (
            a,
            b,
          ) =>
            b.overall -
            a.overall,
        );

    return {
      count:
        players.count,
      rows: finalRows,
      limit,
      offset,
      fifaVersionId:
        versionId,
    };
  }


  async findById(id: number) {
    const player = await this.playerModel.findByPk(id);

    if (!player) {
      throw new NotFoundException(
        `Jugador ${id} no encontrado`,
      );
    }

    return player;
  }

  async getProfile(
    playerId: number,
  ) {
    // jugador base
    const player =
      await this.playerModel.findByPk(
        playerId,
      );

    if (!player) {
      return null;
    }

    // ultima version fifa conocida para ese jugador
    const latestSkill =
      await this.playerSkillModel.findOne({
        where: {
          player_id: playerId,
        },

        include: [
          {
            model: FifaVersion,
            as: 'fifaVersion',
            attributes: [
              'id',
              'version_number',
              'year',
            ],
          },
        ],

        order: [
          [
            'fifaVersion',
            'version_number',
            'DESC',
          ],
        ],
      });

    if (!latestSkill?.fifaVersion) {
      return {
        player,
        fifa_version: null,
        skills: {},
      };
    }

    const fifaVersionId =
      latestSkill.fifaVersion.id;

    // todas las skills de esa version
    const skillsRows =
      await this.playerSkillModel.findAll({
        where: {
          player_id: playerId,
          fifa_version_id:
            fifaVersionId,
        },

        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: ['name'],
          },
        ],
      });

    const skills:
      Record<string, string> = {};

    for (const row of skillsRows as any[]) {
      if (row.skill?.name) {
        skills[
          row.skill.name
        ] = row.value;
      }
    }

    return {
      player: {
        id: player.id,
        name: player.name,
        image: player.image,
        genero: player.genero,
        external_id:
          player.external_id,
      },

      fifa_version: {
        id:
          latestSkill
            .fifaVersion.id,
        version_number:
          latestSkill
            .fifaVersion
            .version_number,
        year:
          latestSkill
            .fifaVersion.year,
      },

      skills,
    };
  }


  async getEvolution(
    playerId: number,
  ) {
    const rows =
      await this.playerSkillModel.findAll({
        where: {
          player_id: playerId,
        },

        include: [
          {
            model: Skill,
            as: 'skill',
            attributes: ['id', 'name'],
            required: true,
          },
          {
            model: FifaVersion,
            as: 'fifaVersion',
            required: true,
          },
        ],

        order: [
          [
            {
              model: FifaVersion,
              as: 'fifaVersion',
            },
            'version_number',
            'ASC',
          ],
        ],
      });

    const evolutionMap:
      Record<number, any> = {};

    for (const row of rows as any[]) {
      const fifa =
        row.fifaVersion;

      const skill =
        row.skill;

      if (
        !fifa ||
        !skill?.name
      ) {
        continue;
      }

      const versionId =
        fifa.id;

      // crear version si no existe
      if (
        !evolutionMap[
        versionId
        ]
      ) {
        evolutionMap[
          versionId
        ] = {
          fifa_version: {
            id: fifa.id,
            version_number:
              fifa.version_number,
            year:
              fifa.year,
          },

          skills: {},
        };
      }

      // agregar skill
      evolutionMap[
        versionId
      ].skills[
        skill.name
      ] = row.value;
    }

    return Object.values(
      evolutionMap,
    );
  }


  async create(data: CreatePlayerDto) {
    const existingPlayer = await this.playerModel.findOne({
      where: {
        external_id: data.external_id,
      },
    });

    if (existingPlayer) {
      return existingPlayer;
    }

    return this.playerModel.create({
      ...data,
    } as any);
  }


  async update(
    id: number,
    data: UpdatePlayerDto,
  ) {
    const player = await this.findById(id);

    await player.update(data);

    return player;
  }


  async delete(id: number) {
    const player = await this.findById(id);

    await player.destroy();

    return {
      success: true,
    };
  }



}
