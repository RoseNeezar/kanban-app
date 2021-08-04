import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Cards } from 'src/models/cards.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import { CardDueDateMap, IGetCardDueDateDto } from './calendar.dto';
import * as dayjs from 'dayjs';
import { List } from 'src/models/list.model';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Cards)
    private readonly cardsModel: ReturnModelType<typeof Cards>,
  ) {}

  async getAllCardDueDate(data: IGetCardDueDateDto) {
    const { month, year } = data;
    try {
      let boardList = [];
      const card = await this.cardsModel.find({
        dueDate: {
          $ne: null,
        },
      });

      try {
        await Promise.all(
          card.map(async (re) => {
            const list = await this.listModel.findById(re.list);

            if (!!list && JSON.stringify(re.list) === JSON.stringify(list.id)) {
              const card: any = {
                ...re,
              };
              boardList.push({
                ...card._doc,
                boardId: list.board,
              });
            }
          }),
        );
      } catch (error) {
        throw new BadRequestException(ErrorSanitizer(error));
      }

      const CardDueDateMap: CardDueDateMap = {};

      // filter data and massage into format expected by client
      boardList.forEach((appointment) => {
        const appointmentDate = dayjs(appointment.dueDate);
        if (
          // zero-indexed month
          appointmentDate.month() + 1 === Number(month) &&
          appointmentDate.year() === Number(year)
        ) {
          const dayNum = dayjs(appointment.dueDate).date();
          if (CardDueDateMap[dayNum]) {
            CardDueDateMap[dayNum].push(appointment);
          } else {
            CardDueDateMap[dayNum] = [appointment];
          }
        }
      });
      return CardDueDateMap;
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
