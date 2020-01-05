import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../question';
import { ApiService } from '../api.service';
import { QuestionChoice } from '../question-choice';
import { Location } from '@angular/common';

@Component({
	selector: 'app-question-edit',
	templateUrl: './question-edit.component.html',
	styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit {
	questionID = 0;
	questionnaireID = 0;
	choiceTypes = [];
	choices = [];
	question = new Question();
	error = '';
	success = false;
	message = '';

	constructor(private route: ActivatedRoute, private api: ApiService) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			this.questionnaireID = +params.get('id');
			this.questionID = +params.get('qid');

			this.api.getQuestion(this.questionID).subscribe(
				res => { this.question = res[0]; },
				err => { this.error = err; }
			);

			this.api.getChoices(this.questionnaireID).subscribe(
				res => { this.choices = res; },
				err => { this.error = err; }
			);
		});
		this.api.getChoiceTypes().subscribe(
			res => { this.choiceTypes = res; },
			err => { this.error = err; }
		);
	}

	save() {
		this.api.updateQuestion(this.question).subscribe(
			res => { 
				this.success = res['success']; 
				this.message = res['message'];
			},
			err => {
				this.success = err.error['success'];
				this.message = err.error['message'];
			}
		);
	}

	addChoice() {
		this.question.choices.push(new QuestionChoice(0, this.questionID, ''));
	}

	deleteChoice(index: number) {
		this.question.choices[index].questionID = 0;
	}
}
