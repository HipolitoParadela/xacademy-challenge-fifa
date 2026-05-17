import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { PositionsService } from './position.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('positions')
export class PositionsController {
  constructor(private readonly PositionService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.PositionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.PositionService.findOne(id);
  }

}
