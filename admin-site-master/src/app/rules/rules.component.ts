import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
    error = '';
    qaSelected = true;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            let selected = params.get('selected');

            if (!selected) return;

            switch (selected) {
                case 'questionAnswer': 
                    this.qaSelected = true;
                    break;

                case 'playlist':
                    this.qaSelected = false;
                    break;
            }
        });
    }

    onClick(qaSelected: boolean) {
        this.qaSelected = qaSelected;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { selected: (qaSelected ? 'questionAnswer' : 'playlist') }
        });
    }
}
