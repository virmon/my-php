import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TeamDataService } from '../team-data.service';
import { ActivatedRoute } from '@angular/router';

import { Team } from '../teams/teams.component';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  #teamForm!: FormGroup;
  get teamForm(): FormGroup { return this.#teamForm; }

  constructor(private _formBuilder: FormBuilder, private teamService: TeamDataService, private route: ActivatedRoute) {
    this.#teamForm = this._formBuilder.group({
      teamName: "",
      established: "",
      championshipsWon: ""
    });
  }

  ngOnInit(): void {
    const teamId = this.route.snapshot.params["teamId"];
    if (teamId) { this._populateFormTeamData(teamId); }
  }

  private _populateFormTeamData(teamId: string): void {
    this.teamService.getOne(teamId).subscribe(team => {      
      this.#teamForm = this._formBuilder.group({
        teamName: team.teamName,
        established: team.established,
        championshipsWon: team.championshipsWon
      });
    })
  }

  onSubmit(): void {
    const teamId = this.route.snapshot.params["teamId"];
    const theTeam: Team = this.#teamForm.value;

    if (teamId) {
      this.teamService.updateOne(teamId, theTeam).subscribe(team => {
        console.log("Team updated", team);
      })
    } else {
      this.teamService.addOne(theTeam).subscribe(team => {
        console.log("New team added", team);
      });
    }
  }
}
