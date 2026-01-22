import { EmailAlreadyUsedError } from "@/errors/user/EmailAlreadyExistsError";
import { UsersRepository } from "@/repositories/user-repository";
import { CreateUserInput } from "@/types";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, password, email }: CreateUserInput) {
    const findEmail = await this.usersRepository.findByEmail(email);

    if (findEmail?.email === email) throw new EmailAlreadyUsedError();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    });
  }
}
