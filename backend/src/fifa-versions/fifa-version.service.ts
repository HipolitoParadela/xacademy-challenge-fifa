import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { FifaVersion } from './fifa-version.model';

@Injectable()
export class FifaVersionsService {
    
  constructor(
    @InjectModel(FifaVersion)
    private fifaVersionModel: typeof FifaVersion,
  ) {}


  async findAll() {
    const fifaVersions = await this.fifaVersionModel.findAll();

    return fifaVersions;
  }

  async findOne(id: number) {
    const fifaVersion = await this.fifaVersionModel.findByPk(id);

    if (!fifaVersion) {
      throw new NotFoundException('Versión de Fifa no encontrado');
    }

    return {
      message: 'Versión de Fifa encontrado correctamente',
      fifaVersion: this.sanitizeElement(fifaVersion),
    };
  }

  async findById(id: number) {
    return this.fifaVersionModel.findByPk(id);
  }

  private sanitizeElement(fifaVersion: FifaVersion) {
    return {
      id: fifaVersion.id,
      version_number : fifaVersion.version_number,
      year : fifaVersion.year
    };
  }


}
