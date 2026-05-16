import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Skill } from './skill.model';
import { SkillsController } from './skill.controller';
import { SkillsService } from './skill.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Skill]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
