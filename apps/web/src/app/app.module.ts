import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DateInputComponent } from "./components/date-input/date-input.component";
import { DayListItemComponent } from "./components/day-list-item/day-list-item.component";
import { DayListComponent } from "./components/day-list/day-list.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";

import { BannerComponent } from "./components/banner/banner.component";
import { ButtonComponent } from "./components/button/button.component";
import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { CalendarComponent } from "./components/calendar/calendar/calendar.component";
import { ContactPageComponent } from "./components/contact/contact-page/contact-page.component";
import { FeedbackComponent } from "./components/contact/feedback/feedback.component";
import { EditDayComponent } from "./components/edit-day/edit-day.component";
import { HomeComponent } from "./components/home-page/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

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
    ButtonComponent,
    FeedbackComponent,
    ContactPageComponent,
    ProfilePageComponent
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
