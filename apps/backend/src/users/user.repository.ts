import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../prisma/contract.d.ts';

class UserRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getUserById(id: string) {
    return await this.db.orm.public.User.where({id}).first()
  }
  async editUser() {
    
  }
}
export default UserRepository;
