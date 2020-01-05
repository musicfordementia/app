import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-user-add',
    templateUrl: './user-add.component.html',
    styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
    error = '';
    user = new User();
    userTypes = [];
    showPassword = false;
    success = false;
    message = '';

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getUserTypes().subscribe(
            res => {
                this.userTypes = res;
            },
            err => {
                this.error = this.api.parseError(err);
            }
        );
    }

    addUser() {
        this.api.addUser(this.user).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;
            },
            err => {
                this.success = false;
                this.message = this.api.parseError(err);
            }
        );
    }
}
