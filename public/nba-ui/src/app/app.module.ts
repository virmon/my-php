import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TeamsComponent } from './teams/teams.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TeamComponent } from './team/team.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationInterceptor } from './authentication.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    TeamsComponent,
    TeamComponent,
    NotFoundComponent,
    TeamFormComponent,
    PlayerFormComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
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
        path: "register",
        component: RegisterComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "**",
        component: NotFoundComponent
      }
    ])
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
