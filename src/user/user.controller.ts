import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ status: 200, type: [User] })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  getUsers(): Promise<UserDocument[]> {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUser: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUser);
  }
}
