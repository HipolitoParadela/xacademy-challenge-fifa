import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface PositionAttributes {
  id?: number;
  name: string;
}

@Table({
  tableName: 'positions',
  timestamps: false,
})
export class Position extends Model<PositionAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;
}
