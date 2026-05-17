import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { Player } from './players.model';

import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player)
    private playerModel: typeof Player,
  ) {}

  async findAll(query: {
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const {
      search,
      limit = 50,
      offset = 0,
    } = query;

    const where: any = {};

    if (search) {
      where.name = {
        [Op.like]: `%${search}%`,
      };
    }

    return this.playerModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']],
    });
  }

  async findById(id: number) {
    const player = await this.playerModel.findByPk(id);

    if (!player) {
      throw new NotFoundException(
        `Jugador ${id} no encontrado`,
      );
    }

    return player;
  }

  async create(data: CreatePlayerDto) {
    const existingPlayer = await this.playerModel.findOne({
      where: {
        external_id: data.external_id,
      },
    });

    if (existingPlayer) {
      return existingPlayer;
    }

    return this.playerModel.create({
      ...data,
    } as any);
  }

  async update(
    id: number,
    data: UpdatePlayerDto,
  ) {
    const player = await this.findById(id);

    await player.update(data);

    return player;
  }

  async delete(id: number) {
    const player = await this.findById(id);

    await player.destroy();

    return {
      success: true,
    };
  }
}
