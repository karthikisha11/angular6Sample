import { Injectable, NgZone } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import {
  LoginSuccess,
  UpdateToken,
  LoginFail,
  ResetToken
} from "./keycloak.actions";
import { environment } from "./../../../../environments/environment";

// Keycloak constants
const keycloakUrl = environment.keycloakUrl;
const keycloakRealm = environment.keycloakRealm;
const keycloakClientId = environment.keycloakClientId;
const keycloakConfig = {
  url: keycloakUrl,
  realm: keycloakRealm,
  clientId: keycloakClientId
};
declare let Keycloak: any;

@Injectable({
  providedIn: "root"
})
export class KeycloakService {
  public keycloakAuth: any;
  private timer: any;

  init(): Promise<any> {
      console.log('hi');
    this.keycloakAuth = new Keycloak(keycloakConfig);

    return this.keycloakAuth
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .success(() => {
        console.log("Authenticated successfully");
        this.loginSuccess();
      })
      .error(() => {
        console.log("Authentication failed");
        this.loginFail();
      });
  }
  loginSuccess(): void {
    const token = this.keycloakAuth.token;
    const email = this.keycloakAuth.idTokenParsed.email;
    const name = this.keycloakAuth.idTokenParsed.name;
    const keycloakUid = this.keycloakAuth.idTokenParsed.jti;
    this.store.dispatch(new LoginSuccess(token, email, keycloakUid, name));
  }
  /**
   * Checks if the token is refreshed, and then updates it if it is.
   */
  refreshToken = () => {
    this.keycloakAuth
      .updateToken(30)
      .success(this.authTokenRefreshed)
      .error(function() {
        console.log("Failed to refresh the token, or the session has expired");
        this.keycloakAuth.login();
      });
  };
  authTokenRefreshed = (refreshed: boolean) => {
    if (refreshed) {
      this.updateToken();
    }
  };
  updateToken(): void {
    const token = this.keycloakAuth.token;
    this.store.dispatch(new UpdateToken(token));
  }
  loginFail(): void {
    this.store.dispatch(new LoginFail());
    this.resetToken();
  }
  resetToken(): void {
    this.store.dispatch(new ResetToken());
  }
  logOut(): void {
    this.keycloakAuth.logout();
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
  public constructor(private store: Store) {
    let timer = setInterval(this.refreshToken, 10000);
    this.timer = timer;
  }
}
