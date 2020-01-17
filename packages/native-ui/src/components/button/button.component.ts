import {
    AfterViewInit,
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf
} from "@angular/core";
import {WindowComponent} from "../window/window.component";
import {Subscription} from "rxjs";
import {WindowState} from "../window/window-state";
import {FormComponent} from "../form/form.component";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-button',
    template: `
        <ng-content></ng-content>
        <dui-icon *ngIf="icon" [name]="icon" [size]="iconSize"></dui-icon>
    `,
    host: {
        '[attr.tabindex]': '1',
        '[class.icon]': '!!icon',
        '[class.small]': 'small !== false',
        '[class.active]': 'active !== false',
        '[class.highlighted]': 'highlighted !== false',
        '[class.primary]': 'primary !== false',
        '[class.icon-right]': 'iconRight !== false',
    },
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

    /**
     * The icon for this button. Either a icon name same as for dui-icon, or an image path.
     */
    @Input() icon?: string;

    /**
     * Change in the icon size. Should not be necessary usually.
     */
    @Input() iconSize?: number;

    @Input() iconRight?: boolean = false;

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
        @SkipSelf() public cdParent: ChangeDetectorRef,
        @Optional() public formComponent: FormComponent,
    ) {
        this.element.nativeElement.removeAttribute('tabindex');
    }

    @Input() disabled: boolean = false;

    @HostBinding('class.disabled')
    get isDisabled() {
        if (this.formComponent && this.formComponent.disabled) return true;
        if (this.submitForm && (this.submitForm.invalid || this.submitForm.disabled || this.submitForm.submitting)) {
            return true;
        }

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

    ngOnInit() {
        if (this.focused !== false) {
            setTimeout(() => {
                this.element.nativeElement.focus();
            }, 10);
        }
    }

    @HostListener('click')
    async onClick() {
        if (this.isDisabled) return;

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

@Directive({
    selector: '[duiFileChooser]',
    providers: [ngValueAccessor(FileChooserDirective)]
})
export class FileChooserDirective extends ValueAccessorBase<any> implements OnDestroy {
    @Input() duiFileMultiple?: boolean = false;
    @Input() duiFileDirectory?: boolean = false;

    // @Input() duiFileChooser?: string | string[];
    @Output() duiFileChooserChange = new EventEmitter<string | string[]>();

    protected input: HTMLInputElement;

    constructor(
        protected injector: Injector,
        public readonly cd: ChangeDetectorRef,
        @SkipSelf() public readonly cdParent: ChangeDetectorRef,
        private app: ApplicationRef,
    ) {
        super(injector, cd, cdParent);
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        this.input = input;
        this.input.addEventListener('change', (event: any) => {
            const files = event.target.files as FileList;
            if (files.length) {
                if (this.duiFileMultiple !== false) {
                    const paths: string[] = [];
                    for (let i = 0; i < files.length; i++) {
                        const file = files.item(0) as any as { path: string, name: string };
                        paths.push(file.path);
                    }
                    this.innerValue = paths;
                } else {
                    const file = files.item(0) as any as { path: string, name: string };
                    this.innerValue = file.path;
                }
                this.duiFileChooserChange.emit(this.innerValue);
                this.app.tick();
            }
        })
    }

    ngOnDestroy() {
    }

    @HostListener('click')
    onClick() {
        (this.input as any).webkitdirectory = this.duiFileDirectory !== false;
        this.input.multiple = this.duiFileMultiple !== false;
        this.input.click();
    }
}
