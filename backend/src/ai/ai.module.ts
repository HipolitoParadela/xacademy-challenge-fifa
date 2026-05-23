import {
  Module,
} from '@nestjs/common';

import {
  SequelizeModule,
} from '@nestjs/sequelize';

import {
  AiController,
} from './ai.controller';

import {
  AiService,
} from './ai.service';

import {
  PlayerAiInsight,
} from './entities/player-ai-insight.entity';

import {
  Player,
} from '../players/players.model';

import {
    PlayerModule,
} from '../players/players.module';

@Module({
    imports: [
        SequelizeModule.forFeature([
            PlayerAiInsight,
            Player,
        ]),
        PlayerModule,
    ],

    controllers: [
        AiController,
    ],

    providers: [
        AiService,
    ],
})
export class
    AiModule { }