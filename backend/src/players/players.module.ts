import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PlayerController } from './players.controller';
import { PlayerService } from './players.service';

import { Player } from './players.model';
import { PlayerSkill } from '../player-skills/player-skill.model';
import { Skill } from '../skills/skill.model';
import { Club } from '../clubs/club.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Player,
      PlayerSkill,
      Skill,
      Club,
      FifaVersion,
    ]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}