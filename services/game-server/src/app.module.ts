import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InitModule } from "./init/init.module";
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [ConfigModule.forRoot(), InitModule],
  controllers: [],
  providers: [EventsGateway],
})
export class AppModule {}
