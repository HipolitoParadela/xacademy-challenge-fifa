import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

interface SkillAttributes {
  id?: number;
  name: string;
}

@Table({
  tableName: 'skills',
  timestamps: false,
})
export class Skill extends Model<SkillAttributes> {
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
