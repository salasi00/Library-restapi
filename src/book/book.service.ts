import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Model } from 'mongoose';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().populate('borrowedBy').exec();
  }

  async findOne(code: string): Promise<Book> {
    const result = await this.bookModel
      .findOne({ code })
      .populate('borrowedBy')
      .exec();
    if (!result) {
      throw new NotFoundException('Book not Found.');
    }
    return result;
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  async updateBook(code: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel
      .findOneAndUpdate({ code }, updateBookDto, { new: true })
      .exec();
    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }
    return book;
  }

  async deleteBook(code: string): Promise<Book> {
    const book = await this.bookModel.findOneAndDelete({ code }).exec();
    if (!book) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }
    return book;
  }

  async checkBooks(): Promise<Book[]> {
    return this.bookModel.find({ borrowDate: null }).exec();
  }
}
