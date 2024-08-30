import UserRepository from 'users/repository/mysql-repository';

export default class UserUseCase {
  constructor(private mysqlRepository: UserRepository) {}

  test() {
    return 'ok';
  }
}
