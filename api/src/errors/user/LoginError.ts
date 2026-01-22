import { messages } from "@/messages";

export class LoginError extends Error {
  constructor() {
    super(messages.user.functions.auth[401]);
  }
}
