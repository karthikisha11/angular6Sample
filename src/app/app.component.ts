import { Component, HostListener, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { Router, NavigationEnd } from "@angular/router";
import { ConstantState } from "./state/constants/constants.state";
import { KeycloakState } from "./sdk/features/keycloak/keycloak.state";
import { FetchConstants } from "./state/constants/constants.actions";
import { Login } from "./sdk/features/keycloak/keycloak.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "HYS App";
  @Select(ConstantState.constantsLoaded)
  constantsLoaded$: Observable<boolean>;
  constantsLoaded: boolean = false;
  @Select(ConstantState.isFetchingConstants)
  isFetchingConstants$: Observable<boolean>;
  isFetchingConstants: boolean = false;
  @Select(KeycloakState.loggedIn)
  loggedIn$: Observable<boolean>;
  loggedIn: boolean = false;
  @Select(KeycloakState.loggingOut)
  loggingOut$: Observable<boolean>;
  loggingOut: boolean = false;
  appLoaded: boolean = false;
  currentPath: string;
  showSidebar: boolean = true;
  appLoadingText: string;
  authenticate = () => {
    this.store.dispatch(new Login());
  };
  fetchConstants = () => {
    this.store.dispatch(new FetchConstants());
  };
  /**
   * This will evaluate whether all conditions necessary to
   * let user into the app are fulfilled.
   */
  evaluateAppLoaded = () => {
    if (this.loggedIn && !this.loggingOut) {
      if (!this.constantsLoaded && !this.isFetchingConstants) {
        // Fetching constants if they're not loaded and they're not being fetched
        this.fetchConstants();
      }
      if (this.constantsLoaded) {
        this.appLoaded = true;
      } else this.appLoaded = false;
    } else this.appLoaded = false;
    this.evaluateLoadingText();
  };
  /**
   * This will evaluate the appropriate loading text
   * to show the user as the app is loading.
   */
  evaluateLoadingText = () => {
    if (!this.constantsLoaded) {
      this.appLoadingText = "Fetching Constants...";
    }
    if (!this.loggedIn) {
      this.appLoadingText = "Authenticating...";
    }
    if (this.loggingOut) {
      this.appLoadingText = "Logging Out...";
    }
  };
  constructor(private store: Store, private router: Router) {
    // Capturing the currentPath
    router.events.subscribe((_: NavigationEnd) => {
      if (_.url !== undefined) {
        // Getting current path from window.location.pathname for more accuracy
        this.currentPath = window.location.pathname;
      }
    });
    this.loggedIn$.subscribe(value => {
      this.loggedIn = value;
      this.evaluateAppLoaded();
    });
    this.loggingOut$.subscribe(value => {
      this.loggingOut = value;
      this.evaluateAppLoaded();
    });
    this.isFetchingConstants$.subscribe(value => {
      this.isFetchingConstants = value;
      this.evaluateAppLoaded();
    });
    this.constantsLoaded$.subscribe(value => {
      this.constantsLoaded = value;
      this.evaluateAppLoaded();
    });
  }
  ngOnInit() {
    this.authenticate();
  }
}
