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
