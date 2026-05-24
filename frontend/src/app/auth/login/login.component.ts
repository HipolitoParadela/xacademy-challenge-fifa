import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import {
  Router,
} from '@angular/router';

import {
  AuthService,
} from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl:
    './login.component.html',
})
export class LoginComponent
  implements OnInit {

  private fb =
    inject(FormBuilder);

  private auth =
    inject(AuthService);

  private router =
    inject(Router);

  loading = false;

  error = '';

  form =
    this.fb.group({
      username: [
        '',
        Validators.required,
      ],

      password: [
        '',
        Validators.required,
      ],
    });

  // ===== AUTO LOGIN =====

  ngOnInit() {

    const token =
      localStorage.getItem(
        'token',
      );

    if (token) {

      this.router.navigate([
        '/dashboard',
      ]);

      return;
    }
  }

  // ===== LOGIN =====

  submit() {

    if (
      this.form.invalid
    ) {
      return;
    }

    this.loading =
      true;

    this.error =
      '';

    const {
      username,
      password,
    } =
      this.form.getRawValue();

    this.auth.login(
      username!,
      password!,
    ).subscribe({

      next: () => {

        this.router.navigate([
          '/dashboard',
        ]);
      },

      error: () => {

        this.loading =
          false;

        this.error =
          'Usuario o contraseña inválidos';
      },
    });
  }
}