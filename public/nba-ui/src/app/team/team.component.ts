import { Component, OnInit } from '@angular/core';
import { TeamDataService } from '../team-data.service';
import { Player, Team } from '../teams/teams.component';
import { ActivatedRoute } from '@angular/router';
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

  get team(): Team { return this.#team; }
  set team(team: Team) { this.#team = team; }

  get trophies(): Number[] { return this.#trophies; }
  set trophies(trophies: Number[]) { this.#trophies = trophies; }

  get players(): Player[] { return this.#players; }
  set players(players: Player[]) { this.#players = players; }

  get isLoggedIn(): boolean { return this._authentication.isLoggedIn; }
  set isLoggedIn(isLoggedIn: boolean) { this._authentication.isLoggedIn = isLoggedIn; }

  constructor(private _teamsService: TeamDataService, private _playerService: PlayerDataService, private _route: ActivatedRoute, private _authentication: AuthenticationService) {
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
        console.log("Error fetching one team", err);
      },
      complete: () => {

      }
    })
  }

  onDelete(playerId: String): void {
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
}
