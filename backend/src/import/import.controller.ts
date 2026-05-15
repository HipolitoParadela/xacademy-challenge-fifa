import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { ImportService } from './import.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('import')
export class ImportController { 
  constructor(
    private readonly importService: ImportService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('players')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          './uploads',

        filename: (
          req,
          file,
          callback,
        ) => {
          const uniqueName =
            Date.now() +
            extname(file.originalname);

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize:
          1024 * 1024 * 100,
      },
    }),
  )
  async uploadPlayersCsv(
    @UploadedFile()
    file: Express.Multer.File,

    @Body('genero')
    genero: string,
  ) {
    return this.importService.processCsv(
      file.path,
      genero,
    );
  }
}
