import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Club } from './club.model';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club)
    private clubModel: typeof Club,
  ) {}


  async findAll() {
    const clubs = await this.clubModel.findAll();

    return clubs;
  }

  async findOne(id: number) {
    const club = await this.clubModel.findByPk(id);

    if (!club) {
      throw new NotFoundException('Club no encontrado');
    }

    return {
      message: 'Club encontrado correctamente',
      club: this.sanitizeElement(club),
    };
  }


  async findById(id: number) {
    return this.clubModel.findByPk(id);
  }

  private sanitizeElement(club: Club) {
    return {
      id: club.id,
      external_id: club.external_id,
      name: club.name
    };
  }


}
