import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { PlaylistRule } from '../playlist-rule';
import { Tag } from '../tag';
import { User } from '../user';

declare var $: any;

@Component({
    selector: 'app-playlist-rules',
    templateUrl: './playlist-rules.component.html',
    styleUrls: ['./playlist-rules.component.css']
})
export class PlaylistRulesComponent implements OnInit {
    error = '';
    allRules: PlaylistRule[] = [];
    allTags: Tag[] = [];
    allOps = [
        { name: 'Equal to', op: '==' },
        { name: 'Higher than', op: '>' },
        { name: 'Lower than', op: '<' }
    ];
    allUsers: User[] = [];
    selectedUser: User;
    isRunning = false;
    success = false;
    message = '';
    matchedRules: number[] = [];

    constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.api.getAllPlaylistRules().subscribe(
            (res) => { 
                this.allRules = res;

                this.api.getAllTags().subscribe(
                    (res) => { 
                        this.allTags = res;
                        this.cdr.detectChanges();
                        $('#rules').DataTable({
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
                    err => { this.error = err.message }
                );
            },
            err => { this.error = err.message; }
        );

        this.api.getAllUsers().subscribe(
            res => { this.allUsers = res; },
            err => { this.error = this.parseError(err); }
        );
    }

    getTagName(tagID: number): string {
        let tag = this.allTags.find(e => e.id == tagID);
        return tag ? tag.name : '';
    }

    getRuleTags(ruleID: number): string {
        let rule = this.allRules.find(e => e.id == ruleID);
        if (!rule) return '';

        return rule.tags.map(e => this.getTagName(e.tagID)).join(', ');
    }

    getOpName(op: string): string {
        let elem = this.allOps.find(e => e.op == op);
        return elem ? elem.name : 'Unknown';
    }

    parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }

    runRules() {
        this.isRunning = true;
        this.api.runPlaylistRules(this.selectedUser.id).subscribe(
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
