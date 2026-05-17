import {
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';


export class UpsertPlayerSkillsDto {
  @IsNumber()
  player_id!: number;

  @IsNumber()
  fifa_version_id!: number;

  @IsObject()
  skills!: Record<string, number>;
}
