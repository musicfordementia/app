import { QuestionChoice } from './question-choice'

export class Question {
	id: number;
	pageNo: number;
	str: string;
	typeID: number;
	hasOther: boolean;
	visibleIfChoiceID: number;
	choices: QuestionChoice[];

	constructor(id: number = 0, pageNo: number = 0, str: string = '', typeID: number = 0, 
				hasOther: boolean = false, visibleIfChoiceID: number = 0, 
				choices: QuestionChoice[] = []) {
		this.id = id;
		this.pageNo = pageNo;
		this.str = str;
		this.typeID = typeID;
		this.hasOther = hasOther;
		this.visibleIfChoiceID = visibleIfChoiceID;
		this.choices = choices;
	}
}