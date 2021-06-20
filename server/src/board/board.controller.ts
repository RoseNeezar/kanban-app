import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/models/user.model';
import { ICreateBoard, IUpdateListOrder } from './board.dto';
import { BoardService } from './board.service';

@Controller('api/boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('/all')
  @UseGuards(AuthGuard())
  getAllBoards(@GetUser() user: User & { _id: Types.ObjectId }) {
    return this.boardService.getAllBoards(user._id);
  }

  @Post('/')
  @UseGuards(AuthGuard())
  createBoard(
    @GetUser() user: User & { _id: Types.ObjectId },
    @Body() boardDto: ICreateBoard,
  ) {
    return this.boardService.createBoard(boardDto, user._id);
  }

  @Patch('/')
  updateListOrder(@Body() boardDto: IUpdateListOrder) {
    return this.boardService.updateListOrder(boardDto);
  }

  @Get('/:boardId')
  getBoard(@Param('boardId') boardId: Types.ObjectId) {
    return this.boardService.getBoard({ boardId });
  }

  @Delete('/:boardId')
  deleteBoard(@Param('boardId') boardId: Types.ObjectId) {
    return this.boardService.deleteBoard({ boardId });
  }
}
