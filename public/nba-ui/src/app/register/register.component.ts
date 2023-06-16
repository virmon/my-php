import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersDataService } from '../users-data.service';

export class User {
  #name!: String;
  #username!: String;
  #password!: String;
  #repeatPassword!: String;

  get name(): String { return this.#name; }
  set name(name: String) { this.#name = name; }

  get username(): String { return this.#username; }
  set username(username: String) { this.#username = username; }

  get password(): String { return this.#password; }
  set password(password: String) { this.#password = password; }

  get repeatPassword(): String { return this.#repeatPassword; }
  set repeatPassword(repeatPassword: String) { this.#repeatPassword = repeatPassword; }

  constructor(username: String, password: String) { 
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

  constructor(private _formBuilder: FormBuilder, private _usersService: UsersDataService) {
    this.#registerForm = this._formBuilder.group({
      name: "",
      username: "",
      password: "",
      repeatPassword: ""
    });
  }

  register(form: FormGroup) {
    // const newUser = new User(form.value.username, form.value.password);

    this._usersService.register(form.value).subscribe({
      next: (result) => {
        console.log(result);
        
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {

      }
    });
  }

}