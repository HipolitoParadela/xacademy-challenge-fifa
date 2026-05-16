import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { FifaVersion } from './fifa-version.model';
import { FifaVersionsController } from './fifa-version.controller';
import { FifaVersionsService } from './fifa-version.service';

@Module({
  imports: [
    SequelizeModule.forFeature([FifaVersion]),
  ],
  controllers: [FifaVersionsController],
  providers: [FifaVersionsService],
  exports: [FifaVersionsService],
})
export class FifaVersionsModule {}
