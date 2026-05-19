import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  environment
} from '../../../environments/environment';

import {
  Club
} from '../../shared/models/club.model';

@Injectable({
  providedIn: 'root'
})
export class ClubsService {
  constructor(private http: HttpClient) {}

  getClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(`${environment.apiUrl}/clubs`).pipe(
      tap(clubs => console.log('Clubs:', clubs))
    );
  }

}