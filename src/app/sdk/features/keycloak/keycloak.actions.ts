export class Login {
;
  static readonly type = "[KEYCLOAK] LOGGING_IN";
  constructor() {


  }
}

export class LoginSuccess {
  static readonly type = "[KEYCLOAK] LOGIN_SUCCESSFUL";
  constructor(
    public token: string,
    public email: string,
    public keycloakUid: string,
    public name: string
  ) {}
}

export class UpdateToken {
  static readonly type = "[KEYCLOAK] UPDATE_TOKEN";
  constructor(public token: string) {}
}

export class LoginFail {
  static readonly type = "[KEYCLOAK] LOGIN_FAIL";
  constructor() {}
}

export class ResetToken {
  static readonly type = "[KEYCLOAK] RESET_TOKEN";
  constructor() {}
}

export class Logout {
  static readonly type = "[KEYCLOAK] LOGGING_OUT";
  constructor() {}
}
