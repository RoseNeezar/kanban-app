import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { ErrorSanitizer } from 'src/utils/error.utils';
import { mongoId } from 'src/utils/mongo.types';
import {
  ICreateBoard,
  IDeleteBoard,
  IGetBoard,
  IUpdateListOrder,
} from './board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
  ) {}

  async getBoard(boardDto: IGetBoard) {
    const { boardId } = boardDto;
    try {
      const result = await this.boardModel.findById(boardId);
      return { details: result };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async getAllBoards(userId: mongoId) {
    try {
      const boards = await this.boardModel
        .find({ user: userId })
        .select('listOrder title _id');
      if (boards.length === 0) {
        const emptyBoard: Board = {
          user: userId,
          title: '',
          listOrder: [],
        };
        return { boards: [emptyBoard] };
      }
      return { boards };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async createBoard(boardDto: ICreateBoard, userId: mongoId) {
    const { title } = boardDto;
    try {
      const result = await this.boardModel.create({
        user: userId,
        title,
        listOrder: [],
      });
      return { result };
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async updateListOrder(boardDto: IUpdateListOrder) {
    const { boardId, newListOrder } = boardDto;
    try {
      if (boardId && newListOrder) {
        const result = await this.boardModel.findByIdAndUpdate(
          boardId,
          { listOrder: newListOrder },
          { new: true },
        );

        return { updatedListOrder: result.listOrder };
      }
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
  async deleteBoard(boardDto: IDeleteBoard) {
    try {
      const { boardId } = boardDto;
      await this.boardModel.findByIdAndDelete(boardId);
    } catch (error) {
      throw new BadRequestException(ErrorSanitizer(error));
    }
  }
}
