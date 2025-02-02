import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { ContactPageComponent } from "./components/contact/contact-page/contact-page.component";
import { EditDayPageComponent } from "./components/edit-day-page/edit-day-page.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { RegisterComponent } from "./components/register/register.component";
import { canActivateHomeGuard, canActivateLoginRegisterGuard } from "./guards/auth.guard";
import { canDeactivateDirty } from "./guards/dirty-check.guard";

const titlePrefix = "DayTrackr | ";
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: CalendarPageComponent,
    canActivate: [canActivateHomeGuard],
    title: titlePrefix + "Home"
  },
  {
    path: "contact",
    pathMatch: "full",
    component: ContactPageComponent,
    title: titlePrefix + "Contact",
    canActivate: [canActivateHomeGuard]
  },
  {
    path: "parser",
    pathMatch: "full",
    component: InputBoxComponent,
    title: titlePrefix + "Parser",
    canActivate: [canActivateHomeGuard]
  },
  {
    path: "edit/:date",
    pathMatch: "full",
    component: EditDayPageComponent,
    title: titlePrefix + "Edit",
    canActivate: [canActivateHomeGuard]
  },
  {
    path: "profile",
    pathMatch: "full",
    component: ProfilePageComponent,
    title: titlePrefix + "Profile",
    canActivate: [canActivateHomeGuard],
    canDeactivate: [canDeactivateDirty]
  },
  {
    path: "login",
    pathMatch: "full",
    component: LoginComponent,
    canActivate: [canActivateLoginRegisterGuard],
    title: titlePrefix + "Login"
  },
  {
    path: "register",
    pathMatch: "full",
    component: RegisterComponent,
    canActivate: [canActivateLoginRegisterGuard],
    title: titlePrefix + "Register"
  },
  { path: "**", redirectTo: "/" }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
