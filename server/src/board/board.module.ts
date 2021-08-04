import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from 'src/auth/auth.module';
import { Board } from 'src/models/board.model';
import { Cards } from 'src/models/cards.model';
import { List } from 'src/models/list.model';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypegooseModule.forFeature([Board, List, Cards]), AuthModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
