import {
  Column,
  DataType,
  Model,
  Table,
  HasMany
} from 'sequelize-typescript';

import { Skill } from '../skills/skill.model';
import { PlayerSkill } from '../player-skills/player-skill.model';


interface PlayerAttributes {
  id?: number;
  external_id: number;
  name: string;
  genero: string;
  image?: string;
}

@Table({
  tableName: 'players',
  timestamps: false,
})
export class Player extends Model<PlayerAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
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
    type: DataType.TEXT,
    allowNull: true,
  })
  declare image?: string;

  /* @BelongsToMany(() => Skill, () => PlayerSkill)
  declare skills: Skill[]; */

  @HasMany(
    () => PlayerSkill,
    {
      foreignKey:
        'player_id',
      as: 'skills',
    },
  )
  declare skills:
    PlayerSkill[];

  @HasMany(
    () => PlayerSkill,
    {
      foreignKey:
        'player_id',
      as: 'positionFilter',
    },
  )
  declare positionFilter:
    PlayerSkill[];

  @HasMany(
    () => PlayerSkill,
    {
      foreignKey:
        'player_id',
      as: 'clubFilter',
    },
  )
  declare clubFilter:
    PlayerSkill[];
}
