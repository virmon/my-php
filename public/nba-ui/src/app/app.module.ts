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
import { ProfileComponent } from './profile/profile.component';
import { environment } from 'src/environments/environment.development';

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
    LoginComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: environment.HOME_BASE_PATH,
        component: TeamsComponent
      },
      {
        path: environment.TEAMS_BASE_PATH,
        component: TeamsComponent
      },
      {
        path: `${environment.TEAMS_BASE_PATH}/:teamId`,
        component: TeamComponent
      },
      {
        path: environment.TEAM_FORM_BASE_PATH,
        component: TeamFormComponent
      },
      {
        path: `${environment.TEAM_FORM_BASE_PATH}/:teamId`,
        component: TeamFormComponent
      },
      {
        path: `${environment.PLAYER_FORM_BASE_PATH}/:teamId`,
        component: PlayerFormComponent
      },
      {
        path: `${environment.PLAYER_FORM_BASE_PATH}/:teamId/:playerId`,
        component: PlayerFormComponent
      },
      {
        path: environment.REGISTER_BASE_PATH,
        component: RegisterComponent
      },
      {
        path: environment.LOGIN_BASE_PATH,
        component: LoginComponent
      },
      {
        path: environment.PROFILE_BASE_PATH,
        component: ProfileComponent
      },
      {
        path: environment.NOT_FOUND_BASE_PATH,
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
