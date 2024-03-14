import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UntilDestroy } from "@ngneat/until-destroy";
import { Observable, tap } from "rxjs";
import { Profile, ProfileDTO } from "src/app/interfaces";
import { dirtyCheck } from "../../operators/dirty-check.operator";
import { Store } from "@ngrx/store";
import { ProfileActions } from "src/app/store/actions/profile.actions";
import { selectProfile, selectResponseMsg } from "src/app/store/selectors/profile.selectors";

@UntilDestroy()
@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html"
})
export class ProfilePageComponent implements OnInit {
  userForm: FormGroup = this.fb.group({
    firstName: [""],
    lastName: [""],
    preferredName: [""],
    email: ["", [Validators.email]],
    phone: ["", Validators.pattern(/^\d{10}$/)]
  });
  isDirty$: Observable<boolean> = this.userForm.valueChanges.pipe(dirtyCheck(this.store.select(selectProfile)));
  responseMsg$ = this.store.select(selectResponseMsg);
  profile$ = this.store.select(selectProfile).pipe(tap((profile: ProfileDTO) => this.patchForm(profile)));

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(ProfileActions.getProfileDetails());
  }

  // Overwrite some form values
  private patchForm(data: Partial<Profile>) {
    this.userForm.patchValue(data);
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

      this.store.dispatch(ProfileActions.saveProfileDetails({ profileDto: formValue }));
    } else {
      // Form is invalid, show error messages
      this.validateAllFormFields(this.userForm);
    }
  }
}
