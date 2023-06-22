import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersDataService } from '../users-data.service';
import { environment } from 'src/environments/environment.development';

export class User {
  #name!: string;
  #username!: string;
  #password!: string;
  #repeatPassword!: string;

  get name(): string { return this.#name; }
  set name(name: string) { this.#name = name; }

  get username(): string { return this.#username; }
  set username(username: string) { this.#username = username; }

  get password(): string { return this.#password; }
  set password(password: string) { this.#password = password; }

  get repeatPassword(): string { return this.#repeatPassword; }
  set repeatPassword(repeatPassword: string) { this.#repeatPassword = repeatPassword; }

  constructor(username: string, password: string) { 
    this.username = username;
    this.password = password;
  }

  toJSON() {
    return {
      "name": this.name,
      "username": this.username,
      "password": this.password
    }
  }

}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  #registerForm!: FormGroup;
  get registerForm(): FormGroup { return this.#registerForm; }

  #errorMessage!: string;
  get errorMessage(): string { return this.#errorMessage; }
  set errorMessage(errorMessage: string) { this.#errorMessage = errorMessage; }
    
  #successMessage!: string
  get successMessage(): string { return this.#successMessage; }
  set successMessage(successMessage: string) { this.#successMessage = successMessage; }

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersDataService) {
    this._initializeForm();
  }

  _initializeForm() {
    this.#registerForm = this._formBuilder.group({
      name: "",
      username: "",
      password: "",
      repeatPassword: ""
    });
  }

  register(form: FormGroup) {
    this._usersService.register(form.value).subscribe({
      next: () => {
        this.errorMessage = "";
        this.successMessage = environment.REGISTER_SUCCESS_MESSAGE;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.successMessage = "";
      },
      complete: () => { this._initializeForm(); }
    });
  }

}