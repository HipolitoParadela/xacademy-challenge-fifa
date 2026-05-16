import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Club } from './club.model';
import { ClubsController } from './club.controller';
import { ClubsService } from './club.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Club]),
  ],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService],
})
export class ClubsModule {}
