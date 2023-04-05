import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateMemberDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
}
