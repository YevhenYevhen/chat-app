import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Roles } from './roles.enum';

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

  @Prop({ default: Roles.User })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    username: this.username,
    banned: this.banned,
    muted: this.muted,
    role: this.role,
  };
};
