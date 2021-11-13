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
    const newUser = this.userModel.create(userDto);
    return newUser;
  }

  async getUserByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user;
  }

  async getUserByActivationLink(activationLink: string): Promise<UserDocument> {
    const user = this.userModel.findOne({ activationLink });
    return user;
  }
}
