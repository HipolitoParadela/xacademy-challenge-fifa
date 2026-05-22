import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment }
  from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerSkillsService {

  private http =
    inject(HttpClient);

  private api =
    `${environment.apiUrl}/player-skills`;

  // ===== GET PLAYER SKILLS =====

  getPlayerSkills(
    playerId: number,
    fifaVersionId: number,
  ) {

    return this.http.get<any>(
      `${this.api}/${playerId}/?fifaVersionId=${fifaVersionId}`,
    );
  }

  // ===== CREATE / UPSERT =====
  savePlayerSkills(
    playerId: number,
    fifaVersionId: number,
    skills: any,
  ) {

    const payload = {
      player_id:
        playerId,

      fifa_version_id:
        fifaVersionId,

      skills: {
        ...skills,

        pace:
          Number(
            skills.pace || 0,
          ),

        shooting:
          Number(
            skills.shooting ||
            0,
          ),

        passing:
          Number(
            skills.passing ||
            0,
          ),

        dribbling:
          Number(
            skills.dribbling ||
            0,
          ),

        defending:
          Number(
            skills.defending ||
            0,
          ),

        physic:
          Number(
            skills.physic ||
            0,
          ),

        overall:
          Number(
            skills.overall ||
            0,
          ),

        potential:
          Number(
            skills.potential ||
            0,
          ),

        age:
          Number(
            skills.age || 0,
          ),

        value_eur:
          Number(
            skills.value_eur ||
            0,
          ),
      },
    };

    console.log(
      'savePlayerSkills payload',
      payload,
    );

    return this.http.post(
      `${environment.apiUrl}/player-skills/upsert`,
      payload,
    );
  }



}