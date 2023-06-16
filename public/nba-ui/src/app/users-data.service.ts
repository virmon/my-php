import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './register/register.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {

  private baseUrl = "http://localhost:3001/api/users";

  constructor(private http: HttpClient) { }

  public register(newUser: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, newUser);
  }

  public login(user: User): Observable<any> {
    const url = this.baseUrl + "/login";
    return this.http.post<any>(url , user);
  }
}
