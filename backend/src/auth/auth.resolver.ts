import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserModel } from '../user/user.model';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async signup(
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.authService.signup(username, email, password);
    return token.access_token;
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const token = await this.authService.login(email, password);
    return token.access_token;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel)
  me(@CurrentUser() user: any) {
    return this.authService.getMe(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserModel)
  updateProfile(
    @CurrentUser() user: any,
    @Args('updateProfileData') updateProfileData: UpdateProfileInput,
  ) {
    return this.authService.updateProfile(user.userId, updateProfileData);
  }
}
