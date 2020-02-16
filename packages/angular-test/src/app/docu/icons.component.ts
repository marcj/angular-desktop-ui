import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'icons-browser',
    template: `
        <dui-input [(ngModel)]="query" round clearer semiTransparent icon="filter" lightFocus
                   (ngModelChange)="cd.detectChanges()" placeholder="Filter ..."></dui-input>

        <div class="icons">
            <div class="icon" *ngFor="let icon of filter(icons)" >
                <dui-icon [name]="icon"></dui-icon>
                <div class="name">{{icon}}</div>
            </div>
        </div>
    `,
    styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {
    public icons?: any;

    public query = '';

    constructor(
        protected httpClient: HttpClient,
        public cd: ChangeDetectorRef
    ) {
    }

    filter(value: string[]) {
        if (!this.query) return value;

        return value.filter(v => v.indexOf(this.query) !== -1);
    }

    async ngOnInit(): Promise<any> {
        if (this.icons === undefined) {
            this.icons = await this.httpClient.get('assets/fonts/icon-names.json').toPromise();
        }

        this.cd.detectChanges();
    }
}
