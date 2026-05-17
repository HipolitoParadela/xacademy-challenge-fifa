import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlayerSkill } from './player-skill.model';
import { PlayerSkillService } from './player-skill.service';
import { PlayerSkillController } from './player-skill.controller';

import { Skill } from '../skills/skill.model';
import { Player } from '../players/players.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PlayerSkill,
      Skill,
      Player,
      FifaVersion,
    ]),
  ],
  controllers: [PlayerSkillController],
  providers: [PlayerSkillService],
  exports: [PlayerSkillService],
})
export class PlayerSkillModule {}
