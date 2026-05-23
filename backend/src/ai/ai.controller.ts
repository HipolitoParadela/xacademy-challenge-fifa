import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import {
  AiService,
} from './ai.service';

@Controller('ai')
export class AiController {

  constructor(
    private readonly aiService: AiService,
  ) {}

  @Get(
    'player-evolution/:playerId',
  )
  getInsight(
    @Param(
      'playerId',
      ParseIntPipe,
    )
    playerId: number,
  ) {

    console.log(
      'AI GET playerId',
      playerId,
    );

    return this.aiService
      .getPlayerEvolutionInsight(
        playerId,
      );
  }

  @Post(
    'player-evolution/:playerId/regenerate',
  )
  regenerate(
    @Param(
      'playerId',
      ParseIntPipe,
    )
    playerId: number,
  ) {

    console.log(
      'AI REGENERATE playerId',
      playerId,
    );

    return this.aiService
      .regenerateInsight(
        playerId,
      );
  }
}