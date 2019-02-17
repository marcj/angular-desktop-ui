import {AfterContentChecked, Component, ContentChild, HostBinding, Input, TemplateRef, ViewChild} from "@angular/core";

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
    @Input() public size: 'small' | 'medium' | 'large' = 'small';

    @ContentChild(HeaderActionsComponent) actions?: HeaderActionsComponent;

    @HostBinding('class.medium')
    get isMedium() {
        return this.size === 'medium';
    }

    @HostBinding('class.large')
    get isLarge() {
        return this.size === 'large';
    }

    /**
     * Public API for children component to send signal to increase header size.
     */
    public atLeastOneButtonIsMedium() {
        this.size = 'medium';
    }

    ngAfterContentChecked(): void {
        if (this.actions) {
            console.log('got template?', this.actions.template);
        }
    }
}
