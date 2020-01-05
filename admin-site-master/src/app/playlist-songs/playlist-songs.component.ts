import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../playlist';
import { Song } from '../song';
import { Tag } from '../tag';

declare var $: any;

@Component({
    selector: 'app-playlist-songs',
    templateUrl: './playlist-songs.component.html',
    styleUrls: ['./playlist-songs.component.css']
})
export class PlaylistSongsComponent implements OnInit {
    error = '';
    playlist = new Playlist();
    songModes = [];
	songGenres = [];
    songLyrics = [];
    songTags: Tag[] = [];

    constructor(private api: ApiService, 
                private route: ActivatedRoute,
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.playlist.id = +(params.id);

            this.api.getPlaylist(this.playlist.id).subscribe(
                res => { 
                    this.playlist = res;
                    this.cdr.detectChanges();
                    $('#playlistSongs').DataTable({
                        "pageLength": 25,
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
        let song = this.playlist.songs.find(e => e.id == songID);
        if (!song) return '';
		return song.tags.map(e => {
            let tag = this.songTags.find(t => t.id == e.tagID);
            return tag ? tag.name : '';
        }).join();
    }
}
