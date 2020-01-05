import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Questionnaire } from '../questionnaire';
import { Question } from '../question';

declare var $: any;

@Component({
	selector: 'app-questionnaire-questions',
	templateUrl: './questionnaire-questions.component.html',
	styleUrls: ['./questionnaire-questions.component.css']
})
export class QuestionnaireQuestionsComponent implements OnInit {
	questionnaireID = 0;
	questionnaire = new Questionnaire();
	choiceTypes = [];
	questionnaireTypes = [];
	error = '';

	constructor(private api: ApiService, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
			this.questionnaireID = +params.get('id');
			this.api.getQuestionnaire(this.questionnaireID).subscribe(
				(res) => { 
					this.questionnaire = res;

					this.api.getQuestionnaireTypes().subscribe(
						(res) => {
							this.questionnaireTypes = res;
							$('#questions').DataTable({
								'pageLength': 25,
								'columnDefs': [
									{
										'targets': 3,
										'searchable': false,
										'orderable': false
									}
								]
							});
						},
						err => { this.error = this.parseError(err); }
					);
				},
				err => { this.error = this.parseError(err); }
			);
		});
		this.api.getChoiceTypes().subscribe(
			res => { this.choiceTypes = res; },
			err => { this.error = this.parseError(err); }
		);
	}

	getChoiceType(id: number): string {
		let ct = this.choiceTypes.find(e => e.id == id);
		return ct ? ct.type : null;
	}

	getQuestion(id: number): Question {
		return this.questionnaire.questions.find(e => e.id == id);
	}

	getTypeName(typeID: number): string {
		let type = this.questionnaireTypes.find(e => e.id == typeID);
		return type ? type.name : '';
	}

	parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }
}
