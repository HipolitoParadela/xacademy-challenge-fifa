import {
  Injectable,
  inject,
} from '@angular/core';

import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import { environment }
  from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {

  private http =
    inject(HttpClient);

  private api =
    `${environment.apiUrl}/players`;

  getPlayers(
    params: any,
  ) {
    let httpParams =
      new HttpParams();

    Object.keys(
      params,
    ).forEach((k) => {
      if (
        params[k] !== null &&
        params[k] !== undefined &&
        params[k] !== ''
      ) {
        httpParams =
          httpParams.set(
            k,
            params[k],
          );
      }
    });

    return this.http.get<any>(
      this.api,
      {
        params:
          httpParams,
      },
    );
  }

  getById(
    id: number,
  ) {
    return this.http.get<any>(
      `${this.api}/${id}`,
    );
  }

  // NUEVO
  getProfile(
    id: number,
  ) {
    return this.http.get<any>(
      `${this.api}/${id}/profile`,
    );
  }

  // NUEVO
  getEvolution(
    id: number,
  ) {
    return this.http.get<any>(
      `${this.api}/${id}/evolution`,
    );
  }

  create(
    data: any,
  ) {
    return this.http.post(
      this.api,
      data,
    );
  }

  update(
    id: number,
    data: any,
  ) {
    console.log("update player payload", data);

    return this.http.patch(

      `${this.api}/${id}`,
      data,
    );
  }
}