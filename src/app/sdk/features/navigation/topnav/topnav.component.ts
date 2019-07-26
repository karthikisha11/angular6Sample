import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { KeycloakState } from './../../keycloak/keycloak.state';
import { Logout } from './../../keycloak/keycloak.actions';
import { Select, Store } from '@ngxs/store';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
    @Select(KeycloakState.email) email$: Observable<string>;
    email = '';
    logout() {
        this.store.dispatch(new Logout());
    }
    constructor(
        private store: Store
        ) {
        this.email$.subscribe(value => {
            this.email = value;
        });
    }
    ngOnInit() {}
}
