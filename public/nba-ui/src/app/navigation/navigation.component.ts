import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  get isLoggedIn(): boolean { return this._authentication.isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this._authentication.isLoggedIn = isLoggedIn; }

  constructor(private _route: Router, private _authentication: AuthenticationService) {
    console.log("Navigation constructor called");
  }

  ngOnInit(): void {
    const hasToken = !!localStorage.getItem("token");
    this.isLoggedIn = hasToken;
  }

  logout() {
    this._authentication.logout();
    this._route.navigate(['login']);
  }
}
