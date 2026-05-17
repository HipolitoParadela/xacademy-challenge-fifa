import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { PlayerSkill } from './player-skill.model';
import { Skill } from '../skills/skill.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';

import { UpsertPlayerSkillsDto } from './dto/upsert-player-skill.dto';

@Injectable()
export class PlayerSkillService {
  constructor(
    @InjectModel(PlayerSkill)
    private readonly playerSkillModel: typeof PlayerSkill,

    @InjectModel(Skill)
    private readonly skillModel: typeof Skill,
  ) {}

  async getPlayerSkills(
    playerId: number,
    fifaVersionId?: number,
  ) {
    const where: any = {
      player_id: playerId,
    };

    if (fifaVersionId !== undefined) {
      where.fifa_version_id = fifaVersionId;
    }

    return this.playerSkillModel.findAll({
      where,

      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['id', 'name'],
        },
        {
          model: FifaVersion,
          as: 'fifaVersion',
          attributes: ['id', 'version_number', 'year'],
        },
      ],

      order: [['value', 'DESC']],
    });
  }

  async getPlayerSkillsGrouped(
    playerId: number,
    fifaVersionId?: number,
  ) {
    const where: any = {
      player_id: playerId,
    };

    if (fifaVersionId !== undefined) {
      where.fifa_version_id = fifaVersionId;
    }

    const skills = await this.playerSkillModel.findAll({
      where,

      include: [
        {
          model: Skill,
          as: 'skill',
          attributes: ['name'],
        },
      ],

      raw: true,
      nest: true,
    });

    const formatted: Record<string, number> = {};

    for (const item of skills as any[]) {
      if (!item.skill?.name) {
        continue;
      }

      formatted[item.skill.name] = item.value;
    }

    return formatted;
  }

  async upsertPlayerSkills(
    data: UpsertPlayerSkillsDto,
  ) {
    const {
      player_id,
      fifa_version_id,
      skills,
    } = data;

    const skillNames = Object.keys(skills);

    if (skillNames.length === 0) {
      return {
        success: false,
        message: 'No hay skills',
      };
    }

    const dbSkills = await this.skillModel.findAll({
      where: {
        name: {
          [Op.in]: skillNames,
        },
      },
    });

    const skillMap: Record<string, number> = {};

    for (const skill of dbSkills) {
      skillMap[skill.name] = skill.id;
    }

    const playerSkills: Partial<PlayerSkill>[] = [];

    for (const skillName of skillNames) {
      const skillId = skillMap[skillName];

      if (!skillId) {
        console.log(
          `Skill no encontrada: ${skillName}`,
        );

        continue;
      }

      const value = Number(skills[skillName]);

      if (Number.isNaN(value)) {
        console.log(
          `Valor inválido para ${skillName}: ${skills[skillName]}`,
        );

        continue;
      }

      playerSkills.push({
        player_id,
        fifa_version_id,
        skill_id: skillId,
        value,
      });
    }

    if (playerSkills.length === 0) {
      return {
        success: false,
        message: 'No hay skills válidas',
      };
    }

    await this.playerSkillModel.bulkCreate(
      playerSkills as any,
      {
        updateOnDuplicate: ['value'],
      },
    );

    return {
      success: true,
      total: playerSkills.length,
    };
  }
}
