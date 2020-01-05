import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Playlist, PlaylistTag } from '../playlist';
import { Song } from '../song';
import { Tag } from '../tag';

declare var $: any;

@Component({
    selector: 'app-playlist-add',
    templateUrl: './playlist-add.component.html',
    styleUrls: ['./playlist-add.component.css']
})
export class PlaylistAddComponent implements OnInit {
    error = '';
    playlist = new Playlist();
    playlistTags = [];
    allTags = [];
    songModes = [];
    songGenres = [];
    songLyrics = [];
    songTags: Tag[] = [];
    allSongs: Song[] = [];
    success = false;
    message = '';
    playlistSongsDT: any;

    constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.api.getAllSongs().subscribe(
            res => { 
                this.allSongs = res;
                this.cdr.detectChanges();
                $('#songsToAdd').DataTable({
                    "pageLength": 10,
                    "columnDefs": [
                        {
                            "targets": 10,
                            "searchable": false,
                            "orderable": false
                        }
                    ]
                });
            },
            err => { this.error = err; }
        );

        this.api.getSongModes().subscribe(
            res => { this.songModes = res; },
            err => { this.error = err; }
        );

        this.api.getSongGenres().subscribe(
            res => { this.songGenres = res; },
            err => { this.error = err; }
        );

        this.api.getSongLyrics().subscribe(
            res => { this.songLyrics = res; },
            err => { this.error = err; }
        );
    
        this.api.getAllTags().subscribe(
            res => { 
                this.songTags = JSON.parse(JSON.stringify(res));
                this.convertTags(res);
            },
            err => { this.error = err; }
        );
        
        this.createPlaylistSongsDT();
    }

    getModeName(id: number): string {
        let mode = this.songModes.find(e => e.id == id);
        return mode ? mode.mode : '';
    }

    getGenreName(id: number): string {
        let genre = this.songGenres.find(e => e.id == id);
        return genre ? genre.genre : '';
    }

    getLyricName(id: number): string {
        let lyric = this.songLyrics.find(e => e.id == id);
        return lyric ? lyric.lyric : '';
    }

    formatLength(length: number): string {
        let m = Math.floor(length / 60), 
            s = length % 60,
            fmt = '';

        if (m < 10) fmt += '0';
        fmt += m.toString(10);
        fmt += ':';
        if (s < 10) fmt += '0';
        fmt += s.toString(10);

        return fmt;
    }
    
    getTags(songID: number): string {
        let song = this.allSongs.find(e => e.id == songID);
        if (!song) return '';
        return song.tags.map(e => {
            let tag = this.songTags.find(t => t.id == e.tagID);
            return tag ? tag.name : '';
        }).join();
    }
    
    addSong(song: Song) {
        this.playlist.songs.push(song);
        this.reloadPlaylistSongsDT();
    }

    deleteSong(songID: number) {
        let index = this.playlist.songs.findIndex(e => e.id == songID);
        if (index != -1) {
            this.playlist.songs.splice(index, 1);
            this.reloadPlaylistSongsDT();
        }
    }

    createPlaylistSongsDT() {
        this.playlistSongsDT = $('#playlistSongs').DataTable({
            "pageLength": 10,
            "columnDefs": [
                {
                    "targets": 10,
                    "searchable": false,
                    "orderable": false
                }
            ]
        });
    }

    reloadPlaylistSongsDT() {
        this.playlistSongsDT.destroy();
        this.cdr.detectChanges();
        this.createPlaylistSongsDT();
    }

    submit() {
        // See QuestionAnswerAddComponent.
        let temp = JSON.parse(JSON.stringify(this.playlist));

        for (const t of temp.tags) {
            let elem = this.playlistTags.find(e => e._id == t.id);
            if (!elem) t.playlistID = 0;
            else t.playlistID = temp.id;
        }

        for (const t of this.playlistTags) {
            let elem = temp.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else temp.tags.push(new PlaylistTag(0, temp.id, t.id));
        }

        this.api.addPlaylist(temp).subscribe(
            res => {
                this.success = res['success'];
                this.message = res['message'];
            },
            err => {
                this.success = false;
                this.message = err.error ? err.error['message'] : err;
            }
        );
    }

    // See song-edit.component.ts
    convertTags(allTags: Tag[]) {
        this.allTags = allTags.map(t => {
            let elem = this.playlist.tags.find(e => e.tagID == t.id);

            return {
                id: t.id,
                name: t.name,
                _id: elem ? elem.id : 0
            };
        });
    
        this.playlistTags = this.allTags.filter(t => t._id != 0);
    }
}
