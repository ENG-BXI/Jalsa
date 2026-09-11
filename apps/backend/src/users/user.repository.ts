import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../prisma/contract.d.ts';

class UserRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getUserById(id: string) {
    return await this.db.orm.public.User.where({id}).first();
  }
  async getUserByEmail(email: string) {
    return await this.db.orm.public.User.where({email}).first();
  }
  async getUserByUserName(userName: string) {
    return await this.db.orm.public.User.where({userName}).first();
  }
  async editUser() {}
}
export default UserRepository;
