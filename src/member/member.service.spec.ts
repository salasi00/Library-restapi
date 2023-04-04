import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { getModelToken } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { Book } from '../book/schemas/book.schema';

describe('MemberService', () => {
  let service: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getModelToken(Member.name),
          useValue: {},
        },
        {
          provide: getModelToken(Book.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
