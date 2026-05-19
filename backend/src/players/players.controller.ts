import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PlayerService } from './players.service';

import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('players')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('position') position?: string,
    @Query('clubId') clubId?: string,
    @Query('fifaVersionId') fifaVersionId?: string,
    @Query('gender') gender?: string,
  ) {
    return this.playerService.findAll({
      search,
      position,
      clubId: clubId ? Number(clubId) : undefined,
      fifaVersionId: fifaVersionId
        ? Number(fifaVersionId)
        : undefined,
      gender,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.playerService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    data: CreatePlayerDto,
  ) {
    return this.playerService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    data: UpdatePlayerDto,
  ) {
    return this.playerService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.playerService.delete(id);
  }
}
