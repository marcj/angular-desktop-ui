import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding, HostListener,
    Input,
    OnDestroy, OnInit,
    SkipSelf
} from "@angular/core";
import {WindowComponent} from "../window/window.component";
import {Subscription} from "rxjs";
import {WindowState} from "../window/window-state";
import {FormComponent} from "../form/form.component";

@Component({
    selector: 'dui-button',
    template: `
        <dui-icon *ngIf="icon" [name]="icon" [size]="iconSize"></dui-icon>
        <ng-content></ng-content>
    `,
    host: {
        '[attr.tabindex]': '1',
        '[class.icon]': '!!icon',
        '[class.small]': 'small !== false',
        '[class.active]': 'active !== false',
        '[class.highlighted]': 'highlighted !== false',
        '[class.primary]': 'primary !== false',
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
     * Whether the button is active (pressed)
     */
    @Input() active: boolean = false;

    /**
     * Whether the button has no padding.
     */
    @Input() small: boolean = false;

    /**
     * Whether the button is highlighted.
     */
    @Input() highlighted: boolean = false;

    /**
     * Whether the button is primary.
     */
    @Input() primary: boolean = false;

    /**
     * Whether the button is focused on initial loading.
     */
    @Input() focused: boolean = false;

    /**
     * Whether the button is focused on initial loading.
     */
    @Input() submitForm?: FormComponent;

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

    @HostListener('click')
    async onClick() {


        if (this.submitForm) {
            this.submitForm.submitForm();
        }
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
        '[class.with-animation]': "withAnimation",
        '[style.paddingLeft]': 'paddingLeft',
        '(transitionend)': 'transitionEnded()'
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

    // public paddingLeft = '0px';
    withAnimation = false;

    @HostBinding('class.padding-none')
    get isPaddingNone() {
        return this.padding === 'none';
    }

    protected sidebarVisibleSubscription?: Subscription;

    // @HostBinding('class.ready')
    // protected init = false;

    constructor(
        private windowState: WindowState,
        private windowComponent: WindowComponent,
        private element: ElementRef<HTMLElement>,
        @SkipSelf() public readonly cd: ChangeDetectorRef,
    ) {
    }

    public activateOneTimeAnimation() {
        this.withAnimation = true;
        this.cd.detectChanges();
    }

    public sidebarMoved() {
        this.cd.detectChanges();
    }

    ngOnDestroy(): void {
        if (this.sidebarVisibleSubscription) {
            this.sidebarVisibleSubscription.unsubscribe();
        }
    }

    transitionEnded() {
        this.withAnimation = false;
        this.cd.detectChanges();
    }

    ngAfterViewInit(): void {
        if (this.float === 'sidebar') {
            this.windowState.buttonGroupAlignedToSidebar = this;
        }
        setTimeout(() => {
            this.cd.detectChanges();
        });
    }

    get paddingLeft() {
        if (this.float === 'sidebar') {
            if (this.windowComponent.content) {
                // console.log('getPaddingLeft', this.float, this.windowComponent.content!.isSidebarVisible(),
                //     this.windowComponent.content.getSidebarWidth(), this.element.nativeElement.offsetLeft,
                // );
                if (this.windowComponent.content!.isSidebarVisible()) {
                    return Math.max(0, this.windowComponent.content.getSidebarWidth() - this.element.nativeElement.offsetLeft) + 'px';
                } else {
                    return '0px';
                }
            }
        }
    }
}


@Component({
    selector: 'dui-button-groups',
    template: `
        <ng-content></ng-content>
    `,
    host: {
        '[class.align-left]': `align === 'left'`,
        '[class.align-center]': `align === 'center'`,
        '[class.align-right]': `align === 'right'`,
    },
    styleUrls: ['./button-groups.component.scss'],
})
export class ButtonGroupsComponent {
    @Input() align: 'left' | 'center' | 'right' = 'left';
}

