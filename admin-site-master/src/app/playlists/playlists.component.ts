import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Playlist } from '../playlist';
import { MessageMap } from '../messagemap';
import { Tag } from '../tag';

declare var $: any;

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
    error = '';
    playlists: Playlist[] = [];
    allTags: Tag[] = [];
    messageMap = new MessageMap();
    editingPlaylists: Playlist[] = [];
    playlistsDT: any;
    savingMap = [];

    constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.api.getAllPlaylists().subscribe(
            (res) => { 
                this.playlists = res;

                this.api.getAllTags().subscribe(
                    (res) => { 
                        this.allTags = res;
                        this.cdr.detectChanges();
                        this.playlistsDT = $('#playlists').DataTable({
                            "pageLength": 25,
                            "columnDefs": [
                                {
                                    targets: 3,
                                    searchable: false,
                                    orderable: false
                                }
                            ]
                        });
                    },
                    err => { this.error = this.parseError(err); }
                );
            },
            err => { this.error = this.parseError(err); }
        );
    }

    cancel(id: number) {
        let index = this.editingPlaylists.findIndex(e => e.id == id);
        if (index != -1) this.editingPlaylists.splice(index, 1);
        this.recreatePlaylistsDT(this.editingPlaylists.length > 0);
    }

    getSelectedPlaylist(id: number): Playlist {
        return this.editingPlaylists.find(e => e.id == id);
    }

    createPlaylistsDT(isEditing = false) {
        this.playlistsDT = $('#playlists').DataTable({
            "pageLength": 25,
            "columnDefs": [
                {
                    targets: isEditing ? '_all' : 3,
                    searchable: false,
                    orderable: false
                }
            ]
        });
    }

    recreatePlaylistsDT(isEditing = false) {
        this.playlistsDT.destroy();
        this.cdr.detectChanges();
        this.createPlaylistsDT(isEditing);
    }

    getIsSaving(id: number): boolean {
        let elem = this.savingMap.find(e => e.id == id);
        return elem ? elem.isSaving : false;
    }

    setIsSaving(id: number, isSaving: boolean) {
        let elem = this.savingMap.find(e => e.id == id);
        if (elem) elem.isSaving = isSaving;
    }

    getTags(id: number): string {
		let playlist = this.playlists.find(e => e.id == id);
		return playlist.tags.map(e => {
            let tag = this.allTags.find(t => t.id == e.tagID);
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
