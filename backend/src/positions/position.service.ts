import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Position } from './position.model';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position)
    private positionModel: typeof Position,
  ) {}


  async findAll() {
    const positions = await this.positionModel.findAll();

    return positions;
  }

  async findOne(id: number) {
    const position = await this.positionModel.findByPk(id);

    if (!position) {
      throw new NotFoundException('Position no encontrado');
    }

    return {
      message: 'Position encontrado correctamente',
      position: this.sanitizeElement(position),
    };
  }


  async findById(id: number) {
    return this.positionModel.findByPk(id);
  }

  private sanitizeElement(position: Position) {
    return {
      id: position.id,
      name: position.name
    };
  }


}
