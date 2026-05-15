import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'fifa_versions',

  timestamps: true,
})
export class FifaVersion extends Model {
  @Column({
    type: DataType.INTEGER,

    autoIncrement: true,

    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,

    unique: true,

    allowNull: false,
  })
  version_number!: number;

  @Column({
    type: DataType.INTEGER,

    allowNull: false,
  })
  year!: number;
}
