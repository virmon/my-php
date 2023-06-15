import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from './teams/teams.component';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {

  private baseUrl = "http://localhost:3001/api/teams";

  constructor(private http: HttpClient) { }

  public getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl);
  }
  
  public getOne(teamId: String): Observable<Team> {
    return this.http.get<Team>(this.baseUrl + `/${teamId}`);
  }
  
  public addOne(newTeam: Team): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, newTeam);
  }
  
  public updateOne(teamId: String, updatedTeam: Team): Observable<Team> {
    return this.http.patch<Team>(this.baseUrl + `/${teamId}`, updatedTeam);
  }
  
  public deleteOne(teamId: String): Observable<Team> {
    return this.http.delete<Team>(this.baseUrl + `/${teamId}`);
  }
}