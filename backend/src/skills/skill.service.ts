import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Skill } from './skill.model';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill)
    private skillModel: typeof Skill,
  ) {}


  async findAll() {
    const skills = await this.skillModel.findAll();

    return skills;
  }

  async findOne(id: number) {
    const skill = await this.skillModel.findByPk(id);

    if (!skill) {
      throw new NotFoundException('Skill no encontrado');
    }

    return {
      message: 'Skill encontrado correctamente',
      skill: this.sanitizeElement(skill),
    };
  }


  async findById(id: number) {
    return this.skillModel.findByPk(id);
  }

  private sanitizeElement(skill: Skill) {
    return {
      id: skill.id,
      name: skill.name
    };
  }


}
