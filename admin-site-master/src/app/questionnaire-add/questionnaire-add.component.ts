import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Questionnaire } from '../questionnaire';
import { Question } from '../question';
import { QuestionChoice } from '../question-choice';

@Component({
	selector: 'app-questionnaire-add',
	templateUrl: './questionnaire-add.component.html',
	styleUrls: ['./questionnaire-add.component.css']
})
export class QuestionnaireAddComponent implements OnInit {
	questionnaire = new Questionnaire();
	currQuestion = new Question();		// The question that the user is working on.
	tempQuestion = new Question();		// To save the current question that the user is working on.
	page = 1; pageSize = 25;
	choiceTypes = [];
	questionnaireTypes = [];
	error = '';
	isEditing = false;
	editingQuestion = new Question();	// The question that the user is editing.
	success = false;
	message = '';
	isValid = false;
	validationMessage = '';

	constructor(private api: ApiService) { }

	ngOnInit() {
		this.api.getQuestionnaireTypes().subscribe(
			res => { this.questionnaireTypes = res; },
			err => { this.error = this.parseError(err); }
		);

		this.api.getChoiceTypes().subscribe(
			res => { this.choiceTypes = res; },
			err => { this.error = err; }
		);
	}

	getChoiceType(id: number): string {
		return this.choiceTypes.find(e => e.id == id).type;
	}

	cleanupChoices() {
		this.currQuestion.choices.map(c => { c.str = c.str.trim(); return c; })
		// Filter out empty choices.
		this.currQuestion.choices = this.currQuestion.choices.filter(c => c.str);
	}

	addQuestion() {
		if (!this.validateQuestion()) return;

		this.cleanupChoices();
		this.questionnaire.questions.push(this.currQuestion);
		this.currQuestion = new Question();
	}

	editQuestion(question: Question) {
		if (this.editingQuestion == question) return;

		this.isEditing = true;
		this.editingQuestion = question;
		// Save input.
		this.tempQuestion = JSON.parse(JSON.stringify(this.currQuestion));
		this.currQuestion = JSON.parse(JSON.stringify(question));
	}

	saveQuestion() {
		this.cleanupChoices();
		this.isEditing = false;

		// Update the question.
		this.editingQuestion.id = this.currQuestion.id;
		this.editingQuestion.pageNo = this.currQuestion.pageNo;
		this.editingQuestion.str = this.currQuestion.str;
		this.editingQuestion.typeID = this.currQuestion.typeID;
		this.editingQuestion.hasOther = this.currQuestion.hasOther;
		this.editingQuestion.choices = JSON.parse(JSON.stringify(this.currQuestion.choices));
		// Restore previous input.
		this.currQuestion = JSON.parse(JSON.stringify(this.tempQuestion));
		this.tempQuestion = new Question();
	}

	deleteQuestion(question: Question) {
		this.questionnaire.questions = this.questionnaire.questions.filter(q => q != question);
	}

	addChoice() {
		this.currQuestion.choices.push(new QuestionChoice());
	}

	deleteChoice(i: number) {
		this.currQuestion.choices.splice(i, 1);
	}

	clearQuestion() {
		if (this.isEditing) {
			this.isEditing = false;
			this.currQuestion = this.tempQuestion;
			this.editingQuestion = new Question();
		}
		else {
			this.currQuestion = new Question();
			this.tempQuestion = new Question();
		}
	}

	submit() {
		this.api.addQuestionnaire(this.questionnaire).subscribe(
			res => { 
				this.success = res.success;
				this.message = res.message;
			},
			err => {
				this.success = false;
				this.message = this.parseError(err);
			}
		);
	}

	parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
	}
	
	validateQuestion(): boolean {
		if (this.currQuestion.pageNo <= 0) {
			this.isValid = false;
			this.validationMessage = 'Page number must be greater than 0';
			return false;
		}

		if (this.currQuestion.str.trim().length == 0) {
			this.isValid = false;
			this.validationMessage = 'Please input a question';
			return false;
		}

		if (this.currQuestion.typeID == 0) {
			this.isValid = false;
			this.validationMessage = 'Please select a choice type';
			return false;
		}

		this.isValid = true;
		this.message = '';
		return true;
	}
}
