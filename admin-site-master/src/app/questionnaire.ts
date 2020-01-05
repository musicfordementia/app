import { Question } from './question';

export class Questionnaire {
	id: number;
	name: string;
	typeID: number;
	questions: Question[];

	constructor(id = 0, name = '', typeID = 0, questions = []) {
		this.id = id;
		this.name = name;
		this.typeID = typeID;
		this.questions = questions;
	}
}