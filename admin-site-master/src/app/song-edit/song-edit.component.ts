import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Song } from '../song';
import { ActivatedRoute } from '@angular/router';
import { SongTag } from '../songtag';
import { Location } from '@angular/common';
import { Tag } from '../tag';

@Component({
    selector: 'app-song-edit',
    templateUrl: './song-edit.component.html',
    styleUrls: ['./song-edit.component.css']
})
export class SongEditComponent implements OnInit {
    error = '';
    song = new Song();
    songTags = [];
    allModes = [];
    allGenres = [];
    allLyrics = [];
    allTags = [];
    success = false;
    message = '';

    constructor(private api: ApiService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let songID = +params.get('id');

            this.api.getSong(songID).subscribe(
                res => { 
                    this.song = res;

                    this.api.getAllTags().subscribe(
                        res => { this.convertTags(res); },
                        err => { this.error = this.api.parseError(err); }
                    );
                },
                err => { this.error = this.api.parseError(err); }
            );
        });

        this.api.getSongModes().subscribe(
            res => { this.allModes = res; },
            err => { this.error = this.api.parseError(err); }
        );

        this.api.getSongGenres().subscribe(
            res => { this.allGenres = res; },
            err => { this.error = this.api.parseError(err); }
        );

        this.api.getSongLyrics().subscribe(
            res => { this.allLyrics = res; },
            err => { this.error = this.api.parseError(err); }
        );
    }

    save() {
        // Set deleted tags songID to 0.
        for (const t of this.song.tags) {
            let elem = this.songTags.find(e => e._id == t.id);
            if (!elem) t.songID = 0;
            else t.songID = this.song.id;
        }
        // Add new tags and update existing tags.
        for (const t of this.songTags) {
            let elem = this.song.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else this.song.tags.push(new SongTag(0, this.song.id, t.id));
        }

        this.api.updateSong(this.song).subscribe(
            (res) => {
                this.success = res.success;
                this.message = res.message;

                this.api.getSong(this.song.id).subscribe(
                    res => { 
                        this.song = res;
                        this.convertTags(this.allTags);
                    },
                    err => { 
                        this.success = false;
                        this.message = this.api.parseError(err);
                    }
                );
            },
            err => { 
                this.success = false;
                this.message = this.api.parseError(err);
            }
        );
    }

    /*
     * items and ngModel must have the some properties, but in this case, items is Tag[] but 
     * song.tags is SongTag[].
     * Tag has id and name, but SongTag has id, songID and tagID, so we need to copy over the 
     * missing properties to another variable (songTags).
     */
    convertTags(allTags: Tag[]) {
        this.allTags = allTags.map(t => {
            let elem = this.song.tags.find(e => e.tagID == t.id);

            return {
                id: t.id,
                name: t.name,
                _id: elem ? elem.id : 0
            };
        });
    
        this.songTags = this.allTags.filter(t => t._id != 0);
    }
}
