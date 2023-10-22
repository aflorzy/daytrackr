import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputBoxComponent } from './components/input-box/input-box.component';
import { CalendarPageComponent } from './components/calendar-page/calendar-page.component';
import { EditDayComponent } from './components/edit-day/edit-day.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: InputBoxComponent, title: 'DayTrackr | Home', canActivate: [AuthGuard] },
  { path: 'calendar', pathMatch: 'full', component: CalendarPageComponent, title: 'DayTrackr | Calendar', canActivate: [AuthGuard] },
  { path: 'edit/:date', pathMatch: 'full', component: EditDayComponent, title: 'DayTrackr | Edit', canActivate: [AuthGuard] },
  { path: 'login', pathMatch: 'full', component: LoginComponent, title: 'DayTrackr | Login' },
  { path: 'register', pathMatch: 'full', component: RegisterComponent, title: 'DayTrackr | Register' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
