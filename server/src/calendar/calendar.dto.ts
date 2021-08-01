import { Cards } from 'src/models/cards.model';

interface ICalendar {
  month: string;
  year: string;
}

export type CardDueDateMap = Record<number, Cards[]>;
export type IGetCardDueDateDto = Pick<ICalendar, 'month' | 'year'>;
