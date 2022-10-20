import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop({ default: false })
  muted: boolean;

  @Prop({ default: false })
  banned: boolean;
}


export const UserSchema = SchemaFactory.createForClass(User);
