import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { MatchPassword } from './check-password.service';
import { GenerateToken } from './create-token.service';
import { CheckUserExistService } from './check-user-exis.service';
import { User } from '../../entities';
import { BcryptPasswordHasher } from '../hash-password.service';
import { CreateUserDto } from '../../dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly cryptPassword: BcryptPasswordHasher,
    private readonly matchPassword: MatchPassword,
    private readonly userValidator: CheckUserExistService,
    private readonly generateToken: GenerateToken,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
    saltRounds: number = Math.floor(Math.random() * 10) + 1,
  ): Promise<User> {
    const auth0Response = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        email: createUserDto.email,
        password: createUserDto.password,
        connection: 'Username-Password-Authentication',
      },
    );

    const newUser = auth0Response
      ? new this.userModel({
          email: createUserDto.email,
          auth0Id: auth0Response.data.user_id,
        })
      : new this.userModel(createUserDto);

    if (!auth0Response) {
      createUserDto.password = await this.cryptPassword.hash(
        createUserDto.password,
        saltRounds,
      );
    }

    return await newUser.save();
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userValidator.checkUsername(email);
    const isPasswordValid = await this.matchPassword.checkingPassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid user or password');
    }

    const { access_token } = await this.generateToken.token(
      user._id.toString(),
    );
    return { access_token };
  }
}
