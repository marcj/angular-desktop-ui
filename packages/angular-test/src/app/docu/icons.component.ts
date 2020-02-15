import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'icons-browser',
    template: `
        <div class="icons">
            <div class="icon" *ngFor="let icon of icons" >
                <dui-icon [name]="icon"></dui-icon>
                <div class="name">{{icon}}</div>
            </div>
        </div>
    `,
    styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {
    public icons?: any;

    constructor(
        protected httpClient: HttpClient,
        protected cd: ChangeDetectorRef
    ) {
    }

    async ngOnInit(): Promise<any> {
        if (this.icons === undefined) {
            this.icons = await this.httpClient.get('assets/fonts/icon-names.json').toPromise();
        }

        this.cd.detectChanges();
    }
}
