import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ListeningDiary } from '../listening-diary';
import { User } from '../user';
import { Song } from '../song';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-listening-diary',
    templateUrl: './listening-diary.component.html',
    styleUrls: ['./listening-diary.component.css']
})
export class ListeningDiaryComponent implements OnInit {
    error = '';
    user = new User();
    allSongs: Song[] = [];
    listeningDiary: ListeningDiary[] = [];

    constructor(private api: ApiService, 
                private route: ActivatedRoute, 
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let userID = +params.get('id');
            this.api.getUser(userID).subscribe(res => {
                    this.user = res;

                    this.api.getListeningDiary(userID).subscribe(res => {
                        this.listeningDiary = res;
                        this.cdr.detectChanges();
                        $('#listeningDiary').DataTable({
                            pageLength: 25
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
