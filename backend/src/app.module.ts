import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImportModule } from './import/import.module';
import { ClubsModule } from './clubs/club.module';
import { SkillsModule } from './skills/skill.module';
import { FifaVersionsModule } from './fifa-versions/fifa-versions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        dialect: 'mysql',

        host: configService.get('DB_HOST'),

        port: Number(
          configService.get('DB_PORT'),
        ),

        username:
          configService.get('DB_USER'),

        password:
          configService.get('DB_PASSWORD'),

        database:
          configService.get('DB_NAME'),

        autoLoadModels: true,

        synchronize: false,
      }),
    }),

    AuthModule,
    ClubsModule,
    FifaVersionsModule,
    ImportModule,
    UsersModule,
    SkillsModule
  ],
})
export class AppModule {}