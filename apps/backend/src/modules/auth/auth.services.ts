import {generateToken} from '../../lib/jwt.js';
import UserRepository from '../../users/user.repository.js';
import {AuthRepository} from './auth.repository.js';
import {LoginDto} from './dto/login.dto.js';
import {RegisterDto} from './dto/register.dto.js';

export class AuthServices {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;
  constructor(authRepository: AuthRepository, userRepository: UserRepository) {
    this.authRepository = authRepository;
    this.userRepository = userRepository;
  }
  async login(body: LoginDto) {
    const user = await this.userRepository.getUserByEmail(body.email);
    if (!user) throw new Error('Email or Password is incorrect');
    // TODO: Hash password Here ...
    const hashedPassword = body.password;
    body.password = hashedPassword;
    const loggingUser = await this.authRepository.login(body);
    if (!loggingUser) throw new Error('Email or Password is incorrect');
    const token = generateToken(loggingUser);
    return token;
  }
  async register(body: RegisterDto) {
    const existUser = await this.userRepository.getUserByEmail(body.email);
    if (existUser) {
      throw new Error('Email already exists');
    }
    const exitUserName = await this.userRepository.getUserByUserName(body.userName);
    if (exitUserName) {
      throw new Error('UserName already exists');
    }

    const hashedPassword = body.password;
    body.password = hashedPassword;
    const newUser = await this.authRepository.register(body);
    const token = generateToken(newUser);

    return {user: newUser, token};
  }
}
