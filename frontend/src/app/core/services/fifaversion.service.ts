import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  environment
} from '../../../environments/environment';

import {
  FifaVersion
} from '../../shared/models/fifaversion.model';

@Injectable({
  providedIn: 'root'
})
export class FifaVersionService {
  constructor(private http: HttpClient) {}

  getFifaVersions(): Observable<FifaVersion[]> {
    return this.http.get<FifaVersion[]>(`${environment.apiUrl}/fifaversions`).pipe(
      tap(versions => console.log('FIFA Versions:', versions))
    );
  }

}