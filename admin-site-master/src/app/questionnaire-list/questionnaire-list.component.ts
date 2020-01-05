import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Questionnaire } from '../questionnaire';
import { MessageMap } from '../messagemap';

declare var $: any;

@Component({
	selector: 'app-questionnaire-list',
	templateUrl: './questionnaire-list.component.html',
	styleUrls: ['./questionnaire-list.component.css']
})
export class QuestionnaireListComponent implements OnInit {
	error = '';
	questionnaireTypes = [];
	questionnaires: Questionnaire[] = [];
	name = '';
	messageMap = new MessageMap();
	editingQs: Questionnaire[] = [];
	questionnairesDT: any;

	constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

	ngOnInit() {
		this.api.getAllQuestionnaires().subscribe(
			(res) => {
				this.questionnaires = res;

				this.api.getQuestionnaireTypes().subscribe(
					(res) => {
						this.questionnaireTypes = res;
						this.cdr.detectChanges();
						this.createQuestionnairesDT();
					},
					err => { this.error = this.parseError(err); }
				);
			},
			err => { this.error = this.parseError(err); }
		);
	}

	edit(q: Questionnaire) {
		let existingQ = this.editingQs.find(e => e.id == q.id);
		if (existingQ) existingQ.name = q.name;
		else this.editingQs.push(JSON.parse(JSON.stringify(q)));

		this.recreateQuestionnairesDT();
	}

	save(q: Questionnaire) {
		this.api.updateQuestionnaire(q).subscribe(
			(res) => {
				let success = res.success;
				if (success) {
					let qu = this.questionnaires.find(e => e.id == q.id);
					qu.name = q.name;
					qu.typeID = q.typeID;
				}
				this.messageMap.push(q.id, res.message, success);
				this.cancel(q.id);
			},
			err => {
				this.messageMap.push(q.id, this.parseError(err), false);
			}
		);
	}

	cancel(id: number) {
		let index = this.editingQs.findIndex(e => e.id == id);
		if (index != -1) this.editingQs.splice(index, 1);

		this.recreateQuestionnairesDT();
	}

	getSelectedQuestionnaire(qid: number): Questionnaire {
		return this.editingQs.find(e => e.id == qid);
	}

	createQuestionnairesDT() {
		let isEditing = this.editingQs.length > 0;
		this.questionnairesDT = $('#questionnaires').DataTable({
			'pageLength': 25,
			'columnDefs': [
				{
					'targets': isEditing ? '_all' : 3,
					'searchable': false,
					'orderable': false
				},
				{
					targets: [0],
					visible: false
				}
			]
		});
	}

	recreateQuestionnairesDT() {
		this.questionnairesDT.destroy();
		this.cdr.detectChanges();
		this.createQuestionnairesDT();
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

