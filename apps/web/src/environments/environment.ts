import { StoreDevtoolsModule } from "@ngrx/store-devtools";

export const environment = {
  production: false,
  baseUrl: "http://localhost:8082/api",
  imports: [StoreDevtoolsModule.instrument({ maxAge: 25 })]
};
