import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

import { Team } from './teams/teams.component';

@Injectable({
  providedIn: 'root'
})
export class TeamDataService {

  private baseUrl = environment.TEAMS_BASE_URL;

  constructor(private _http: HttpClient) { }

  public getAll(): Observable<Team[]> {
    return this._http.get<Team[]>(this.baseUrl);
  }
  
  public getOne(teamId: String): Observable<Team> {
    return this._http.get<Team>(`${this.baseUrl}/${teamId}`);
  }
  
  public addOne(newTeam: Team): Observable<Team> {
    return this._http.post<Team>(this.baseUrl, newTeam);
  }
  
  public updateOne(teamId: String, updatedTeam: Team): Observable<Team> {
    return this._http.patch<Team>(`${this.baseUrl}/${teamId}`, updatedTeam);
  }
  
  public deleteOne(teamId: String): Observable<Team> {
    return this._http.delete<Team>(`${this.baseUrl}/${teamId}`);
  }
}