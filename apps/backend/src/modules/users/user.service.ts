import {RedisClientType, RedisDefaultModules} from 'redis';
import {generateToken, UserPayload} from '../../lib/jwt.js';
import {EditUserDto} from './dto/edit-user.dto.js';
import UserRepository from './user.repository.js';

class UserService {
  private userRepository: UserRepository;
  constructor(
    userRepository: UserRepository,
    private redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>
  ) {
    this.userRepository = userRepository;
    this.redisClient = redisClient;
  }
  async getUserByUserName(userName: string) {
    const key = `user:details:${userName}`;
    const cachedUser = await this.redisClient.get(key);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const user = await this.userRepository.getUserByUserName(userName);
    const returnedUser = {
      id: user?.id,
      name: user?.name,
      userName: user?.userName
    };
    await this.redisClient.set(key, JSON.stringify(returnedUser), {EX: 3600}); // Cache for 1 hour
    return returnedUser;
  }
  async editUser(id: string, user: UserPayload, body: EditUserDto) {
    const findUser = await this.userRepository.getUserById(id);
    if (!findUser) throw new Error('User Not Found');
    if (body.email) {
      const existEmail = await this.userRepository.getUserByEmail(body.email);
      if (existEmail && user.email !== existEmail.email) {
        throw new Error('Email already exists');
      }
    }
    if (body.userName) {
      const existUserName = await this.userRepository.getUserByUserName(body.userName);
      if (existUserName && user.userName !== existUserName.userName) {
        throw new Error('Username already exists');
      }
    }
    // TODO Hash The Password
    const hashedPassword = body.password;
    body.password = hashedPassword;
    const editedUser = await this.userRepository.editUser(id, body);
    // Update Token When User Update
    let token;
    if (editedUser) {
      token = generateToken(editedUser);
    }
    await this.redisClient.del(`user:details:${editedUser?.userName}`); // Invalidate cache for the edited user
    return {user: editedUser, token};
  }
  async deleteUser(id: string) {
    const findUser = await this.userRepository.getUserById(id);
    if (!findUser) throw new Error('User Not Found');
    const deletedUser = await this.userRepository.deleteUser(id);
    await this.redisClient.del(`user:details:${findUser.userName}`); // Invalidate cache for the deleted user
    return deletedUser;
  }
}
export default UserService;
