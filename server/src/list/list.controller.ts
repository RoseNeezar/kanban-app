import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ICreateList, IUpdateListTitle } from './list.dto';
import { ListService } from './list.service';

@Controller('api/lists')
@UseGuards(AuthGuard())
export class ListController {
  constructor(private listService: ListService) {}

  @Post('/')
  createList(@Body() listDto: ICreateList) {
    return this.listService.createList(listDto);
  }

  @Post('/:listId')
  updateListTitle(
    @Param('listId') listId: Types.ObjectId,
    @Body() listTitle: IUpdateListTitle,
  ) {
    return this.listService.updateListTitle(listTitle, listId);
  }

  @Get('/list/:listId')
  getList(@Param('listId') listId: Types.ObjectId) {
    return this.listService.getList({ listId });
  }

  @Get('/all/:boardId')
  getBoardLists(@Param('boardId') boardId: Types.ObjectId) {
    return this.listService.getBoardLists({ boardId });
  }

  @Delete('/list/:listId')
  deleteList(@Param('listId') listId: string) {
    return this.listService.deleteList({ listId });
  }
}
