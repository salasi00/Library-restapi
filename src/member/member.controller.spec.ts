import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
// import { RootTestModule } from '../../test/root-test.module';
import { MemberService } from './member.service';
import { getModelToken } from '@nestjs/mongoose';
import { Member } from './schemas/member.schema';
import { BookService } from '../book/book.service';
import { Book } from '../book/schemas/book.schema';

const members = [
  {
    code: 'M001',
    name: 'Angga',
  },
  {
    code: 'M002',
    name: 'Ferry',
  },
  {
    code: 'M003',
    name: 'Putri',
  },
];

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService: MemberService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        MemberService,
        {
          provide: getModelToken(Member.name),
          useValue: {},
        },
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: {},
        },
      ],
    }).compile();
    memberController = moduleRef.get<MemberController>(MemberController);
    memberService = moduleRef.get<MemberService>(MemberService);
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      jest
        .spyOn(memberService, 'findAll')
        .mockResolvedValueOnce(members as Member[]);
      const result = await memberController.findAll();
      expect(result.data).toEqual(members);
    });
  });
});
