import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { LoginToken } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #isLoggedIn!: boolean;
  #name!: string;

  get name() {
    const token = localStorage.getItem("token") as string;
    return this._jwt.decodeToken(token).name as string;
    // return this.#name;
  }
  set name(name: string) { this.#name = name; }

  get isLoggedIn() { return this.#isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this.#isLoggedIn = isLoggedIn; }

  constructor(private _jwt: JwtHelperService) { }

  getToken() {
    return localStorage.getItem("token");
  }

  login(token: LoginToken) {
    this.isLoggedIn = true;
    localStorage.setItem("token", token.token);
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.clear();
  }
}
