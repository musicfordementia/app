import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Questionnaire } from '../questionnaire';
import { User } from '../user';

declare var $: any;

@Component({
    selector: 'app-user-questionnaires',
    templateUrl: './user-questionnaires.component.html',
    styleUrls: ['./user-questionnaires.component.css']
})
export class UserQuestionnairesComponent implements OnInit {
    error = '';
    userID = 0;
    completed: number[] = [];
    questionnaires: Questionnaire[] = [];
    user = new User();
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

            this.api.getUser(this.userID).subscribe(
                res => { this.user = res; },
                err => { this.error = this.api.parseError(err); }
            );

            this.api.getUserAnswers(this.userID).subscribe(
                res => {
                    // Get the unique questionnaireIDs.
                    this.completed = [...new Set(res.map(e => e.questionnaireID))];

                    this.api.getAllQuestionnaires().subscribe(
                        res => { 
                            this.questionnaires = res;
                            this.cdr.detectChanges();
                            $('#questionnaires').DataTable({
                                "pageLength": 25,
                                "columnDefs": [
                                    {
                                        targets: 2,
                                        searchable: false,
                                        orderable: false
                                    }
                                ]
                            });
                        },
                        err => { this.error = this.api.parseError(err); }
                    );
                },
                err => { this.error = this.api.parseError(err); }
            );
        });
    }

    getQuestionnaireName(qid: number): string {
        let q = this.questionnaires.find(e => e.id == qid);
        return q ? q.name : '';
    }

    runRules() {
        this.isRunning = true;
        this.api.runQuestionAnswerRules(this.userID, null).subscribe(
            (res) => {
                this.success = res['success'];
                this.message = res['message'];
                this.matchedRules = res['matchedRules'];
                this.isRunning = false;
            },
            (err) => {
                this.success = false;
                this.message = this.api.parseError(err);
                this.isRunning = false;
            }
        );
    }
}
