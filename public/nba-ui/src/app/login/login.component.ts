import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersDataService } from '../users-data.service';
import { User } from '../register/register.component';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // @ViewChild("loginForm")
  // loginForm!: NgForm;

  username!: String;
  password!: String;

  constructor(private _usersService: UsersDataService, private _authentication: AuthenticationService) {

  }

  login() {
    const user: User = new User(this.username, this.password);
    this._usersService.login(user).subscribe({
      next: (user) => {
        this._authentication.token = user.token;
        this._authentication.isLoggedIn = true;
      },
      error: (err) => {
        console.log(err.message);
      },
      complete: () => {
        console.log("login Success",  this._authentication.token);
      }
    });
  }

  logout() {
    this._authentication.isLoggedIn = false;
  }
}
