import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty()
  readonly code: string;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly author: string;

  @ApiProperty()
  readonly stock: number;
}
