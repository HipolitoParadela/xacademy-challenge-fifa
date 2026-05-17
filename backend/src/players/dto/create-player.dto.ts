import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  external_id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  genero?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
