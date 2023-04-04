import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';

const books = [
  {
    code: 'JK-45',
    title: 'Harry Potter',
    author: 'J.K Rowling',
    stock: 1,
  },
  {
    code: 'SHR-1',
    title: 'A Study in Scarlet',
    author: 'Arthur Conan Doyle',
    stock: 1,
  },
  {
    code: 'TW-11',
    title: 'Twilight',
    author: 'Stephenie Meyer',
    stock: 1,
  },
  {
    code: 'HOB-83',
    title: 'The Hobbit, or There and Back Again',
    author: 'J.R.R. Tolkien',
    stock: 1,
  },
  {
    code: 'NRN-7',
    title: 'The Lion, the Witch and the Wardrobe',
    author: 'C.S. Lewis',
    stock: 1,
  },
];

const book = {
  code: 'JK-45',
  title: 'Harry Potter',
  author: 'J.K Rowling',
  stock: 1,
};

describe('BookController', () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: {},
        },
      ],
    }).compile();

    bookController = moduleRef.get<BookController>(BookController);
    bookService = moduleRef.get<BookService>(BookService);
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      jest.spyOn(bookService, 'findAll').mockResolvedValueOnce(books as Book[]);
      const result = await bookController.getAllBooks();
      expect(result.data).toEqual(books);
    });
  });

  describe('getOne', () => {
    it('should return a book', async () => {
      jest.spyOn(bookService, 'findOne').mockResolvedValueOnce(book as Book);

      expect(await bookController.getBook(book.code)).toBe(book);
    });
  });
  // describe('borrowBook', () => {
  //   it('should return a book', async () => {
  //     jest.spyOn(bookService, 'borrowBook').mockResolvedValueOnce(book as Book);

  //     expect(await bookController.borrowBook(book.code, book.borrowedBy)).toBe(book);
  //   });
  // });

  // describe('returnBook', () => {
  //   it('should return a book', async () => {
  //     jest.spyOn(bookService, 'returnBook').mockResolvedValueOnce(book as Book);

  //     expect(await bookController.returnBook(book.code)).toBe(book);
  //   });
  // });
});
