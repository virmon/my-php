import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamDataService } from '../team-data.service';
import { Team } from '../teams/teams.component';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  #teamForm!: FormGroup;
  get teamForm(): FormGroup { return this.#teamForm; }

  #errorMessage!: string;
  get errorMessage(): string { return this.#errorMessage; }
  set errorMessage(errorMessage: string) { this.#errorMessage = errorMessage; }

  private _initializeForm() {
    this.#teamForm = this._formBuilder.group({
      teamName: "",
      established: "",
      championshipsWon: ""
    });
  }

  constructor(private _formBuilder: FormBuilder, private _teamService: TeamDataService, private _route: ActivatedRoute, private _router: Router, private _location: Location) {
    this._initializeForm();
  }

  ngOnInit(): void {
    const teamId = this._route.snapshot.params[environment.TEAM_ID_KEY];
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
    const teamId = this._route.snapshot.params[environment.TEAM_ID_KEY];
    const theTeam: Team = this.#teamForm.value;

    if (teamId) {
      this._teamService.updateOne(teamId, theTeam).subscribe({
        next: () => { this._initializeForm(); },
        error: (err) => { this.errorMessage = err.error.message; },
        complete: () => { this.goBack(); }
      });
    } else {
      this._teamService.addOne(theTeam).subscribe({
        next: () => { this._initializeForm(); },
        error: (err) => { this.errorMessage = err.error.message; },
        complete: () => { this._router.navigate([environment.TEAMS_BASE_PATH]); }
      });
    }
  }

  goBack(): void {
    this._location.back();
  }
}
