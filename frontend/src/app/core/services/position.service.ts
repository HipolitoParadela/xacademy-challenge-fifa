import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  environment
} from '../../../environments/environment';

/* export interface Position {
  id: number;
  name: string;
} */

import {
  Position
} from '../../shared/models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient) {}

  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(`${environment.apiUrl}/positions`).pipe(
      tap(positions => console.log('Positions:', positions))
    );
  }

}