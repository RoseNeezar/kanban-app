import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import {
  ICreateCard,
  IGetAllCards,
  IUpdateCardDesc,
  IUpdateCardDifferentList,
  IUpdateCardSameList,
  IUpdateCardTitle,
} from './cards.dto';
import { CardsService } from './cards.service';

@Controller('api/cards')
@UseGuards(AuthGuard())
export class CardsController {
  constructor(private cardService: CardsService) {}

  @Post('/')
  createCard(@Body() cardDto: ICreateCard) {
    return this.cardService.createCard(cardDto);
  }

  @Post('/getallcards')
  getAllCards(@Body() cardDto: IGetAllCards) {
    return this.cardService.getAllCards(cardDto);
  }

  @Post('/card/:cardId')
  updateCardTitle(
    @Param('cardId') cardId: Types.ObjectId,
    @Body() cardDto: IUpdateCardTitle,
  ) {
    return this.cardService.updateCardTitle(cardDto, cardId);
  }

  @Post('/card/desc/:cardId')
  updateCardDescription(
    @Param('cardId') cardId: Types.ObjectId,
    @Body() cardDto: IUpdateCardDesc,
  ) {
    return this.cardService.updateCardDesc(cardDto, cardId);
  }

  @Post('/reorder/samelist')
  updateCardSameList(@Body() cardDto: IUpdateCardSameList) {
    return this.cardService.updateCardSameList(cardDto);
  }

  @Post('/reorder/differentlist')
  updateCardDifferentList(@Body() cardDto: IUpdateCardDifferentList) {
    return this.cardService.updateCardDifferentList(cardDto);
  }

  @Delete('/card/:cardId')
  deleteCard(@Param('cardId') cardId: string) {
    return this.cardService.deleteCard(cardId);
  }
}
