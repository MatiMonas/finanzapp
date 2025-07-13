import {
  Controller,
  Get,
  Post,
  Body,
  Route,
  Tags,
  SuccessResponse,
} from 'tsoa';

import { PostUserParams, UserResponse, TestResponse } from '../types';
import container from '../../../container';

@Route('users')
@Tags('Users')
export class UserController extends Controller {
  private userUsecase = container.userUsecase;

  /**
   * Test endpoint to verify the Users component is working correctly
   */
  @Get()
  public async test(): Promise<TestResponse> {
    const result = this.userUsecase.test();
    return { message: result };
  }

  /**
   * Create a new user in the system with their credentials and assigned roles
   * @param userData User data including username, email, password and roles
   */
  @Post()
  @SuccessResponse('201', 'Created')
  public async createUser(
    @Body() userData: PostUserParams
  ): Promise<UserResponse> {
    const userId = await this.userUsecase.create(userData);
    this.setStatus(201);
    return {
      id: userId,
      message: 'User created successfully',
    };
  }
}
