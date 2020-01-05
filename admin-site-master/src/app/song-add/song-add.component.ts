import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Song } from '../song';
import { Tag } from '../tag';
import { SongTag } from '../songtag';

@Component({
    selector: 'app-song-add',
    templateUrl: './song-add.component.html',
    styleUrls: ['./song-add.component.css']
})
export class SongAddComponent implements OnInit {
    error = '';
    song = new Song();
    allModes = [];
    allGenres = [];
    allLyrics = [];
    allTags = [];
    songTags = [];
    success = false;
    message = '';

    constructor(private api: ApiService) { }

    ngOnInit() {
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

        this.api.getAllTags().subscribe(
            res => { this.convertTags(res); },
            err => { this.error = this.api.parseError(err); }
        );
    }

    add() {
        for (const t of this.songTags) {
            this.song.tags.push(new SongTag(0, this.song.id, t.id));
        }

        this.api.addSong(this.song).subscribe(
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
