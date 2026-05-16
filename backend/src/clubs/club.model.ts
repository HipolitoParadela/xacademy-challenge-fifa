import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'clubs',
  timestamps: false,
})
export class Club extends Model {
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
  declare external_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
}
