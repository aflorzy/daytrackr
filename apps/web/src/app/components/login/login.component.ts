import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AccessToken } from 'src/common/interfaces';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get usernameField() {
    return this.loginForm.get('username');
  }
  set username(username: string) {
    this.loginForm.get('username')?.setValue(username);
  }
  get passwordField() {
    return this.loginForm.get('password');
  }
  set password(password: string) {
    this.loginForm.get('password')?.setValue(password);
  }

  ngOnInit(): void {
    const registerCredentials = this.storageService.getItemFromStorage('credentials');
    if (registerCredentials) {
      console.log("Got creds");
      this.username = registerCredentials.username;
      this.password = registerCredentials.password;
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(username, password).subscribe(
        (response: AccessToken) => {
          this.authService.token = response;
          this.loginForm.reset();
          this.router.navigate(['']);
        },
        (error) => {
          this.loginError = error.error.message;
        }
      );
    }
  }
}
