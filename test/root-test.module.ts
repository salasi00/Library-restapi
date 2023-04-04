import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookController } from '../src/book/book.controller';
import { BookService } from '../src/book/book.service';
import { Book, BookSchema } from '../src/book/schemas/book.schema';
import { MemberController } from '../src/member/member.controller';
import { MemberService } from '../src/member/member.service';
import { Member, MemberSchema } from '../src/member/schemas/member.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [BookController, MemberController],
  providers: [BookService, MemberService],
})
export class RootTestModule {}
