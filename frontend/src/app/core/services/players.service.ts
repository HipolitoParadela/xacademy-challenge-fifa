import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private api =
    'http://localhost:3000/players';

  constructor(
    private http: HttpClient,
  ) {}

  getPlayers(filters: any):
    Observable<any> {

    let params =
      new HttpParams();

      
      
    Object.keys(filters).forEach(
      (key) => {
        if (
          filters[key] !== null &&
          filters[key] !== undefined &&
          filters[key] !== ''
        ) {
          params = params.set(
            key,
            filters[key],
          );
        }
      },
    );

    console.log("getPlayers service", filters);
    console.log("getPlayers service", params.toString());

    return this.http.get(
      this.api,
      { params },
    );
  }
}