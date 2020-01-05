import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { User } from '../user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.css']
})
export class UserUpdatePasswordComponent implements OnInit {
    error = '';
    userID = 0;
    email = '';
    password = '';
    passwordLength = 10;
    success = false;
    message = '';

    constructor(private route: ActivatedRoute, private api: ApiService, private loc: Location) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.userID = +params.get('id');

            this.api.getUser(this.userID).subscribe(
                res => { this.email = res.email; },
                err => { 
                    this.success = err.error['success'];
                    this.message = err.error['message'];
                }
            );
        });
    }

    randomPassword() {
        let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789"
        this.password = '';
        for (let i = 0; i < this.passwordLength; i++) {
            this.password += str.charAt(Math.random() * str.length);
        }
    }

    updatePassword() {
        this.api.updatePassword(this.userID, this.password).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;
            },
            err => {
                this.success = err.error['success'];
                this.message = err.error['message'];
            }
        );
    }

	cancel() {
		this.loc.back();
	}
}
