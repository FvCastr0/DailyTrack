import { messages } from "@/messages";

export class NonExistentUser extends Error {
  constructor() {
    super(messages.user.functions.delete[400]);
  }
}
