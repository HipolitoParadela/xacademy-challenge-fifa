import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { Player } from './players.model';

import { PlayerService } from './players.service';
import { PlayerController } from './players.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Player]),
  ],

  controllers: [PlayerController],

  providers: [PlayerService],

  exports: [PlayerService],
})
export class PlayerModule {}
