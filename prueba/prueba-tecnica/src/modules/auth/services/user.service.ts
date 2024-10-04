import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptPasswordHasher } from './hash-password.service';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly cryptPassword: BcryptPasswordHasher,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
    saltRounds: number = Math.floor(Math.random() * 10) + 1,
  ): Promise<User> {
    try {
      const auth0Response = await axios.post(
        `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
        {
          client_id: process.env.AUTH0_CLIENT_ID,
          email: createUserDto.email,
          password: createUserDto.password,
          connection: 'Username-Password-Authentication',
        },
      );

      if (auth0Response.data && auth0Response.data.user_id) {
        const newUser = new this.userModel({
          email: createUserDto.email,
          auth0Id: auth0Response.data.user_id,
        });
        return await newUser.save();
      } else {
        throw new InternalServerErrorException(
          'Error registering user in Auth0',
        );
      }
    } catch (error) {
      createUserDto.password = await this.cryptPassword.hash(
        createUserDto.password,
        saltRounds,
      );
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    }
  }
}
