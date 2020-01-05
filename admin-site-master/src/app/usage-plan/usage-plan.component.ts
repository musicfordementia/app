import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Playlist } from '../playlist';
import { UsagePlan } from '../usage-plan';
import { User } from '../user';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-usage-plan',
    templateUrl: './usage-plan.component.html',
    styleUrls: ['./usage-plan.component.css']
})
export class UsagePlanComponent implements OnInit {
    error = '';
    user = new User();
    allPlaylists: Playlist[] = [];
    usagePlan: UsagePlan[] = [];

    constructor(private api: ApiService, 
                private route: ActivatedRoute, 
                private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            let userID = +params.get('id');
            this.api.getUser(userID).subscribe(res => {
                    this.user = res;

                    this.api.getUsagePlan(userID).subscribe(res => {
                        this.usagePlan = res;
                        this.cdr.detectChanges();
                        $('#usagePlan').DataTable({
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

        this.api.getAllPlaylists().subscribe(res => {
                this.allPlaylists = res;
            }, 
            (err) => { 
                this.error = this.api.parseError(err);
            }
        );
    }

    getPlaylistName(id: number): string {
        let p = this.allPlaylists.find(p => p.id == id);
        return p ? p.name : '';
    }
}
