import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Player, Team } from './teams/teams.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataService {

  private baseUrl = "http://localhost:3001/api/teams";

  constructor(private http: HttpClient) { }

  public getAll(teamId: String): Observable<Player[]> {
    const url = this.baseUrl + `/${teamId}/players`;
    return this.http.get<Player[]>(url);
  }
  
  public getOne(teamId: String, playerId: String): Observable<Player> {
    return this.http.get<Player>(this.baseUrl + `/${teamId}/players/${playerId}`);
  }
  
  public addOne(teamId: String, newPlayer: Player): Observable<Player> {
    const url = this.baseUrl + `/${teamId}/players`;

    return this.http.post<Player>(url, newPlayer);
  }
  
  public updateOne(teamId: String, playerId: String, updatedTeam: Player): Observable<Player> {
    return this.http.put<Player>(this.baseUrl + `/${teamId}/players/${playerId}`, updatedTeam);
  }
  
  public deleteOne(teamId: String, playerId: String): Observable<Team> {
    const url = this.baseUrl + `/${teamId}/players/${playerId}`;

    return this.http.delete<Team>(url);
  }
}
