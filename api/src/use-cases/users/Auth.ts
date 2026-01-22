import { LoginError } from "@/errors/LoginError";
import { UsersRepository } from "@/repositories/user-repository";
import { CreateUserInput } from "@/types";
import bcrypt from "bcrypt";

export class AuthUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: Omit<CreateUserInput, "name">) {
    const findEmail = await this.usersRepository.findByEmail(email);

    if (!findEmail) throw new LoginError();

    if (!bcrypt.compareSync(password, findEmail?.password))
      throw new LoginError();

    return {
      user: {
        name: findEmail.name,
        email: findEmail.email,
        id: findEmail.id
      }
    };
  }
}
