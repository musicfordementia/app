import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';
import { QuestionAnswer } from '../question-answer';
import { Question } from '../question';
import { Tag } from '../tag';
import { QuestionAnswerTag } from '../question-answer-tag';
import { Questionnaire } from '../questionnaire';
import { QuestionChoice } from '../question-choice';

@Component({
    selector: 'app-question-answer-add',
    templateUrl: './question-answer-add.component.html',
    styleUrls: ['./question-answer-add.component.css']
})
export class QuestionAnswerAddComponent implements OnInit {
    error = '';
    questionAnswer = new QuestionAnswer();
    qaTags = [];
    success = false;
    message = '';
    allQuestions: Question[] = [];
    allTags = [];
    allQuestionnaires: Questionnaire[] = [];
    selectedQ = new Questionnaire();

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getAllQuestions().subscribe(
            res => { 
                this.allQuestions = res;
            },
            err => { this.error = err; }
        );

        this.api.getAllTags().subscribe(
            res => { this.convertTags(res); },
            err => { this.error = err; }
        );

        this.api.getAllQuestionnaires().subscribe(
            res => { 
                this.allQuestionnaires = res;
                this.selectedQ = res[0];
            },
            err => { this.error = err; }
        );
    }

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

    add() {
        // Clicking add after failing a few times will duplicate the tags, so use a copy.
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

        this.api.addQuestionAnswerRule(temp).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;
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
