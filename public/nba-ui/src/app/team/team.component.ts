import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamDataService } from '../team-data.service';
import { Player, Team } from '../teams/teams.component';
import { PlayerDataService } from '../player-data.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  #team!: Team;
  #players!: Player[];
  #trophies: Number[] = [];

  errorMessage!: string;

  get team(): Team { return this.#team; }
  set team(team: Team) { this.#team = team; }

  get trophies(): Number[] { return this.#trophies; }
  set trophies(trophies: Number[]) { this.#trophies = trophies; }

  get players(): Player[] { return this.#players; }
  set players(players: Player[]) { this.#players = players; }

  get isLoggedIn(): boolean { return this._authentication.isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this._authentication.isLoggedIn = isLoggedIn; }

  constructor(private _teamsService: TeamDataService, private _playerService: PlayerDataService, private _route: ActivatedRoute, private _authentication: AuthenticationService, private _router: Router) {
    this.team = new Team();
    this.players = [];
  }

  ngOnInit(): void {
    const teamId: String = this._route.snapshot.params["teamId"];

    this._teamsService.getOne(teamId).subscribe({
      next: (theTeam) => {
        this.team = theTeam;
        this.players = theTeam.players;
        this.trophies = new Array<Number>(this.team.championshipsWon);        
      },
      error: (err) => {
        console.log(err.error);
        this.errorMessage = err.error;
      },
      complete: () => {

      }
    })
  }

  onDeletePlayer(playerId: String): void {
    this._playerService.deleteOne(this.team._id, playerId).subscribe({
      next: (team) => {
        console.log("Deleted player", team.players);
        this.players = team.players;
      },
      error: (err) => {
        console.log("Error deleting player", err);
      },
      complete: () => {
        
      }
    });
  }

  onDeleteTeam(): void {
    this._teamsService.deleteOne(this.team._id).subscribe({
      next: (team) => {
        this.players = team.players;
      },
      error: (err) => {
        console.log("Error deleting player", err);
      },
      complete: () => {
        this.goBack();
      }
    });
  }

  goBack(): void {
    this._router.navigate(['teams']);
  }
}
