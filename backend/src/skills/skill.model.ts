import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'skills',

  timestamps: false,
})
export class Skill extends Model {
  @Column({
    type: DataType.INTEGER,

    autoIncrement: true,

    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,

    unique: true,

    allowNull: false,
  })
  declare name: string;
}
