import {
    ChangeDetectorRef,
    Component,
    ContentChild, ElementRef,
    HostBinding,
    Input,
    OnDestroy, OnInit, SkipSelf,
    TemplateRef,
    ViewChild
} from "@angular/core";
import {WindowState} from "./window-state";


@Component({
    selector: 'dui-window-header',
    template: `
        <div class="title">
            <ng-content></ng-content>
        </div>
        <div class="toolbar" *ngIf="windowState.toolbars['default']">
            <dui-window-toolbar-container></dui-window-toolbar-container>
        </div>
    `,
    styleUrls: ['./window-header.component.scss']
})
export class WindowHeaderComponent {
    @Input() public size: 'small' | 'medium' | 'large' = 'small';

    @HostBinding('class.with-toolbar')
    get withToolbar() {
        return this.windowState.toolbars['default'] && this.windowState.toolbars['default'].length;
    }

    @HostBinding('class.medium')
    get isMedium() {
        return this.size === 'medium';
    }

    @HostBinding('class.large')
    get isLarge() {
        return this.size === 'large';
    }

    constructor(
        public windowState: WindowState,
        protected element: ElementRef,
        @SkipSelf() public readonly cd: ChangeDetectorRef,
    ) {
        windowState.header = this;
    }

    public getHeight(): number {
        return this.element.nativeElement.clientHeight;
    }

    /**
     * Public API for children component to send signal to increase header size.
     */
    public atLeastOneButtonIsMedium() {
        this.size = 'medium';
    }
}

@Component({
    selector: 'dui-window-toolbar',
    template: `
        <ng-template #templateRef>
            <ng-content></ng-content>
        </ng-template>
    `
})
export class WindowToolbarComponent implements OnDestroy, OnInit {
    @Input() for: string = 'default';
    @ViewChild('templateRef', {static: true}) template!: TemplateRef<any>;

    constructor(protected windowState: WindowState) {
    }

    ngOnInit() {
        this.windowState.addToolbarContainer(this.for, this.template);
    }

    ngOnDestroy(): void {
        this.windowState.removeToolbarContainer(this.for, this.template);
    }
}

@Component({
    selector: 'dui-window-toolbar-container',
    template: `
        <ng-container *ngIf="windowState.toolbars[name]">
            <ng-container *ngFor="let template of windowState.toolbars[name]">
                <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{}"></ng-container>
            </ng-container>
        </ng-container>
    `,
    styles: [`
        :host {
            display: flex;
        }
    `],
})
export class WindowToolbarContainerComponent implements OnInit, OnDestroy {
    @Input() name: string = 'default';

    constructor(
        public windowState: WindowState,
        protected cd: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.windowState.toolbarContainers[this.name] = this;
    }

    public toolbarsUpdated() {
        this.cd.detectChanges();
    }

    ngOnDestroy(): void {
        delete this.windowState.toolbarContainers[this.name];
    }
}
