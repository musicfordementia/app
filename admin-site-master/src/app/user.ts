export class User {
	id: number;
	email: string;
	password: string;
	typeID: number;
	institution: string;
	firstName: string;
	lastName: string;

	constructor(id = 0, email = '', password = '', typeID = 0, institution = '', firstName = '', lastName = '') {
		this.id = id;
		this.email = email;
		this.password = password;
		this.typeID = typeID;
		this.institution = institution;
		this.firstName = firstName;
		this.lastName = lastName;
	}
}