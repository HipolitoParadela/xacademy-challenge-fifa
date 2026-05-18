import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import {
  environment
} from '../../../environments/environment';

import {
  LoginResponse
} from '../../shared/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http =
    inject(HttpClient);

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/auth/login`,
      {
        username,
        password
      }
    ).pipe(
      tap(res => {

        localStorage.setItem(
          'token',
          res.access_token
        );

      })
    );
  }

  logout(): void {

    localStorage.removeItem(
      'token'
    );
  }

  isLogged(): boolean {

    return !!localStorage.getItem(
      'token'
    );
  }

}