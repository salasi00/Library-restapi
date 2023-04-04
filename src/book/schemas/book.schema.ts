import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Member } from '../../member/schemas/member.schema';

@Schema({
  timestamps: true,
})
export class Book extends mongoose.Document {
  @Prop({ required: true, unique: true })
  @IsString()
  code: string;

  _id: string;

  @Prop({ required: true })
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsString()
  author: string;

  @Prop({ default: 1 })
  @IsNumber()
  stock: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null })
  @IsOptional()
  @IsMongoId()
  @ValidateNested()
  @Transform(({ value }) => new Member(value), { toClassOnly: true })
  borrowedBy: Member;

  @Prop({ default: null })
  @IsOptional()
  @IsDateString()
  borrowDate: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  },
});
