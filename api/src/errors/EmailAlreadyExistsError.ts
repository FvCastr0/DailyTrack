import { messages } from "@/messages";

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super(messages.user.functions.create[401]);
  }
}
