import { StoreDevtoolsModule } from "@ngrx/store-devtools";

export const environment = {
  production: false,
  baseUrl: "http://backend:8080/api",
  imports: [StoreDevtoolsModule.instrument({ maxAge: 25 })]
};
