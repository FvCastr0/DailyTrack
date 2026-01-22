export const messages = {
  user: {
    text: {
      NAME_MIN_CARACTERES: "O nome deve ter pelo menos 2 caracteres",
      INVALID_EMAIL: "O nome deve ter pelo menos 2 caracteres",
      PASSWORD_MIN_CARACTERES: "A senha deve ter pelo menos 6 caracteres",
      PASSWORD_MAX_CARACTERES: "A senha deve ter no máximo 16 caracteres"
    },
    functions: {
      create: {
        201: "Usuário criado com sucesso",
        401: "Email já utilizado"
      },
      delete: {
        200: "Usuário deletado com sucesso",
        400: "Usuário inexistente",
        401: "Você não tem autorização para isso."
      },
      auth: {
        200: "Usuário autenticado",
        401: "Email ou senha inválidos"
      }
    }
  }
};
