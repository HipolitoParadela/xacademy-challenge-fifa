import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface UserAttributes {
  id?: number;
  username: string;
  email: string;
  password: string;
}

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model<UserAttributes> {
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
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}
