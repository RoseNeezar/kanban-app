import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { Cards } from 'src/models/cards.model';
import { List } from 'src/models/list.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import {
  ICreateCard,
  IGetAllCards,
  IUpdateCardDifferentList,
  IUpdateCardSameList,
  IUpdateCard,
} from './cards.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Cards)
    private readonly cardsModel: ReturnModelType<typeof Cards>,
  ) {}

  async createCard(cardDto: ICreateCard) {
    const { listId, title } = cardDto;
    try {
      const card = await this.cardsModel.create({
        list: listId,
        title,
        descriptions: '',
        dueDate: null,
      });

      const list = await this.listModel.findById(listId);

      const newCardIds = Array.from(list.cardIds);
      newCardIds.push(card._id);
      const newList = await list.set({ cardIds: newCardIds }).save();
      return { card, list: newList };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getAllCards(cardDto: IGetAllCards) {
    const { listIds } = cardDto;
    try {
      if (listIds && listIds[0].length > 0) {
        const cardsPromise = listIds.map(
          async (id) =>
            await this.cardsModel
              .find({ list: id })
              .select('_id title descriptions dueDate list'),
        );
        let totalCards = await Promise.all(cardsPromise);

        return { cards: totalCards };
      }

      return { cards: [] };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateCard(cardDto: IUpdateCard, cardId: Types.ObjectId) {
    const { title, descriptions, dueDate } = cardDto;
    console.log(cardDto);
    try {
      const card = await this.cardsModel.findByIdAndUpdate(
        cardId,
        { title, descriptions, dueDate },
        { new: true },
      );
      return { data: card };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateCardSameList(cardDto: IUpdateCardSameList) {
    const { sameListId, sameListCardIds } = cardDto;
    try {
      const list = await this.listModel.findById(sameListId);
      const toObjectId = sameListCardIds.map((id) => Types.ObjectId(id));
      const newListOrder = await list.set({ cardIds: toObjectId }).save();
      return { newListOrder };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateCardDifferentList(cardDto: IUpdateCardDifferentList) {
    const { removedListId, addedListId, addedListCardIds, removedListCardIds } =
      cardDto;
    try {
      const removedList = await this.listModel.findById(removedListId);

      const removeListObjectId = removedListCardIds.map((id) =>
        Types.ObjectId(id),
      );

      removedList.set({ cardIds: removeListObjectId });

      const removeLists = await removedList.save();

      const addedList = await this.listModel.findById(addedListId);

      const addedListObjectId = addedListCardIds.map((id) =>
        Types.ObjectId(id),
      );

      addedList.set({ cardIds: addedListObjectId });

      const addedLists = await addedList.save();

      return {
        removeLists,
        addedLists,
      };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async deleteCard(cardId: string) {
    try {
      await this.cardsModel.findByIdAndDelete(cardId);

      await this.listModel.findOneAndUpdate(
        { cardIds: Types.ObjectId(cardId) },
        { $pull: { cardIds: Types.ObjectId(cardId) } },
      );
      return { data: null };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
