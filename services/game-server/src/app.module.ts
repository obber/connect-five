import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InitModule } from "./init/init.module";

@Module({
  imports: [ConfigModule.forRoot(), InitModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
