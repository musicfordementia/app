import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, PRIMARY_OUTLET } from '@angular/router';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

    constructor(private api: ApiService, private router: Router) { }

    ngOnInit() {

    }

    signout() {
        if (this.api.isSignedIn()) {
            this.api.signout();
            this.router.navigate(['/']);
        }
    }

    isHomeActive(): boolean {
        let baseUrl = this.router.url, 
            index = baseUrl.indexOf('?');
        if (index > 0) baseUrl = baseUrl.slice(0, index);
        return baseUrl == '/';
    }

    isLinkActive(segment): boolean {
        if (this.isHomeActive()) return false;
        let group = this.router.parseUrl(this.router.url).root.children[PRIMARY_OUTLET];
        return group.segments[0].toString() == segment;
    }

    isSignedIn(): boolean {
        return this.api.isSignedIn();
    }
}
