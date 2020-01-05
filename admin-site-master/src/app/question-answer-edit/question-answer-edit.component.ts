import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';
import { QuestionAnswer } from '../question-answer';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../question';
import { Tag } from '../tag';
import { QuestionAnswerTag } from '../question-answer-tag';
import { Questionnaire } from '../questionnaire';
import { QuestionChoice } from '../question-choice';

@Component({
    selector: 'app-question-answer-edit',
    templateUrl: './question-answer-edit.component.html',
    styleUrls: ['./question-answer-edit.component.css']
})
export class QuestionAnswerEditComponent implements OnInit {
    error = '';
    qaID = 0;
    questionAnswer = new QuestionAnswer();
    qaTags = [];
    success = false;
    message = '';
    allQuestions: Question[] = [];
    allTags = [];
    allQuestionnaires: Questionnaire[] = [];
    selectedQ = new Questionnaire();

    constructor(private route: ActivatedRoute, private api: ApiService) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.qaID = parseInt(params.get('id'), 10);

            this.api.getQuestionAnswerRule(this.qaID).subscribe(
                (res) => { 
                    this.questionAnswer = res;
                    this.qaTags = JSON.parse(JSON.stringify(res.tags));

                    this.api.getAllQuestionnaires().subscribe(
                        (res) => { 
                            this.allQuestionnaires = res;
                            for (const q of this.allQuestionnaires) {
                                if (q.questions.find(e => e.id == this.questionAnswer.questionID)) {
                                    this.selectedQ = q;
                                    break;
                                }
                            }
                        },
                        err => { this.error = err; }
                    );

                    this.api.getAllTags().subscribe(
                        res => { this.convertTags(res); },
                        err => { this.error = err; }
                    );
                },
                err => { this.error = err; }
            );
        });

        this.api.getAllQuestions().subscribe(
            res => { this.allQuestions = res; },
            err => { this.error = err; }
        );
    }

    // See SongEditComponent.
    convertTags(allTags: Tag[]) {
        this.allTags = allTags.map(t => {
            let elem = this.questionAnswer.tags.find(e => e.tagID == t.id);

            return {
                id: t.id,
                name: t.name,
                _id: elem ? elem.id : 0
            }
        });

        this.qaTags = this.allTags.filter(t => t._id != 0);
    }

    save() {
        let temp = JSON.parse(JSON.stringify(this.questionAnswer));

        for (const t of temp.tags) {
            let elem = this.qaTags.find(e => e._id == t.id);
            if (!elem) t.questionAnswerID = 0;
            else t.questionAnswerID = temp.id;
        }

        for (const t of this.qaTags) {
            let elem = temp.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else {
                temp.tags.push(
                    new QuestionAnswerTag(0, temp.id, t.id)
                );
            }
        }

        this.api.updateQuestionAnswerRule(temp).subscribe(
            (res) => {
                this.success = res.success;
                this.message = res.message;

                this.api.getQuestionAnswerRule(this.qaID).subscribe(
                    (res) => {
                        this.questionAnswer = res;
                        this.convertTags(this.allTags);
                    },
                    err => { this.handleError(err); }
                );
            },
            err => { this.handleError(err); }
        );
    }

    handleError(err) {
        let msg = err;
        if (err.error && err.error.message) msg = err.error.message;
        this.success = false;
        this.message = msg;
    }

    getChoices(): QuestionChoice[] {
        let q = this.selectedQ.questions.find(e => e.id == this.questionAnswer.questionID);
        return q ? q.choices : [];
    }
}
