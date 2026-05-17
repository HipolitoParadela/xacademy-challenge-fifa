import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Position } from './position.model';
import { PositionsController } from './position.controller';
import { PositionsService } from './position.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Position]),
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
