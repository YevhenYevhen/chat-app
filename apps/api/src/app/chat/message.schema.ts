import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type MessageDocument = Message & mongoose.Document;

@Schema({ timestamps: true })
export class Message {
  _id: mongoose.Schema.Types.ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Prop()
  messageText: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
