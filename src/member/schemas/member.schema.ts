import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Book } from 'src/book/schemas/book.schema';

@Schema({
  timestamps: true,
})
export class Member extends mongoose.Document {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  @IsString()
  code: string;

  @Prop({ required: true })
  @ApiProperty()
  @IsString()
  name: string;

  @Prop({ default: 0 })
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  penaltyCount: number;

  @Prop()
  @ApiProperty()
  @IsDateString()
  @IsOptional()
  penaltyDueDate: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] })
  @ApiProperty()
  @IsArray()
  @IsOptional()
  borrowedBooks: Book[];

  @Prop({ default: 0 })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  borrowedCounts: number;

  _id: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
