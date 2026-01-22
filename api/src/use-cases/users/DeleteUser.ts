import { HasToBeSameAccount } from "@/errors/user/HasToBeSameAccount";
import { NonExistentUser } from "@/errors/user/NonExistentUser";
import { UsersRepository } from "@/repositories/user-repository";

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute(id: string, sub: string) {
    if (id !== sub) throw new HasToBeSameAccount();
    const findUser = await this.usersRepository.findById(id);

    if (!findUser) throw new NonExistentUser();

    await this.usersRepository.deleteUserById(id);
  }
}
