import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
@ApiTags('Books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Books' })
  @ApiResponse({ status: 200, description: 'Success', type: [Book] })
  async getAllBooks() {
    const response = await this.bookService.findAll();
    return { code: 200, data: response };
  }

  @Get('available')
  @ApiOperation({ summary: 'Available Books' })
  async getAvailableBooks(): Promise<Book[]> {
    return this.bookService.checkBooks();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<{ book: Book }> {
    const book = await this.bookService.createBook(createBookDto);
    const createdBook = await book.save();
    return { book: createdBook };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get One Book' })
  @ApiParam({ name: 'code', description: 'Book code', example: 'NRN-7' })
  @ApiResponse({ status: 200, description: 'Success', type: Book })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getBook(
    @Param('code')
    code: string,
  ): Promise<Book> {
    return this.bookService.findOne(code);
  }

  @Put(':code')
  @ApiOperation({ summary: 'Update Book' })
  @ApiParam({ name: 'code', description: 'Book code', example: 'NRN-7' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, description: 'Success', type: Book })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async updateBook(
    @Param('code')
    code: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const updatedBook = await this.bookService.updateBook(code, updateBookDto);
    if (!updatedBook) {
      throw new NotFoundException(`Book with code ${code} not found`);
    }
    return updatedBook;
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete Book' })
  @ApiParam({ name: 'code', description: 'Book code', example: 'NRN-7' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async deleteBook(
    @Param('code')
    code: string,
  ): Promise<Book> {
    return this.bookService.deleteBook(code);
  }
}
