import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnDestroy} from "@angular/core";
import {WindowComponent} from "../window/window.component";
import {Subscription} from "rxjs";

@Component({
    selector: 'dui-button',
    template: `
        <dui-icon *ngIf="icon" [name]="icon" [size]="iconSize"></dui-icon>
        <ng-content></ng-content>
    `,
    host: {
        '[class.icon]': '!!icon',
        '[class.active]': 'active'
    },
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    /**
     * The icon for this button. Either a icon name same as for dui-icon, or an image path.
     */
    @Input() icon?: string;

    /**
     * Change in the icon size. Should not be necessary usually.
     */
    @Input() iconSize?: number;

    /**
     * Whether the button is active. If it is not active all pointer events are disabled.
     */
    @Input() active: boolean = false;

    constructor(
        public element: ElementRef,
    ) {
        this.element.nativeElement.removeAttribute('tabindex');
    }

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @Input() square: boolean = false;
    @HostBinding('class.square')
    get isRound() {
        return false !== this.square;
    }

    @Input() textured: boolean = false;
    @HostBinding('class.textured')
    get isTextured() {
        return false !== this.textured;
    }
}

/**
 * Used to group buttons together.
 */
@Component({
    selector: 'dui-button-group',
    template: '<ng-content></ng-content>',
    host: {
        '[class.float-right]': "float==='right'",
    },
    styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements AfterViewInit, OnDestroy {
    /**
     * How the button should behave.
     * `sidebar` means it aligns with the sidebar. Is the sidebar open, this button-group has a left margin.
     * Is it closed, the margin is gone.
     */
    @Input() float: 'static' | 'sidebar' | 'float' | 'right' = 'static';

    @Input() padding: 'normal' | 'none' = 'normal';

    @HostBinding('class.padding-none')
    get isPaddingNone() {
        return this.padding === 'none';
    }

    protected siderbarVisibleSubscription?: Subscription;

    @HostBinding('class.ready')
    protected init = false;

    constructor(
        private windowComponent: WindowComponent,
        private element: ElementRef<HTMLElement>,
    ) {
    }

    ngOnDestroy(): void {
        if (this.siderbarVisibleSubscription) {
            this.siderbarVisibleSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.init = true;

        if (this.float === 'sidebar') {
            if (this.windowComponent.content) {
                if (this.siderbarVisibleSubscription) {
                    this.siderbarVisibleSubscription.unsubscribe();
                }

                this.siderbarVisibleSubscription = this.windowComponent.content!.sidebarVisibleChanged.subscribe(() => {
                    this.handleSidebar()
                });

                this.handleSidebar()
            }
        }
    }

    private handleSidebar() {
        if (this.windowComponent.content) {
            if (this.windowComponent.content!.isSidebarVisible()) {
                this.element.nativeElement.style.paddingLeft = (this.windowComponent.content.getSidebarWidth() - this.element.nativeElement.offsetLeft) + 'px';
            } else {
                this.element.nativeElement.style.paddingLeft = '0px';
            }
        }
    }
}
