import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateInputComponent } from "./components/date-input/date-input.component";
import { DayListComponent } from "./components/day-list/day-list.component";
import { DayListItemComponent } from "./components/day-list-item/day-list-item.component";
import {
  FontAwesomeModule,
  FaIconLibrary,
} from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CalendarComponent } from "./components/calendar/calendar/calendar.component";
import { EditDayComponent } from "./components/edit-day/edit-day.component";

@NgModule({
  declarations: [
    AppComponent,
    InputBoxComponent,
    DateInputComponent,
    DayListComponent,
    DayListItemComponent,
    CalendarPageComponent,
    NavbarComponent,
    CalendarComponent,
    EditDayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
