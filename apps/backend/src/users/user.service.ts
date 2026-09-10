import UserRepository from './user.repository.js';

class UserService {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }
}
export default UserService;
