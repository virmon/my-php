import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from './register/register.component';
import { HttpClient } from '@angular/common/http';
import { LoginToken } from './login/login.component';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  constructor(private _http: HttpClient) { }

  public register(newUser: User): Observable<User> {
    return this._http.post<User>(environment.USERS_BASE_URL, newUser);
  }

  public login(user: User): Observable<LoginToken> {
    return this._http.post<LoginToken>(environment.LOGIN_BASE_URL , user);
  }
}
