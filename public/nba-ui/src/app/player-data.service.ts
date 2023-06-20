import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, Team } from './teams/teams.component';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {

  private baseUrl = environment.TEAMS_BASE_URL;

  constructor(private _http: HttpClient) { }

  public getAll(teamId: String): Observable<Player[]> {
    const url = `${this.baseUrl}/${teamId}/players`;
    return this._http.get<Player[]>(url);
  }
  
  public getOne(teamId: String, playerId: String): Observable<Player> {
    const url = `${this.baseUrl}/${teamId}/players/${playerId}`;
    return this._http.get<Player>(url);
  }
  
  public addOne(teamId: String, newPlayer: Player): Observable<Player> {
    const url = `${this.baseUrl }/${teamId}/players`;
    return this._http.post<Player>(url, newPlayer);
  }
  
  public updateOne(teamId: String, playerId: String, updatedTeam: Player): Observable<Player> {
    const url = `${this.baseUrl}/${teamId}/players/${playerId}`;
    return this._http.put<Player>(url, updatedTeam);
  }
  
  public deleteOne(teamId: String, playerId: String): Observable<Team> {
    const url = this.baseUrl + `/${teamId}/players/${playerId}`;
    return this._http.delete<Team>(url);
  }
}
