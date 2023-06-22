import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../teams/teams.component';
import { PlayerDataService } from '../player-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.css']
})
export class PlayerFormComponent implements OnInit {

  #playerForm!: FormGroup;
  get playerForm(): FormGroup { return this.#playerForm; }

  #errorMessage!: string;
  get errorMessage(): string { return this.#errorMessage; }
  set errorMessage(errorMessage: string) { this.#errorMessage = errorMessage; }

  _initializeForm(): void {
    this.#playerForm = this._formBuilder.group({
      playerName: "",
      joinedTeam: "",
      joinedNBA: ""
    });
  }

  constructor(private _formBuilder: FormBuilder, private _route: ActivatedRoute, private _playerService: PlayerDataService, private location: Location) {
    this._initializeForm();
  }

  private _populateFormPlayerData(teamId: string, playerId: string): void {

    this._playerService.getOne(teamId, playerId).subscribe({
      next: (player) => {
        this.#playerForm = this._formBuilder.group({
          playerName: player.playerName,
          joinedTeam: player.joinedTeam,
          joinedNBA: player.joinedNBA
        });
      },
      error: (err) => { this.errorMessage = err.message; }
    })
  }

  ngOnInit(): void {
    const teamId = this._route.snapshot.params[environment.TEAM_ID_KEY];
    const playerId = this._route.snapshot.params[environment.PLAYER_ID_KEY];

    if (teamId && playerId) { this._populateFormPlayerData(teamId, playerId); }
  }

  onSubmit(): void {    
    const teamId = this._route.snapshot.params[environment.TEAM_ID_KEY];
    const playerId = this._route.snapshot.params[environment.PLAYER_ID_KEY];

    const thePlayer: Player = this.playerForm.value;

    if (playerId) {
      this._playerService.updateOne(teamId, playerId, thePlayer).subscribe({
        error: (err) => { this.errorMessage = err.error.message; },
        complete: () => { this.goBack(); }
      });
    } else {
      this._playerService.addOne(teamId, thePlayer).subscribe({
        error: (err) => { this.errorMessage = err.error.message; },
        complete: () => { this.goBack(); }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
