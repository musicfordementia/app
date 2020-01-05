import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { QuestionAnswer } from '../question-answer';
import { Tag } from '../tag';
import { Question } from '../question';
import { Questionnaire } from '../questionnaire';
import { User } from '../user';

declare var $: any;

@Component({
    selector: 'app-question-answer-list',
    templateUrl: './question-answer-list.component.html',
    styleUrls: ['./question-answer-list.component.css']
})
export class QuestionAnswerListComponent implements OnInit {
    error = '';
    questionAnswers: QuestionAnswer[] = [];
    allTags: Tag[] = [];
    allQuestions: Question[] = [];
    questionAnswersDT: any;
    allQuestionnaires: Questionnaire[] = [];
    isRunning = false;
    allUsers: User[] = [];
    selectedUser: User;
    selectedQ: Questionnaire;
    matchedRules: number[] = [];
    success = false;
    message = '';

    constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.api.getAllQuestionAnswerRules().subscribe(
            (res) => { 
                this.questionAnswers = res;

                this.api.getAllTags().subscribe(
                    (res) => {
                        this.allTags = res;

                        this.api.getAllQuestions().subscribe(
                            (res) => {
                                this.allQuestions = res;

                                this.cdr.detectChanges();
                                this.questionAnswersDT = $('#questionAnswers').DataTable({
                                    pageLength: 25,
                                    columnDefs: [
                                        {
                                            targets: [5],
                                            searchable: false,
                                            orderable: false
                                        }
                                    ]
                                });
                            },
                            err => { this.error = this.parseError(err); }
                        );
                    }, 
                    err => { this.error = this.parseError(err); }
                );
            },
            err => { this.error = this.parseError(err); }
        );

        this.api.getAllQuestionnaires().subscribe(
            res => { this.allQuestionnaires = res; },
            err => { this.error = this.parseError(err); }
        );

        this.api.getAllUsers().subscribe(
            res => { this.allUsers = res; },
            err => { this.error = this.parseError(err); }
        );
    }

    getTagsAsString(id: number): string {
        if (!this.questionAnswers) return '';
        let qa = this.questionAnswers.find(e => e.id == id);
        return qa ? qa.tags.map(t => this.getTagName(t.tagID)).join(', ') : '';
    }

    getTagName(id: number): string {
        if (!this.allTags) return '';
        let tag = this.allTags.find(t => t.id == id);
        return tag ? tag.name : '';
    }

    getQuestionStr(qid: number): string {
        if (!this.allQuestions) return '';
        let q = this.allQuestions.find(q => q.id == qid);
        return q ? q.str : '';
    }

    getQuestionnaireName(questionID: number): string {
        for (const q of this.allQuestionnaires) {
            if (q.questions.find(e => e.id == questionID)) return q.name;
        }

        return '';
    }

    parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }

    runRules() {
        if (!this.selectedUser || !this.selectedQ) return;

        this.isRunning = true;
        this.api.runQuestionAnswerRules(this.selectedUser.id, this.selectedQ.id).subscribe(
            (res) => {
                this.success = res['success'];
                this.message = res['message'];
                this.matchedRules = res['matchedRules'];
                this.isRunning = false;
            },
            (err) => {
                this.success = false;
                this.message = this.parseError(err);
                this.isRunning = false;
            }
        );
    }
}
