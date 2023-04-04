import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { Book } from '../book/schemas/book.schema';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async findAll(): Promise<Member[]> {
    return this.memberModel.find().populate('borrowedBooks').exec();
  }

  async findOne(code: string): Promise<Member> {
    const result = await this.memberModel
      .findOne({ code })
      .populate('borrowedBooks')
      .exec();
    if (!result) {
      throw new NotFoundException('Member not Found.');
    }
    console.log(result);
    return result;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const result = new this.memberModel(createMemberDto);
    return result.save();
  }

  async update(
    code: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const member = await this.memberModel
      .findOneAndUpdate({ code }, updateMemberDto, { new: true })
      .exec();
    if (!member) {
      throw new NotFoundException(`Member with Code: ${code} not found`);
    }
    return member;
  }

  async delete(code: string): Promise<Member> {
    const member = await this.memberModel.findOneAndDelete({ code }).exec();
    if (!member) {
      throw new NotFoundException(`Member with code ${code} not found`);
    }
    return member;
  }

  async borrowBook(memberCode: string, bookCode: string): Promise<void> {
    const member = await this.memberModel
      .findOne({ code: memberCode })
      .populate('borrowedBooks')
      .exec();
    if (!member) {
      throw new NotFoundException('Member Not Found');
    }
    if (member.borrowedBooks.length >= 2) {
      throw new NotFoundException(
        `Member with Code: ${bookCode} has reached the maximum number of borrowed books`,
      );
    }
    if (member.penaltyCount > 0) {
      const today = Date.now();
      const dueDate = Date.parse(member.penaltyDueDate);
      const remainingDay = Math.round(
        Math.abs(today - dueDate) / (1000 * 3600 * 24),
      );
      throw new NotFoundException(
        `Member is being penalized for ${remainingDay} days`,
      );
    }
    const book = await this.bookModel.findOne({ code: bookCode }).exec();
    if (!book) {
      throw new NotFoundException('Book not Found');
    }
    if (book.borrowedBy) {
      throw new BadRequestException(
        'Book is already borrowed by another member',
      );
    }
    if (book.stock === 0) {
      throw new NotFoundException('Book is not available');
    }
    member.borrowedBooks.push(book);
    member.borrowedCounts = member.borrowedBooks.length;
    book.borrowedBy = member.id;
    book.borrowDate = new Date().toLocaleString();
    book.stock -= 1;
    await member.save();
    await book.save();
  }

  async returnBook(memberCode: string, bookCode: string): Promise<void> {
    const member = await this.memberModel
      .findOne({ code: memberCode })
      .populate('borrowedBooks')
      .exec();
    if (!member) {
      throw new NotFoundException('Member not Found');
    }
    if (member.borrowedBooks.length === 0) {
      throw new BadRequestException('This Member did not borrow any book');
    }
    const findIndex = member.borrowedBooks.findIndex(
      (book) => book.code === bookCode,
    );
    const book = member.borrowedBooks[findIndex];
    if (!book) {
      throw new NotFoundException('Book not Found');
    }
    if (findIndex === -1) {
      throw new BadRequestException(
        `Book is not borrowed by member with ${bookCode} Code`,
      );
    }
    const dateNow = new Date();
    const borrowDate = book.borrowDate;
    const dayLate = Math.round(
      Math.abs(
        (Date.parse(borrowDate) - dateNow.getTime()) / (1000 * 3600 * 24),
      ),
    );
    if (dayLate > 7) {
      member.penaltyCount += 1;
      member.penaltyDueDate = new Date(
        dateNow.getTime() + 3 * 24 * 3600 * 1000,
      ).toLocaleString();
      await member.save();
    }
    book.borrowedBy = null;
    book.borrowDate = null;
    book.stock += 1;
    const index = member.borrowedBooks.findIndex(
      (book) => book.code === bookCode,
    );
    member.borrowedBooks.splice(index, 1);
    member.borrowedCounts = member.borrowedBooks.length;
    await member.save();
    await book.save();
  }

  async checkMembers(): Promise<Member[]> {
    return this.memberModel.find().populate('borrowedBooks').exec();
  }
}

//   async findById(id: string): Promise<Book> {
//     const result = await this.bookModel.findById(id);

//     if (!result) {
//       throw new NotFoundException('Book not Found.');
//     }
//     return result;
//   }

//   async updateById(id: string, book: Book): Promise<Book> {
//     const result = await this.bookModel.findByIdAndUpdate(id, book);
//     return result;
//   }

//   async deleteById(id: string): Promise<Book> {
//     return await this.bookModel.findByIdAndDelete(id);
//   }
// }
