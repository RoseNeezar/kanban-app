import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseMiddleware } from './auth/firebase.middleware';
import { BoardModule } from './board/board.module';
import { CardsModule } from './cards/cards.module';
import { ListModule } from './list/list.module';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypegooseModule.forRoot(`mongodb://root:example@mongo:27017`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
    AuthModule,
    BoardModule,
    CardsModule,
    ListModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(FirebaseMiddleware)
      .exclude(
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/auth/login/google', method: RequestMethod.POST },
        { path: 'api/auth/logout', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
