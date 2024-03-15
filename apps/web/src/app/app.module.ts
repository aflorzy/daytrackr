import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FaIconLibrary, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DayListItemComponent } from "./components/day-list-item/day-list-item.component";
import { DayListComponent } from "./components/day-list/day-list.component";
import { InputBoxComponent } from "./components/input-box/input-box.component";

import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule, routerReducer } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { BannerComponent } from "./components/banner/banner.component";
import { ButtonComponent } from "./components/button/button.component";
import { CalendarPageComponent } from "./components/calendar-page/calendar-page.component";
import { CalendarComponent } from "./components/calendar/calendar/calendar.component";
import { DateInputComponent } from "./components/calendar/date-input/date-input.component";
import { ContactPageComponent } from "./components/contact/contact-page/contact-page.component";
import { FeedbackComponent } from "./components/contact/feedback/feedback.component";
import { EditDayPageComponent } from "./components/edit-day-page/edit-day-page.component";
import { EditDayComponent } from "./components/edit-day/edit-day.component";
import { HomeComponent } from "./components/home-page/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ProfilePageComponent } from "./components/profile-page/profile-page.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { DayEffects } from "./store/effects/day.effects";
import { EditDayEffects } from "./store/effects/edit-day.effects";
import { dayReducer } from "./store/reducers/day.reducer";
import { editDayReducer } from "./store/reducers/edit-day.reducer";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { profileReducer } from "./store/reducers/profile.reducer";
import { ProfileEffects } from "./store/effects/profile.effect";
import { authReducer } from "./store/reducers/auth.reducer";
import { AuthEffects } from "./store/effects/auth.effects";
import { environment } from "../environments/environment";
import { RouterEffects } from "./store/effects/router.effects";

@NgModule({
  declarations: [
    AppComponent,
    InputBoxComponent,
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
    ProfilePageComponent,
    EditDayPageComponent,
    DateInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    DragDropModule,
    StoreModule.forRoot(
      {
        auth: authReducer,
        days: dayReducer,
        editDay: editDayReducer,
        profile: profileReducer,
        router: routerReducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictActionTypeUniqueness: true
        }
      }
    ),
    EffectsModule.forRoot(AuthEffects, DayEffects, EditDayEffects, ProfileEffects, RouterEffects),
    StoreRouterConnectingModule.forRoot(),
    environment.imports
  ],
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
