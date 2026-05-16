import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { FifaVersionsService } from './fifa-version.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('fifaversions')
export class FifaVersionsController {
  constructor(private readonly FifaVersionsService: FifaVersionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.FifaVersionsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.FifaVersionsService.findOne(id);
  }

}
