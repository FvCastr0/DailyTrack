export const messages = {
  user: {
    text: {
      NAME_MIN_CHARACTERS: "The name must have at least 2 characters",
      INVALID_EMAIL: "The email address is invalid",
      PASSWORD_MIN_CHARACTERS: "The password must have at least 6 characters",
      PASSWORD_MAX_CHARACTERS: "The password must have at most 16 characters"
    },
    functions: {
      create: {
        201: "User successfully created",
        401: "Email already in use"
      },
      delete: {
        200: "User successfully deleted",
        400: "User does not exist",
        401: "You are not authorized to perform this action"
      },
      auth: {
        200: "User authenticated successfully",
        401: "Invalid email or password"
      }
    }
  }
};
