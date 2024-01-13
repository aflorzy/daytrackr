import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateInputComponent } from "./components/date-input/date-input.component";
import { DayListComponent } from "./components/day-list/day-list.component";
import { DayListItemComponent } from "./components/day-list-item/day-list-item.component";
import { FontAwesomeModule, FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { CalendarComponent } from "./components/calendar/calendar/calendar.component";
import { EditDayComponent } from "./components/edit-day/edit-day.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { BannerComponent } from "./components/banner/banner.component";
import { HomeComponent } from "./components/home-page/home/home.component";
import { ButtonComponent } from "./components/button/button.component";

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
    LoginComponent,
    RegisterComponent,
    BannerComponent,
    HomeComponent,
    ButtonComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, FontAwesomeModule, HttpClientModule],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
