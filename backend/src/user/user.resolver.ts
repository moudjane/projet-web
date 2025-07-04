import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './user.model';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserModel])
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel, { nullable: true })
  async getUserById(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }
}
