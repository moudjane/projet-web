import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '../user/user.model';
import { MessageModel } from '../message/message.model';

@ObjectType()
export class ConversationModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  createdAt: Date;

  @Field(() => [UserModel])
  users: UserModel[];

  @Field(() => [MessageModel])
  messages: MessageModel[];
}
