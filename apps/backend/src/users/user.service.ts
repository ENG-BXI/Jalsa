import {EditUserDto} from './dto/edit-user.dto.js';
import UserRepository from './user.repository.js';

class UserService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
  async editUser(id: string, body: EditUserDto) {
    const findUser = await this.userRepository.getUserById(id);
    if (!findUser) throw new Error('User Not Found');
    return body;
  }
}
export default UserService;
