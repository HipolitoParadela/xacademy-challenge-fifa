import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'players', timestamps: false,
})
export class Player extends Model {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare genero: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image: string;
}
