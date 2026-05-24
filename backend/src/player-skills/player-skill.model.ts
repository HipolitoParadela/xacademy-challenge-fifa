import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';

import { Player } from '../players/players.model';
import { Skill } from '../skills/skill.model';
import { FifaVersion } from '../fifa-versions/fifa-version.model';


interface PlayerSkillAttributes {
  id?: number;
  player_id: number;
  fifa_version_id: number;
  skill_id: number;
  value: string;
}

@Table({
  tableName: 'player_skills',
  timestamps: false,
})
export class PlayerSkill extends Model<PlayerSkillAttributes> {
  
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Player)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare player_id: number;

  @ForeignKey(() => FifaVersion)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare fifa_version_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare value: string;

  
  @BelongsTo(() => FifaVersion, {
    foreignKey: 'fifa_version_id',
    as: 'fifaVersion',
  })
  declare fifaVersion: FifaVersion;

  @BelongsTo(() => Skill, {
    foreignKey: 'skill_id',
    as: 'skill',
  })
  declare skill: Skill;

  @ForeignKey(() => Skill)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare skill_id: number;


  

  @BelongsTo(
    () => Player,
    {
      foreignKey:
        'player_id',
      as: 'player',
    },
  )
  declare player:
    Player;
}
