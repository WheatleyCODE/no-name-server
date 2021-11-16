import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async createUser(userDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(userDto);
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async getUserByActivationLink(activationLink: string): Promise<UserDocument> {
    return this.userModel.findOne({ activationLink });
  }

  async getUserByResetPasswordLink(
    resetPasswordLink: string,
  ): Promise<UserDocument> {
    return this.userModel.findOne({ resetPasswordLink });
  }
}
