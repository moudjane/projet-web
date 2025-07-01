import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MessageService } from './message.service';
import { MessageModel } from './message.model';

@Resolver(() => MessageModel)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => MessageModel)
  async sendMessage(
    @Args('content') content: string,
    @Args('conversationId') conversationId: string,
    @CurrentUser() user: any,
  ) {
    return this.messageService.sendMessage(
      content,
      user.userId,
      conversationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [MessageModel])
  async getMessagesByConversation(
    @Args('conversationId') conversationId: string,
  ) {
    return this.messageService.getMessagesByConversation(conversationId);
  }
}
