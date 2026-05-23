import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName:
    'player_ai_insights',

  underscored:
    true,
})
export class
PlayerAiInsight
  extends Model {

  @Column({
    type:
      DataType.INTEGER,
    allowNull:
      false,
    unique:
      true,
  })
  declare player_id: number;

  @Column({
    type:
      DataType.TEXT,
    allowNull:
      false,
  })
  declare summary: string;
}