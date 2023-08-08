import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputBoxComponent } from './components/input-box/input-box.component';
import { CalendarPageComponent } from './components/calendar-page/calendar-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: InputBoxComponent, title: 'DayTrackr | Home'},
  { path: 'calendar', pathMatch: 'full', component: CalendarPageComponent, title: 'DayTrackr | Calendar'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
