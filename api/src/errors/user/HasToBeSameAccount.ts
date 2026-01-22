import { messages } from "@/messages";

export class HasToBeSameAccount extends Error {
  constructor() {
    super(messages.user.functions.delete[401]);
  }
}
