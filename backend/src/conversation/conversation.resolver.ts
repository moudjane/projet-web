import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ConversationModel } from './conversation.model';
import { UseGuards } from '@nestjs/common';

@Resolver(() => ConversationModel)
export class ConversationResolver {
  constructor(private readonly conversationService: ConversationService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => ConversationModel)
  async createConversation(
    @Args('title') title: string,
    @Args('targetUserId') targetUserId: string,
    @CurrentUser() user: any,
  ) {
    return this.conversationService.createConversation(
      title,
      user.userId,
      targetUserId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [ConversationModel])
  async getMyConversations(@CurrentUser() user: any) {
    return this.conversationService.getUserConversations(user.userId);
  }
}
