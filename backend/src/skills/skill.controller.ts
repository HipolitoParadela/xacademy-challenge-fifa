import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { SkillsService } from './skill.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('skills')
export class SkillsController {
  constructor(private readonly SkillService: SkillsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.SkillService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.SkillService.findOne(id);
  }

}
