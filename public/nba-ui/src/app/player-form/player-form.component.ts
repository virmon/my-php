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


  constructor(private _formBuilder: FormBuilder, private route: ActivatedRoute, private playerService: PlayerDataService, private location: Location) {
    this.#playerForm = this._formBuilder.group({
      playerName: "",
      joinedTeam: "",
      joinedNBA: ""
    });
  }

  private _populateFormPlayerData(teamId: string, playerId: string): void {

    this.playerService.getOne(teamId, playerId).subscribe(player => {   
      console.log("_populateFormPlayerData", player);
      this.#playerForm = this._formBuilder.group({
        playerName: player.playerName,
        joinedTeam: player.joinedTeam,
        joinedNBA: player.joinedNBA
      });
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
        next: (player) => {
          console.log("Player updated", player);
        },
        error: (err) => {
          console.log("Error updating player", err);
        },
        complete: () => {
          this.goBack();
        }
      });
    } else {
      this.playerService.addOne(teamId, thePlayer).subscribe({
        next: (player) => {
          console.log("New player added", player);
        },
        error: (err) => {
          console.log("Error adding player", err);
        },
        complete: () => {
          this.goBack();
        }
      });
      
    }
  }

  goBack(): void {
    console.log("Back clicked");
    this.location.back();
  }

}
