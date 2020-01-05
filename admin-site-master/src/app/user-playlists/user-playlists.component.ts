import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../playlist';
import { Tag } from '../tag';

declare var $: any;

@Component({
    selector: 'app-user-playlists',
    templateUrl: './user-playlists.component.html',
    styleUrls: ['./user-playlists.component.css']
})
export class UserPlaylistsComponent implements OnInit {
    error = '';
    user = new User();
    playlists: Playlist[] = [];
    playlistsDT: any;
    allPlaylists: Playlist[] = [];
    selectedPlaylist: Playlist;
    isAddingPlaylist = false;
    isDeletingPlaylist = false;
    success = false;
    message = '';
    isRunning = false;
    matchedRules: number[] = [];

    constructor(private api: ApiService, 
                private route: ActivatedRoute, 
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.paramMap.subscribe(
            (params) => {
                let userID = parseInt(params.get('id'), 10);
                this.api.getUser(userID).subscribe(
                    res => { this.user = res; },
                    err => { this.error = this.parseError(err); }
                );
                this.api.getUserPlaylists(userID).subscribe(
                    res => { 
                        this.playlists = res;
                        this.cdr.detectChanges();
                        this.createPlaylistsDT();
                    },
                    err => { this.error = this.parseError(err); }
                );
            }
        );

        this.api.getAllPlaylists().subscribe(
            res => { 
                this.allPlaylists = res;
                this.selectedPlaylist = res[0];
            },
            err => { this.error = this.parseError(err); }
        );
    }

    runRules() {
        this.isRunning = true;
        this.api.runPlaylistRules(this.user.id).subscribe(
            (res) => {
                this.success = res['success'];
                this.message = res['message'];
                this.matchedRules = res['matchedRules'];

                if (this.success) {
                    this.api.getUserPlaylists(this.user.id).subscribe(
                        (res) => {
                            this.playlistsDT.destroy();
                            this.playlists = res;
                            this.cdr.detectChanges();
                            this.playlistsDT = $('#playlists').DataTable({
                                pageLength: 25
                            });
                            this.isRunning = false;
                        },
                        (err) => { 
                            this.error = this.parseError(err);
                            this.isRunning = false;
                        }
                    );
                }
                else this.isRunning = false;
            },
            (err) => { 
                this.success = false; 
                this.message = this.parseError(err);
                this.isRunning = false;
            }
        );
    }

    createPlaylistsDT() {
        this.playlistsDT = $('#playlists').DataTable({
            pageLength: 25,
            columnDefs: [
                {
                    targets: [4],
                    searchable: false,
                    orderable: false
                }
            ]
        });
    }

    joinTags(tags: Tag[]) {
        return tags.map(e => e.name).join(', ');
    }

    addPlaylist() {
        if (!this.selectedPlaylist || this.selectedPlaylist.id == 0) {
            this.success = false;
            this.message = 'Please select a playlist';
            return;
        }

        this.isAddingPlaylist = true;
        this.api.addUserPlaylist(this.user.id, this.selectedPlaylist.id).subscribe(
            (res) => {
                this.success = res.success;
                this.message = res.message;

                if (this.success) {
                    this.playlistsDT.destroy();
                    this.playlists.push(this.selectedPlaylist);
                    this.cdr.detectChanges();
                    this.createPlaylistsDT();
                }

                this.isAddingPlaylist = false;
            },
            (err) => {
                this.success = false;
                this.message = this.parseError(err);
                this.isAddingPlaylist = false;
            }
        );
    }

    deletePlaylist(id: number) {
        this.isDeletingPlaylist = true;
        this.api.deleteUserPlaylist(this.user.id, id).subscribe(
            (res) => {
                this.success = res.success;
                this.message = res.message;

                if (this.success) {
                    let index = this.playlists.findIndex(e => e.id == id);
                    this.playlistsDT.destroy();
                    this.playlists.splice(index, 1);
                    this.cdr.detectChanges();
                    this.createPlaylistsDT();
                }

                this.isDeletingPlaylist = false;
            },
            (err) => {
                this.success = false;
                this.message = this.parseError(err);
                this.isDeletingPlaylist = false;
            }
        );
    }

    parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }
}
