import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersDataService } from '../users-data.service';
import { User } from '../register/register.component';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

export class LoginToken {
  #token!: string;

  get token(): string { return this.#token; }
  set token(token: string) { this.#token = token; }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  #errorMessage!: string

  get name(): string { return this._authentication.name; }

  get isLoggedIn() { return this._authentication.isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this._authentication.isLoggedIn = isLoggedIn; }

  get errorMessage(): string { return this.#errorMessage; }
  set errorMessage(errorMessage: string) { this.#errorMessage = errorMessage; }

  constructor(private _usersService: UsersDataService, private _authentication: AuthenticationService, private _router: Router) { }

  ngOnInit(): void {
    const hasToken = !!localStorage.getItem(environment.TOKEN_KEY);
    this.isLoggedIn = hasToken;
  }

  login() {
    const user: User = new User(this.username, this.password);
    this._usersService.login(user).subscribe({
      next: (loginToken) => { this._authentication.login(loginToken); },
      error: (err) => { this.errorMessage = err.error.message; },
      complete: () => { this._router.navigate([environment.PROFILE_BASE_PATH]); }
    });
  }
}
