import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.auth.decorator';
import { UserRoles } from 'src/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles(UserRoles.ADMIN)
  @UseGuards(RolesGuard)
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
