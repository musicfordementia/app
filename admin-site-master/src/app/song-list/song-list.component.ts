import { Component, OnInit } from '@angular/core';

import { Song } from '../song';
import { ApiService } from '../api.service';
import { Tag } from '../tag';

declare var $: any;

@Component({
	selector: 'app-song-list',
	templateUrl: './song-list.component.html',
	styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {
	songs: Song[] = [];
	songModes = [];
	songGenres = [];
	songLyrics = [];
	songTags: Tag[] = [];
	error = '';

	constructor(private api: ApiService) { }

	ngOnInit() {
		this.api.getSongModes().subscribe(
			res => { this.songModes = res; },
			err => { this.error = this.parseError(err); }
		);

		this.api.getSongGenres().subscribe(
			res => { this.songGenres = res; },
			err => { this.error = this.parseError(err); }
		);

		this.api.getSongLyrics().subscribe(
			res => { this.songLyrics = res; },
			err => { this.error = this.parseError(err); }
		);

		this.api.getAllSongs().subscribe(
			(res: Song[]) => { 
				this.songs = res;
				$(document).ready(function() {
					$('#songs').DataTable({
						"pageLength": 25,
						"columnDefs": [
							{
								"targets": 10,
								"searchable": false,
								"orderable": false
							}
						]
					});
				});
			},
			err => { this.error = this.parseError(err); }
		);

		this.api.getAllTags().subscribe(
			res => { this.songTags = res; },
			err => { this.error = this.parseError(err); }
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
		let song = this.songs.find(e => e.id == songID);
		return song.tags.map(e => {
            let tag = this.songTags.find(t => t.id == e.tagID);
            return tag ? tag.name : '';
        }).join(', ');
	}

	parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }
}
