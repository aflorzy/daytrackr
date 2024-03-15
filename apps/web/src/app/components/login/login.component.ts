import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Subject } from "rxjs";
import { ResponseMessage } from "src/app/interfaces";
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/actions/auth.actions";

@UntilDestroy()
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  responseMessage$ = new Subject<ResponseMessage>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });
  }

  get usernameField() {
    return this.loginForm.get("username");
  }
  set username(username: string) {
    this.loginForm.get("username")?.setValue(username);
  }
  get passwordField() {
    return this.loginForm.get("password");
  }
  set password(password: string) {
    this.loginForm.get("password")?.setValue(password);
  }

  onSubmit() {
    const username = this.loginForm.get("username")?.value;
    const password = this.loginForm.get("password")?.value;

    this.store.dispatch(AuthActions.login({ username, password }));
  }
}
