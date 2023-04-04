import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from '../book/schemas/book.schema';
import { BookService } from './book.service';
import { Model } from 'mongoose';

describe('BookService', () => {
  let bookService: BookService;
  let bookModel: Model<Book>;

  const bookMock = {
    code: 'BOOK001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    stock: 10,
    borrowedBy: null,
    borrowDate: null,
    save: jest.fn(),
    populate: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    find: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    findOneAndDelete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: bookMock,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return array of books', async () => {
      bookMock.exec.mockResolvedValueOnce([bookMock]);
      const result = await bookService.findAll();
      expect(bookMock.find).toHaveBeenCalled();
      expect(bookMock.populate).toHaveBeenCalledWith('borrowedBy');
      expect(bookMock.exec).toHaveBeenCalled();
      expect(result).toEqual([bookMock]);
    });
  });
});
