import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { environment } from 'src/environments/environment.development';

export class Player {
  #_id!: String;
  #playerName!: String;
  #joinedTeam!: Number;
  #joinedNBA!: Number;

  get _id(): String { return this.#_id; }
  set _id(_id: String) { this.#_id = _id; }

  get playerName(): String { return this.#playerName; }
  set playerName(playerName: String) { this.#playerName = playerName; }

  get joinedTeam(): Number { return this.#joinedTeam; }
  set joinedTeam(joinedTeam: Number) { this.#joinedTeam = joinedTeam; }

  get joinedNBA(): Number { return this.#joinedNBA; }
  set joinedNBA(joinedNBA: Number) { this.#joinedNBA = joinedNBA; }

  constructor() { }
}

export class Team {
  #_id!: String;
  #teamName!: String;
  #established!: Number;
  #championshipsWon!: Number;
  #players!: Player[];

  get _id(): String { return this.#_id; }
  set _id(_id: String) { this.#_id = _id; }

  get teamName(): String { return this.#teamName; }
  set teamName(teamName: String) { this.#teamName = teamName; }

  get established(): Number { return this.#established; }
  set established(established: Number) { this.#established = established; }

  get championshipsWon(): Number { return this.#championshipsWon; }
  set championshipsWon(championshipsWon: Number) { this.#championshipsWon = championshipsWon; }

  get players(): Player[] { return this.#players; }
  set players(players: Player[]) { this.#players = players; }

  constructor() { }

}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teams!: Team[];

  #errorMessage!: string;
  get errorMessage(): string { return this.#errorMessage; }
  set errorMessage(errorMessage: string) { this.#errorMessage = errorMessage; }

  constructor(private _teamsService: TeamDataService) { }

  _fillTeams(teams: Team[]) {
    this.teams = teams;
    this.errorMessage = "";
  }

  ngOnInit(): void {
    this._teamsService.getAll().subscribe({
      next: (teams) => { this._fillTeams(teams); },
      error: (err) => { this.errorMessage = environment.TEAMS_ERROR_MESSAGE; }
    })
  }
}
