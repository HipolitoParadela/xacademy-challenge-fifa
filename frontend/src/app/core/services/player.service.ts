import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  Player
} from '../../shared/models/player.model';

import {
  PlayerSkills
} from '../../shared/models/player-skills.model';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  private http =
    inject(HttpClient);

  getPlayers(
    search = ''
  ): Observable<Player[]> {

    return this.http.get<Player[]>(
      `${environment.apiUrl}/players`,
      {
        params: {
          search
        }
      }
    );
  }

  getPlayer(
    id: number
  ): Observable<Player> {

    return this.http.get<Player>(
      `${environment.apiUrl}/players/${id}`
    );
  }

  getSkills(
    playerId: number,
    fifaVersionId = 21
  ): Observable<PlayerSkills> {

    return this.http.get<PlayerSkills>(
      `${environment.apiUrl}/player-skills/${playerId}`,
      {
        params: {
          fifaVersionId
        }
      }
    );
  }

}