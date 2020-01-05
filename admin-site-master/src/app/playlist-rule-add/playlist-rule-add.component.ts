import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { PlaylistRule, PlaylistRuleTag } from '../playlist-rule';
import { Tag } from '../tag';

@Component({
    selector: 'app-playlist-rule-add',
    templateUrl: './playlist-rule-add.component.html',
    styleUrls: ['./playlist-rule-add.component.css']
})
export class PlaylistRuleAddComponent implements OnInit {
    error = '';
    rule = new PlaylistRule();
    allOps = [
        { name: 'Equal to', op: '==' },
        { name: 'Higher than', op: '>' },
        { name: 'Lower than', op: '<' }
    ];
    allTags: Tag[] = [];
    ruleTags: Tag[] = [];
    success = false;
    message = '';

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getAllTags().subscribe(
            res => { this.allTags = res; },
            err => { this.error = this.api.parseError(err); }
        );
    }

    add() {
        for (const t of this.ruleTags) {
            this.rule.tags.push(new PlaylistRuleTag(0, 0, t.id));
        }

        this.api.addPlaylistRule(this.rule).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;
            },
            err => {
                this.success = false;
                this.message = this.api.parseError(err);
            }
        );
    }
}
