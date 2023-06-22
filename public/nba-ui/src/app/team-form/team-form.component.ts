import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamDataService } from '../team-data.service';
import { Team } from '../teams/teams.component';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  #teamForm!: FormGroup;
  get teamForm(): FormGroup { return this.#teamForm; }

  constructor(private _formBuilder: FormBuilder, private _teamService: TeamDataService, private _route: ActivatedRoute, private _router: Router, private _location: Location) {
    this.#teamForm = this._formBuilder.group({
      teamName: "",
      established: "",
      championshipsWon: ""
    });
  }

  ngOnInit(): void {
    const teamId = this._route.snapshot.params["teamId"];
    if (teamId) { this._populateFormTeamData(teamId); }
  }

  private _populateFormTeamData(teamId: string): void {
    this._teamService.getOne(teamId).subscribe((team) => {      
      this.#teamForm = this._formBuilder.group({
        teamName: team.teamName,
        established: team.established,
        championshipsWon: team.championshipsWon
      });
    })
  }

  onSubmit(): void {
    const teamId = this._route.snapshot.params["teamId"];
    const theTeam: Team = this.#teamForm.value;

    if (teamId) {
      this._teamService.updateOne(teamId, theTeam).subscribe({
        next: (team) => {
          console.log("Team updated", team);
        },
        error: (err) => {

        },
        complete: () => {
          this.goBack();
        }
      });
    } else {
      this._teamService.addOne(theTeam).subscribe({
        next: (team) => {
          console.log("New team added", team);
        },
        error: (err) => {

        },
        complete: () => {
          this._router.navigate(['teams']);
        }
      });
    }
  }

  goBack(): void {
    this._location.back();
  }
}
