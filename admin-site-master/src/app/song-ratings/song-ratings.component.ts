import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user';
import { ActivatedRoute } from '@angular/router';
import { Song } from '../song';
import { SongRating } from '../song-rating';

declare var $: any;

@Component({
    selector: 'app-song-ratings',
    templateUrl: './song-ratings.component.html',
    styleUrls: ['./song-ratings.component.css']
})
export class SongRatingsComponent implements OnInit {
    error = '';
    user = new User();
    allSongs: Song[] = [];
    songRatings: SongRating[] = [];

    constructor(private api: ApiService, 
                private route: ActivatedRoute, 
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let userID = +params.get('id');
            this.api.getUser(userID).subscribe(res => {
                    this.user = res;

                    this.api.getSongRatings(userID).subscribe(res => {
                        this.songRatings = res;
                        this.cdr.detectChanges();
                        $('#songRatings').DataTable({
                            pageLength: 25,
                        });
                    },
                    (err) => { 
                        this.error = this.api.parseError(err);
                    });
                },
                (err) => {
                    this.error = this.api.parseError(err);
                }
            );
        });

        this.api.getAllSongs().subscribe(res => {
                this.allSongs = res;
            }, 
            (err) => { 
                this.error = this.api.parseError(err);
            }
        );
    }

    getSongName(id: number): string {
        let s = this.allSongs.find(s => s.id == id);
        return s ? s.name : '';
    }
}
