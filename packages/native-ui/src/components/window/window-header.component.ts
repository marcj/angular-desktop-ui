import {Component, ContentChild, HostBinding, Input, TemplateRef, ViewChild} from "@angular/core";

@Component({
    selector: 'dui-window-toolbar',
    template: `
        <ng-template #templateref>
            <ng-content></ng-content>
        </ng-template>
    `
})
export class WindowToolbarComponent {
    @ViewChild('templateref') template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-window-header',
    template: `
        <div class="title">
            <ng-content></ng-content>
        </div>
        <div class="toolbar" *ngIf="toolbar">
            <ng-container [ngTemplateOutlet]="toolbar.template" [ngTemplateOutletContext]="{}"></ng-container>
        </div>
    `,
    styleUrls: ['./window-header.component.scss']
})
export class WindowHeaderComponent {
    @Input() public size: 'small' | 'medium' | 'large' = 'small';

    @ContentChild(WindowToolbarComponent) toolbar?: WindowToolbarComponent;

    @HostBinding('class.with-toolbar')
    get withToolbar() {
        return undefined !== this.toolbar;
    }

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
}
