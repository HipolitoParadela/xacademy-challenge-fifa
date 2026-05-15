import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'player_skills',

  timestamps: true,
})
export class PlayerSkill extends Model {
  @Column({
    type: DataType.INTEGER,

    autoIncrement: true,

    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,

    allowNull: false,
  })
  player_id!: number;

  @Column({
    type: DataType.INTEGER,

    allowNull: false,
  })
  fifa_version_id!: number;

  @Column({
    type: DataType.INTEGER,

    allowNull: false,
  })
  skill_id!: number;

  @Column({
    type: DataType.INTEGER,

    allowNull: false,
  })
  value!: number;
}
