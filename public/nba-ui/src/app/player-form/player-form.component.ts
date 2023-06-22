import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../teams/teams.component';
import { PlayerDataService } from '../player-data.service';

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

  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private playerService: PlayerDataService, private location: Location) {
    this.#playerForm = this._formBuilder.group({
      playerName: "",
      joinedTeam: "",
      joinedNBA: ""
    });
  }

  private _populateFormPlayerData(teamId: string, playerId: string): void {

    this.playerService.getOne(teamId, playerId).subscribe({
      next: (player) => {
        this.#playerForm = this._formBuilder.group({
          playerName: player.playerName,
          joinedTeam: player.joinedTeam,
          joinedNBA: player.joinedNBA
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
      complete: () => {
        // this.#successMessage = "";
      }
    })
  }

  ngOnInit(): void {
    const teamId = this.route.snapshot.params["teamId"];
    const playerId = this.route.snapshot.params["playerId"];

    if (teamId && playerId) { this._populateFormPlayerData(teamId, playerId); }
  }

  onSubmit(): void {
    console.log("Submit clicked");
    
    const teamId = this.route.snapshot.params["teamId"];
    const playerId = this.route.snapshot.params["playerId"];

    const thePlayer: Player = this.playerForm.value;

    if (playerId) {
      this.playerService.updateOne(teamId, playerId, thePlayer).subscribe({
        error: (err) => {
          this.errorMessage = err.error.message;
        },
        complete: () => {
          this.goBack();
        }
      });
    } else {
      this.playerService.addOne(teamId, thePlayer).subscribe({
        error: (err) => {
          this.errorMessage = err.error.message;
        },
        complete: () => {
          this.goBack();
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

}
