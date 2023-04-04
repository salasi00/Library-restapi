import { IsString } from 'class-validator';

export class UpdateMemberDto {
  @IsString()
  name: string;
}
