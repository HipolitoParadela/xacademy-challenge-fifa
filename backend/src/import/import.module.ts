import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ImportController } from './import.controller';
import { ImportService } from './import.service';

import { Club } from '../clubs/club.model';
import { Player } from '../players/players.model';
import { Skill } from '../skills/skill.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';
import { PlayerSkill } from '../player-skills/player-skill.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Club,
      Player,
      Skill,
      FifaVersion,
      PlayerSkill,
    ]),
  ],

  controllers: [ImportController],

  providers: [ImportService],
})
export class ImportModule {}
