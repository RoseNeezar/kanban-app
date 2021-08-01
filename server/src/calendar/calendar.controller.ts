import { Controller, Get, Param } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('api/calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get('/due-date/:year/:month')
  async getAllDueDate(
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.calendarService.getAllCardDueDate({ year, month });
  }
}
