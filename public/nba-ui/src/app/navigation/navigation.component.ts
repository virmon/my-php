import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  get isLoggedIn(): boolean { return this._authentication.isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this._authentication.isLoggedIn = isLoggedIn; }

  constructor(private _router: Router, private _authentication: AuthenticationService) { }

  ngOnInit(): void {
    const hasToken = !!localStorage.getItem(environment.TOKEN_KEY);
    this.isLoggedIn = hasToken;
  }

  logout() {
    this._authentication.logout();
    this._router.navigate([environment.LOGIN_BASE_PATH]);
  }
}
