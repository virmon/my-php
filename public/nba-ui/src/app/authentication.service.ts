import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LoginToken } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #isLoggedIn!: boolean;
  #name!: string;

  get name() { return this.#name; }
  set name(name: string) { this.#name = name; }

  get isLoggedIn() { return this.#isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this.#isLoggedIn = isLoggedIn; }

  constructor() { }

  login(token: LoginToken) {
    this.isLoggedIn = true;
    localStorage.setItem("token", token.token);
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.clear();
  }
}
