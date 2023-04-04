import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from './schemas/member.schema';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
@ApiTags('Members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({ status: 200, description: 'Success', type: [Member] })
  async findAll() {
    const response = await this.memberService.findAll();
    return { code: 200, data: response };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get one members' })
  @ApiParam({ name: 'code', description: 'Member code', example: 'M001' })
  @ApiResponse({ status: 200, description: 'Success', type: Member })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getMember(
    @Param('code')
    code: string,
  ): Promise<Member> {
    return this.memberService.findOne(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create new member' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({
    status: 201,
    description: 'The member has been successfully created.',
  })
  async create(
    @Body() createMemberDto: CreateMemberDto,
  ): Promise<{ member: Member }> {
    const member = await this.memberService.create(createMemberDto);
    const createdMember = await member.save();
    return { member: createdMember };
  }

  @Put(':code')
  @ApiOperation({ summary: 'Update member' })
  @ApiParam({ name: 'code', description: 'Member code', example: 'M001' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200, description: 'Success', type: Member })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async update(
    @Param('code') code: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<Member> {
    const updatedMember = await this.memberService.update(
      code,
      updateMemberDto,
    );
    return updatedMember;
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete member' })
  @ApiParam({ name: 'code', description: 'Member code', example: 'M001' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async delete(@Param('code') code: string): Promise<Member> {
    return this.memberService.delete(code);
  }

  @Post(':memberCode/borrow/:bookCode')
  @ApiOperation({ summary: 'borrow Books' })
  @ApiParam({ name: 'memberCode', description: 'Member code', example: 'M001' })
  @ApiParam({ name: 'bookCode', description: 'Book code', example: 'NRN-7' })
  @ApiResponse({ status: 200, description: 'Success', type: Object })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async borrowBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
  ) {
    try {
      const response = await this.memberService.borrowBook(
        memberCode,
        bookCode,
      );
      return {
        code: 200,
        data: response,
        message: 'Book borrowed succesfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Post(':memberCode/return/:bookCode')
  @ApiOperation({ summary: 'Return borrowed Books' })
  @ApiParam({ name: 'memberCode', description: 'Member code', example: 'M001' })
  @ApiParam({ name: 'bookCode', description: 'Book code', example: 'NRN-7' })
  @ApiResponse({ status: 200, description: 'Success', type: Object })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async returnBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
  ) {
    try {
      const response = await this.memberService.returnBook(
        memberCode,
        bookCode,
      );
      return {
        code: 200,
        data: response,
        message: 'Book returned succesfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
