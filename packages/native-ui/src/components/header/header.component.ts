import {AfterContentChecked, Component, ContentChild, TemplateRef, ViewChild} from "@angular/core";


@Component({
    selector: 'dui-header-actions',
    template: `
        <ng-template #templateref>
            <ng-content></ng-content>
        </ng-template>
    `
})
export class HeaderActionsComponent {
    @ViewChild('templateref') template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-header',
    template: `
        <div class="title">
            <ng-content></ng-content>
        </div>
        <div class="actions">
            <ng-container [ngTemplateOutlet]="actions.template" [ngTemplateOutletContext]="{}"></ng-container>
        </div>
    `,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterContentChecked {
    @ContentChild(HeaderActionsComponent) actions?: HeaderActionsComponent;

    ngAfterContentChecked(): void {
        if (this.actions) {
            console.log('got template?', this.actions.template);
        }
    }
}
