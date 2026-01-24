import { UsersRepository } from "@/repositories/user-repository";

export class DeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute(id: string) {
    const findUser = await this.usersRepository.findById(id);

    if (!findUser) throw new Error();

    await this.usersRepository.deleteUserById(id);
  }
}
