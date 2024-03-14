import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { Subject } from "rxjs";
import { ResponseMessage } from "src/app/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { StatusType } from "../../enums";

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
    private authService: AuthService,
    private router: Router
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
    if (this.loginForm.valid) {
      const username = this.loginForm.get("username")?.value;
      const password = this.loginForm.get("password")?.value;

      this.authService
        .login(username, password)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.responseMessage$.next({
              message: "Successfully logged in",
              statusType: StatusType.SUCCESS
            });

            this.loginForm.reset();
            this.router.navigate([""]);
          },
          error: () => {
            this.responseMessage$.next({
              message: "Failed to login. Please check your credentials",
              statusType: StatusType.ERROR
            });
          }
        });
    }
  }
}
