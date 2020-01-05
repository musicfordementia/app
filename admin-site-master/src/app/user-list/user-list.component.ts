import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import { User } from '../user';
import { ApiService } from '../api.service';
import { MessageMap } from '../messagemap';

declare var $: any;

@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
	userTypes = [];
	users: User[] = [];
	error = '';
	messageMap = new MessageMap();
	// To store the users that have been edited in case updating the user info fails. If it does
	// fail, the admin will have to refresh the page to see the correct user info. This will prevent
	// that from happening.
	editingUsers: User[] = [];
	usersDT: any;

	constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		this.api.getAllUsers().subscribe(
			res => { 
				this.users = res; 
				this.api.getUserTypes().subscribe(
					res => { 
						this.userTypes = res;
						this.cdr.detectChanges();
						this.createUsersDT();
					},
					err => { this.error = this.api.parseError(err); }
				);
			},
			err => { this.error = this.api.parseError(err); }
		);
	}

	save(selUser: User) {
		this.api.updateUser(selUser).subscribe(
			res => {
				let success = res.success;
				this.messageMap.push(selUser.id, res.message, success);
				if (success) {
					// Update the user in users array.
					let user = this.users.find(e => e.id == selUser.id);
					for (const k of Object.keys(user))
						user[k] = selUser[k];
				}
				this.cancel(selUser.id);
			},
			err => {
				this.messageMap.push(selUser.id, this.api.parseError(err), false);
			}
		);
	}

	getUserType(id: number): string {
		let u = this.userTypes.find(e => e.id == id);
		return u ? u.type : '';
	}

	editUser(user: User) {
		let existingUser = this.editingUsers.find(e => e.id == user.id);
		if (!existingUser) {
			this.editingUsers.push(JSON.parse(JSON.stringify(user)));
		}
		else {
			// Update existing user.
			for (const k of Object.keys(existingUser))
				existingUser[k] = user[k];
		}

		this.messageMap.clearMessage(user.id);
		this.recreateUsersDT();
	}

	getSelectedUser(id: number) {
		return this.editingUsers.find(e => e.id == id);
	}

	cancel(id: number) {
		let index = this.editingUsers.findIndex(e => e.id == id);
		if (index != -1) this.editingUsers.splice(index, 1);

		this.recreateUsersDT();
	}

	createUsersDT() {
		let isEditing = this.editingUsers.length > 0;
		this.usersDT = $('#users').DataTable({
			"pageLength": 25,
			"columnDefs": [
				{
					"targets": isEditing ? '_all': 6,
					"searchable": false,
					"orderable": false
				},
				{
					targets: [0],
					visible: false
				}
			]
		});
	}

	recreateUsersDT() {
		this.usersDT.destroy();
		this.cdr.detectChanges();
		this.createUsersDT();
	}
}