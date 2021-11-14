import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.auth.decorator';
import { UserRoles } from 'src/types';
import { RolesGuard } from 'src/auth/roles.guard';
import { User, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';

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
}
