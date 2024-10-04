import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../entities';
import { Model } from 'mongoose';

@Injectable()
export class CheckUserExistService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async checkUsername(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('the user hasn`t been registered');
    return user;
  }
}
