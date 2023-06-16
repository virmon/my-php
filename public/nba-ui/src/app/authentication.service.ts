import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  #isLoggedIn: boolean = false;
  #token!: string;

  get token() { return this.#token; }
  set token(token: string) { this.#token = token; }

  get isLoggedIn() { return this.#isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) {
    if (true == isLoggedIn) {
      localStorage.setItem("loggedIn", this.token);
    } else {
      localStorage.clear();
    }
  }

  constructor() { }
}
