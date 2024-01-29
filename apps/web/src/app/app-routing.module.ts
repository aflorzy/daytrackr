import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { ContactPageComponent } from "./components/contact/contact-page/contact-page.component";
import { EditDayPageComponent } from "./components/edit-day-page/edit-day-page.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthGuard } from "./guards/auth.guard";
import { DirtyCheckGuard } from "./guards/dirty-check.guard";

const titlePrefix = "DayTrackr | ";
const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: CalendarPageComponent,
    title: titlePrefix + "Home",
    canActivate: [AuthGuard]
  },
  {
    path: "contact",
    pathMatch: "full",
    component: ContactPageComponent,
    title: titlePrefix + "Contact"
  },
  {
    path: "parser",
    pathMatch: "full",
    component: InputBoxComponent,
    title: titlePrefix + "Parser",
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:date",
    pathMatch: "full",
    component: EditDayPageComponent,
    title: titlePrefix + "Edit",
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    pathMatch: "full",
    component: ProfilePageComponent,
    title: titlePrefix + "Profile",
    canActivate: [AuthGuard],
    canDeactivate: [DirtyCheckGuard]
  },
  { path: "login", pathMatch: "full", component: LoginComponent, title: titlePrefix + "Login" },
  { path: "register", pathMatch: "full", component: RegisterComponent, title: titlePrefix + "Register" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
