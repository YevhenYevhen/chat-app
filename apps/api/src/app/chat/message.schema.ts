import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type MessageDocument = Message & mongoose.Document;

@Schema()
export class Message {
  _id: mongoose.Schema.Types.ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  messageText: string;

  @Prop()
  date: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
