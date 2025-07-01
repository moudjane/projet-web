import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '../user/user.model';

@ObjectType()
export class MessageModel {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => UserModel)
  user: UserModel;
}
