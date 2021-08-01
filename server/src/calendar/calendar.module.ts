import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Cards } from 'src/models/cards.model';
import { List } from 'src/models/list.model';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypegooseModule.forFeature([Cards, List])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
