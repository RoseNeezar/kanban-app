import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { Cards } from 'src/models/cards.model';
import { List } from 'src/models/list.model';
import { ErrorSanitizer } from 'utils/error.utils';
import {
  ICreateList,
  IGetAllList,
  IGetList,
  IUpdateListTitle,
} from './list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Cards)
    private readonly cardsModel: ReturnModelType<typeof Cards>,
  ) {}

  async getBoard(
    boardId: Types.ObjectId,
  ): Promise<[DocumentType<Board>, Error]> {
    try {
      const board = await this.boardModel.findById(boardId);
      return [board, null];
    } catch (error) {
      return [null, error];
    }
  }
  async createList(listDto: ICreateList) {
    const { boardId, title } = listDto;
    try {
      const List: List = {
        board: boardId,
        title,
        cardIds: [],
      };
      const newList = await this.listModel.create(List);

      const [board, error] = await this.getBoard(boardId);

      if (!board) {
        throw new BadRequestException(ErrorSanitizer(error));
      }

      const newListOrder = Array.from(board.listOrder);
      newListOrder.push(newList._id);
      await board.set({ listOrder: newListOrder }).save();
      return { list: newList };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async updateListTitle(listDto: IUpdateListTitle, listId: Types.ObjectId) {
    const { title } = listDto;
    try {
      const listData = await this.listModel.findByIdAndUpdate(
        listId,
        { title },
        { new: true },
      );

      return { data: listData };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getList(listDto: IGetList) {
    const { listId } = listDto;
    try {
      const result = await this.listModel.findById(listId);
      return { data: result };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async getAllList(listDto: IGetAllList) {
    const { boardId } = listDto;
    try {
      const board = await this.boardModel
        .findOne({ _id: boardId })
        .select('listOrder');
      const list = await this.listModel
        .find({ board: boardId })
        .select('cardIds title _id');

      return { list, board };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }

  async deleteList(listDto: { listId: string }) {
    const { listId } = listDto;
    try {
      const removedList = await this.listModel.findByIdAndDelete(listId);
      const removeCardFromList = await this.cardsModel.findOneAndDelete({
        list: listId,
      });
      if (!removedList || removeCardFromList) {
        throw new BadRequestException('No id found');
      }

      const cb = await this.boardModel.findOneAndUpdate(
        { listOrder: Types.ObjectId(listId) },
        { $pull: { listOrder: Types.ObjectId(listId) } },
      );

      return { data: null };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
