import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    username = '';
    password = '';
    signingIn = false;
    success = false;
    message = '';

    constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        if (this.api.isSignedIn()) this.router.navigate(['users']);
    }

    signin() {
        this.signingIn = true;
        this.api.signin(this.username, this.password).subscribe(
            res => {
                this.success = res['success'];
                this.message = res['message'];
                this.signingIn = false;
                if (this.success) {
                    this.route.queryParams.subscribe(params => {
                        this.router.navigate([params.returnUrl ? params.returnUrl : 'users']);
                    });
                }
            },
            err => {
                this.success = false;
                this.message = err;
                this.signingIn = false;
            }
        );
    }
}
