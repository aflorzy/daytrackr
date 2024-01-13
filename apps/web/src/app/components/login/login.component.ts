import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { AccessToken } from "src/common/interfaces";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

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

      this.authService.login(username, password).subscribe(
        (response: AccessToken) => {
          this.authService.token = response;
          this.loginForm.reset();
          this.router.navigate([""]);
        },
        (e: HttpErrorResponse) => {
          this.loginError = e.error.message;
        }
      );
    }
  }
}
