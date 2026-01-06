import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { combineLatest, map, Observable } from "rxjs";
import { ResponseMessage } from "../../interfaces";
import { AuthActions } from "../../store/actions/auth.actions";
import { selectResponseMsg } from "../../store/selectors/auth.selector";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html"
})
export class RegisterComponent {
  private store = inject(Store);

  username = new FormControl("", [Validators.required]);
  password = new FormControl("", [Validators.required, Validators.minLength(6)]);
  confirmPassword = new FormControl("", [Validators.required]);

  registerForm = new FormGroup({
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword
  });

  responseMessage$: Observable<ResponseMessage | null> = this.store.select(selectResponseMsg);

  passwordsMatch$ = combineLatest({
    password: this.password.valueChanges,
    confirmPassword: this.confirmPassword.valueChanges
  }).pipe(
    map(({ password, confirmPassword }) => {
      return password && confirmPassword && password === confirmPassword;
    })
  );

  onSubmit(): void {
    const username = this.username.value ?? "";
    const password = this.password.value ?? "";
    const confirmPassword = this.confirmPassword.value ?? "";

    // Do not submit if form is invalid or paswords are not equal
    if (this.registerForm.invalid || !(password && confirmPassword && password === confirmPassword)) return;

    this.store.dispatch(AuthActions.register({ username, password }));
  }
}
