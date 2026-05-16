import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { ClubsService } from './club.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly ClubService: ClubsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.ClubService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ClubService.findOne(id);
  }

}
