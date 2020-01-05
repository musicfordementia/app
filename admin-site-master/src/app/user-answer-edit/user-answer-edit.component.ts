import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Questionnaire } from '../questionnaire';
import { QuestionAnswers, Answer, AnswerTag } from '../questionnaire-answers';
import { Question } from '../question';
import { Tag } from '../tag';

@Component({
    selector: 'app-user-answer-edit',
    templateUrl: './user-answer-edit.component.html',
    styleUrls: ['./user-answer-edit.component.css']
})
export class UserAnswerEditComponent implements OnInit {
    error = '';
    userID = 0;
    answerID = 0;
    questionnaire = new Questionnaire();
    question = new Question();
    answer = new Answer();
    allTags = [];
    answerTags = [];
    hasEditedTags = false;
    success = false;
    message = '';

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.userID = +params.get('id');
            this.questionnaire.id = +params.get('qid');
            this.answerID = +params.get('answerID');

            this.api.getUserAnswers(this.userID).subscribe(
                res => {
                    // Find the question and answer.
                    let arr = res.filter(qa => qa.questionnaireID == this.questionnaire.id);
                    for (const qa of arr) {
                        let elem = qa.questionAnswers.find(
                            e => e.answers.findIndex(a => a.id == this.answerID) >= 0
                        );
                        if (elem) {
                            this.question.id = elem.questionID;
                            this.answer = elem.answers.find(e => e.id == this.answerID);

                            this.api.getAllTags().subscribe(
                                res => { this.convertTags(res); },
                                err => { this.error = err; }
                            );
                            break;
                        }
                    }
                },
                err => { this.error = err; }
            );

            this.api.getQuestionnaire(this.questionnaire.id).subscribe(
                res => { 
                    this.questionnaire = res;
                    this.question = this.questionnaire.questions.find(e => e.id == this.question.id);
                },
                err => { this.error = err; }
            );
        });
    }

    convertTags(allTags: Tag[]) {
        this.allTags = allTags.map(t => {
            let elem = this.answer.tags.find(e => e.tagID == t.id);

            return {
                id: t.id,
                name: t.name,
                _id: elem ? elem.id : 0
            };
        });
        
        this.answerTags = this.allTags.filter(t => t._id != 0);
    }

    updateTags() {
        let toDelete = [];

        // Check the original tags to see if we've deleted any.
        for (const t of this.answer.tags) {
            let index = this.answerTags.findIndex(e => e._id == t.id);
            if (index < 0) {
                toDelete.push(index);
                this.hasEditedTags = true;
            }
            else t.answerID = this.answer.id;
        }

        for (const i of toDelete) {
            this.answer.tags.splice(i, 1);
        }

        // Check the tags model to see if we've added any.
        for (const t of this.answerTags) {
            let elem = this.answer.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else {
                this.answer.tags.push(new AnswerTag(0, this.answerID, t.id));
                this.hasEditedTags = true;
            }
        }
    }

    save() {
        this.updateTags();

        if (!this.hasEditedTags) return;

        this.api.updateUserAnswerTags(this.userID, this.answerID, this.answer.tags).subscribe(
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
}
