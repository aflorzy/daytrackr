import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AuthActions } from "src/app/store/actions/auth.actions";
import { selectLoginIsLoading, selectResponseMsg } from "../../store/selectors/auth.selector";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})
export class LoginComponent {
  private store = inject(Store);

  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required]);

  loginForm = new FormGroup({
    username: this.username,
    password: this.password
  });

  responseMessage$ = this.store.select(selectResponseMsg);
  loading$ = this.store.select(selectLoginIsLoading);

  handleSubmitClicked(): void {
    const username = this.username.value ?? "";
    const password = this.password.value ?? "";

    if (this.loginForm.invalid) return;

    this.store.dispatch(AuthActions.login({ username, password }));
  }
}
