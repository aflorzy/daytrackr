import { Component } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { ResponseMessage } from "src/app/interfaces";
import { AuthActions } from "src/app/store/actions/auth.actions";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });

  loginError: string | null = null;
  responseMessage$ = new Subject<ResponseMessage>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  get usernameField() {
    return this.loginForm.get("username");
  }
  get passwordField() {
    return this.loginForm.get("password");
  }

  onSubmit() {
    const username = this.usernameField?.value ?? "";
    const password = this.passwordField?.value ?? "";

    this.store.dispatch(AuthActions.login({ username, password }));
  }
}
