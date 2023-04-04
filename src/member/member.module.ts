import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schemas/member.schema';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { Book, BookSchema } from 'src/book/schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
