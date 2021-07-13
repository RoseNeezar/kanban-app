import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from 'src/auth/auth.module';
import { Board } from 'src/models/board.model';
import { Cards } from 'src/models/cards.model';
import { List } from 'src/models/list.model';
import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [TypegooseModule.forFeature([List, Board, Cards]), AuthModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
