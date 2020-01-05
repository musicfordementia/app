import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Questionnaire } from '../questionnaire';
import { QuestionnaireAnswers } from '../questionnaire-answers';
import { Tag } from '../tag';
import { User } from '../user';

declare var $: any;

@Component({
    selector: 'app-user-answers',
    templateUrl: './user-answers.component.html',
    styleUrls: ['./user-answers.component.css']
})
export class UserAnswersComponent implements OnInit {
    error = '';
    user = new User();
    userID = 0;
    questionnaireID = 0;
    answersDT: any;
    qa = new QuestionnaireAnswers();
    questionnaires = [];
    currQuestionnaire = new Questionnaire();
    allTags: Tag[] = [];
    isRunning = false;
    success = false;
    message = '';
    matchedRules: number[] = [];

    constructor(private route: ActivatedRoute, 
                private api: ApiService,
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.userID = +params.get('id');
            this.questionnaireID = +params.get('qid');

            this.api.getUser(this.userID).subscribe(
                (res) => { 
                    this.user = res;

                    this.api.getUserAnswers(this.userID).subscribe(
                        (res) => {
                            /* 
                             * TODO: A user can answer a questionnaire more than once, so this will
                             * return the wrong answers.
                             */
                            this.qa = res.find(e => e.questionnaireID == this.questionnaireID);
                            if (!this.qa) {
                                this.error = 'Questionnaire not completed';
                                return;
                            }
                            
                            this.api.getQuestionnaire(this.questionnaireID).subscribe(
                                (res) => { 
                                    this.currQuestionnaire = res;
        
                                    this.api.getAllTags().subscribe(
                                        (res) => {
                                            this.allTags = res;
                                            this.cdr.detectChanges();
                                            this.createAnswersDT();
                                        },
                                        err => { this.error = this.api.parseError(err); }
                                    );
                                },
                                err => { this.error = this.api.parseError(err); }
                            );
                        },
                        err => { this.error = this.api.parseError(err); }
                    );
                },
                err => { this.error = this.api.parseError(err); }
            );
        });
    }

    getQuestion(qid: number): string {
        let q = this.currQuestionnaire.questions.find(e => e.id == qid);
        return q ? q.str : '';
    }

    getTagName(tagID: number): string {
        let tag = this.allTags.find(e => e.id == tagID);
        return tag ? tag.name : '';
    }

    getTags(qid: number): string {
        let qAns = this.qa.questionAnswers.find(e => e.questionID == qid);
        if (!qAns) return '';

        let tags = '';
        for (const ans of qAns.answers) {
            for (const tag of ans.tags) {
                tags += this.getTagName(tag.tagID) + ', ';
            }
        }
        return tags.slice(0, -2);
    }

    runRules() {
        this.isRunning = true;
        this.api.runQuestionAnswerRules(this.userID, this.questionnaireID).subscribe(
            (res) => {
                this.success = res['success'];
                this.message = res['message'];
                this.matchedRules = res['matchedRules'];
                this.isRunning = false;

                this.api.getUserAnswers(this.userID).subscribe(res => {
                    this.qa = res.find(e => e.questionnaireID == this.questionnaireID);
                    this.reloadAnswersDT();
                });
            },
            (err) => {
                this.success = false;
                this.message = this.api.parseError(err);
                this.isRunning = false;
            }
        );
    }

    createAnswersDT() {
        this.answersDT = $('#answers').DataTable({
            pageLength: 25
        });
    }

    reloadAnswersDT() {
        this.answersDT.destroy();
        this.cdr.detectChanges();
        this.createAnswersDT();
    }
}
