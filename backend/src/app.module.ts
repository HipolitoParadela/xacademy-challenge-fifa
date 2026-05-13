import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { SequelizeModule } from '@nestjs/sequelize';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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

        synchronize: true,
      }),
    }),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}