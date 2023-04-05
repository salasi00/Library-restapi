import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsString()
  readonly name: string;
}
