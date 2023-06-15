import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TeamsComponent } from './teams/teams.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TeamComponent } from './team/team.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PlayerFormComponent } from './player-form/player-form.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    TeamsComponent,
    TeamComponent,
    NotFoundComponent,
    TeamFormComponent,
    PlayerFormComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: "",
        component: TeamsComponent
      },
      {
        path: "teams",
        component: TeamsComponent
      },
      {
        path: "teams/:teamId",
        component: TeamComponent
      },
      {
        path: "teamForm",
        component: TeamFormComponent
      },
      {
        path: "teamForm/:teamId",
        component: TeamFormComponent
      },
      {
        path: "playerForm/:teamId",
        component: PlayerFormComponent
      },
      {
        path: "playerForm/:teamId/:playerId",
        component: PlayerFormComponent
      },
      {
        path: "**",
        component: NotFoundComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
