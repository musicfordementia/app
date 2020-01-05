import { Component, OnInit } from '@angular/core';
import { PlaylistRule, PlaylistRuleTag } from '../playlist-rule';
import { Tag } from '../tag';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-playlist-rule-edit',
    templateUrl: './playlist-rule-edit.component.html',
    styleUrls: ['./playlist-rule-edit.component.css']
})
export class PlaylistRuleEditComponent implements OnInit {
    error = '';
    rule = new PlaylistRule();
    allOps = [
        { name: 'Equal to', op: '==' },
        { name: 'Higher than', op: '>' },
        { name: 'Lower than', op: '<' }
    ];
    allTags = [];
    ruleTags = [];
    success = false;
    message = '';

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let ruleID = parseInt(params.get('id'), 10);
            this.api.getPlaylistRule(ruleID).subscribe(
                res => { 
                    this.rule = res;

                    this.api.getAllTags().subscribe(
                        res => { this.convertTags(res); },
                        err => { this.error = this.parseError(err); }
                    );
                },
                err => { this.error = this.parseError(err); }
            );
        });
    }

    save() {
        let temp = JSON.parse(JSON.stringify(this.rule));

        for (const t of temp.tags) {
            let elem = this.ruleTags.find(e => e._id == t.id);
            if (!elem) t.questionAnswerID = 0;
            else t.questionAnswerID = temp.id;
        }

        for (const t of this.ruleTags) {
            let elem = temp.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else {
                temp.tags.push(
                    new PlaylistRuleTag(0, temp.id, t.id)
                );
            }
        }

        this.api.updatePlaylistRule(temp).subscribe(
            (res) => {
                this.success = res.success;
                this.message = res.message;

                this.api.getPlaylistRule(temp.id).subscribe(
                    res => {
                        this.rule = res;
                        this.convertTags(this.allTags);
                    },
                    err => {
                        this.success = false;
                        this.message = this.parseError(err);
                    }
                );
            }, 
            (err) => {
                this.success = false;
                this.message = this.parseError(err);
            }
        );
    }

    parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }

    // See SongEditComponent.
    convertTags(allTags: Tag[]) {
        this.allTags = allTags.map(t => {
            let elem = this.rule.tags.find(e => e.tagID == t.id);

            return {
                id: t.id,
                name: t.name,
                _id: elem ? elem.id : 0
            }
        });

        this.ruleTags = this.allTags.filter(t => t._id != 0);
    }
}
