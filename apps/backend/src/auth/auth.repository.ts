import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../prisma/contract.d.ts';
import {LoginDto} from './dto/login.dto.js';
import {RegisterDto} from './dto/register.dto.js';

export class AuthRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async login(body: LoginDto) {
    const user = await this.db.orm.public.User.where({email: body.email, password: body.password}).select('id', 'email', 'name', 'userName').first();
    return user;
  }
  async register(body: RegisterDto) {
    const newUser = await this.db.orm.public.User.select('id', 'email', 'name', 'userName', 'jointAt').create(body);
    return newUser;
  }
}
