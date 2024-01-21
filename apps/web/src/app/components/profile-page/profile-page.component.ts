import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, Observable, Subject, switchMap, tap, timer } from "rxjs";
import { ResponseMessage } from "src/app/interfaces";
import { Profile, ProfileService } from "src/app/services/profile.service";
import { dirtyCheck } from "../../operators/dirty-check.operator";

export const store = new BehaviorSubject({
  firstName: "",
  lastName: "",
  preferredName: "",
  email: "",
  phone: ""
});

export const store$ = store.asObservable();

@UntilDestroy()
@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html"
})
export class ProfilePageComponent implements OnInit {
  userForm!: FormGroup;
  responseMessage$ = new Subject<ResponseMessage | null>();
  isDirty$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.userForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      preferredName: [""],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.pattern(/^\d{10}$/)]
    });
  }

  ngOnInit(): void {
    this.fetchProfile();
    this.isDirty$ = this.userForm.valueChanges.pipe(dirtyCheck(store$));
  }

  private fetchProfile() {
    this.profileService
      .fetchProfile()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (profile: Profile) => {
          this.patchForm(profile);
          this.setStore(profile);
        },
        error: (e: any) => {
          console.error("Could not fetch profile", e.message);
        }
      });
  }

  // Overwrite some form values
  private patchForm(data: Partial<Profile>) {
    this.userForm.patchValue(data);
  }

  // Set new default form value
  private setStore(data: Profile) {
    store.next(data);
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  hasError(fieldName: string, error: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.touched && field?.hasError(error));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      // Form is valid, perform your action here
      const formValue: Profile = this.userForm.value;
      this.profileService
        .save(this.userForm.value)
        .pipe(
          tap(response => this.responseMessage$.next(response)),
          switchMap(() => timer(5000).pipe(tap(() => this.responseMessage$.next(null))))
        )
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.setStore(formValue);
          }
        });
    } else {
      // Form is invalid, show error messages
      this.validateAllFormFields(this.userForm);
    }
  }
}
