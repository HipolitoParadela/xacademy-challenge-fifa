import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PlayerSkillService } from './player-skill.service';
import { UpsertPlayerSkillsDto } from './dto/upsert-player-skill.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('player-skills')
export class PlayerSkillController {
  constructor(
    private readonly PlayerSkillService: PlayerSkillService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':playerId')
  async getPlayerSkills(
    @Param('playerId', ParseIntPipe)
    playerId: number,

    @Query('fifaVersionId')
    fifaVersionId?: number,
  ) {
    return this.PlayerSkillService.getPlayerSkillsGrouped(
      playerId,
      fifaVersionId
        ? Number(fifaVersionId)
        : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('upsert')
  async upsertPlayerSkills(
    @Body()
    data: UpsertPlayerSkillsDto,
  ) {
    return this.PlayerSkillService.upsertPlayerSkills(
      data,
    );
  }
}
