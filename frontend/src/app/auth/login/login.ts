import {
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  Router,
} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl:
    './login.html',
  styleUrl:
    './login.css',
})
export class Login
  implements OnInit {

  private router =
    inject(Router);

  ngOnInit() {

    
    const token =
      localStorage.getItem(
        'token',
      );
      
      console.log("ngOnInit token", token);
    

    if (token) {

      this.router.navigate([
        '/dashboard',
      ]);

      return;
    }
  }
}