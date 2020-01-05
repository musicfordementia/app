import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist, PlaylistTag } from '../playlist';
import { ApiService } from '../api.service';
import { Location } from '@angular/common';
import { Tag } from '../tag';
import { Song } from '../song';

declare var $: any;

@Component({
    selector: 'app-playlist-edit',
    templateUrl: './playlist-edit.component.html',
    styleUrls: ['./playlist-edit.component.css']
})
export class PlaylistEditComponent implements OnInit {
    error = '';
    playlist = new Playlist();
    playlistTags = [];
    allTags = [];
    songModes = [];
    songGenres = [];
    songLyrics = [];
    songTags: Tag[] = [];
    allSongs: Song[] = [];
    playlistSongsDT: any;
    success = false;
    message = '';
    /*
     * Currently, the server will "delete" all the songs in a playlist then re-add them, regardless
     * of whether they've been edited or not.
     * If the user hasn't added/deleted a song, then set playlist.songs to null.
     * Likewise with tags.
     * The server won't update falsey values, so it saves the server from deleting and re-adding
     * songs and/or tags unnecessarily.
     */
    hasEditedSongs = false;
    hasEditedTags = false;

    constructor(private route: ActivatedRoute, 
                private api: ApiService, 
                private cdr: ChangeDetectorRef,
                private loc: Location) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let playlistID = parseInt(params.get('id'), 10);
            this.api.getPlaylist(playlistID).subscribe(
                res => { 
                    this.playlist = res;
                    this.playlistTags = JSON.parse(JSON.stringify(this.playlist.tags));

                    this.api.getAllTags().subscribe(
                        res => { 
                            this.convertTags(res);
                            this.createPlaylistSongsDT();
                        },
                        err => { this.error = err; }
                    );
                },
                err => { this.error = err; }
            );
        });

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
            res => { this.songTags = res; },
            err => { this.error = err; }
        );
        
        this.api.getAllSongs().subscribe(
            res => {
                this.allSongs = res;
                this.cdr.detectChanges();
                $('#songsToAdd').DataTable({
                    'pageLength': 10,
                    'columnDefs': [
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
        this.hasEditedSongs = true;
        this.playlist.songs.push(song);
        this.reloadPlaylistSongsDT();
    }

    deleteSong(songID: number) {
        this.hasEditedSongs = true;
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

    save() {
        this.updateTags();

        // Setting songs/tags to null will temporarily hide the songs/tags until we get them from
        // the server, so make a temporary copy of the playlist.
        let temp = JSON.parse(JSON.stringify(this.playlist));
        // Don't update songs.
        if (!this.hasEditedSongs) temp.songs = null;
        // Don't update tags.
        if (!this.hasEditedTags) temp.tags = null;

        this.api.updatePlaylist(temp).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;

                this.api.getPlaylist(this.playlist.id).subscribe(
                    res => { 
                        this.playlist = res;
                        this.convertTags(this.allTags);
                    },
                    err => { this.handleError(err); }
                );
            },
            err => { this.handleError(err); }
        );
    }

    cancel() {
        this.loc.back();
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

    updateTags() {
        let toDelete = [];

        // Check the original tags to see if we've deleted any.
        for (const t of this.playlist.tags) {
            let index = this.playlistTags.findIndex(e => e._id == t.id);
            if (index < 0) {
                toDelete.push(index);
                this.hasEditedTags = true;
            }
            else t.playlistID = this.playlist.id;
        }

        for (const i of toDelete) {
            this.playlist.tags.splice(i, 1);
        }

        // Check the tags model to see if we've added any.
        for (const t of this.playlistTags) {
            let elem = this.playlist.tags.find(e => e.id != 0 && e.id == t._id);
            if (elem) elem.tagID = t.id;
            else {
                this.playlist.tags.push(new PlaylistTag(0, this.playlist.id, t.id));
                this.hasEditedTags = true;
            }
        }
    }

    handleError(err) {
        let msg = err;
        if (err.error && err.error.message) msg = err.error.message;
        this.success = false;
        this.message = msg;
    }
}
