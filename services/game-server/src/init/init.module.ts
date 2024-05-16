import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {
  applicationDefault,
  initializeApp as initializeFirebaseApp,
} from "firebase-admin/app";

// InitModule needs to depend on ConfigModule such that the .env file is loaded
// prior to running `initializeFirebaseApp`.
@Module({
  imports: [ConfigModule],
})
export class InitModule {
  constructor() {
    this.init();
  }

  private init() {
    // Firebase credentials are loaded from the JSON file path defined in the
    // `GOOGLE_APPLICATION_CREDENTIALS` environment variable.
    initializeFirebaseApp({
      credential: applicationDefault(),
    });
  }
}
