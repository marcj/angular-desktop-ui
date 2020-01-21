import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Injector,
    Input,
    NgZone,
    Output,
    SkipSelf,
    TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {TemplatePortal} from "@angular/cdk/portal";
import {
    Overlay,
    OverlayConfig,
    OverlayContainer,
    OverlayKeyboardDispatcher,
    OverlayPositionBuilder,
    OverlayRef,
    PositionStrategy,
    ScrollStrategyOptions
} from "@angular/cdk/overlay";
import {Subscription} from "rxjs";
import {Directionality} from "@angular/cdk/bidi";
import {WindowRegistry} from "../window/window-state";
import {ViewportRuler} from "@angular/cdk/scrolling";
import {Platform} from "@angular/cdk/platform";
import {focusWatcher} from "../..";


@Component({
    selector: 'dui-dropdown',
    template: `
        <ng-template #dropdownTemplate>
            <div class="dui-dropdown" tabindex="1" #dropdown>
                <!--                <div *ngIf="overlay !== false" class="dui-dropdown-arrow"></div>-->
                <div class="content" [class.overlay-scrollbar-small]="scrollbars">
                    <ng-content></ng-content>
                </div>
            </div>
        </ng-template>
    `,
    host: {
        '[class.overlay]': 'overlay !== false',
    },
    styleUrls: ['./dropdow.component.scss']
})
export class DropdownComponent {
    public isOpen = false;
    public overlayRef?: OverlayRef;
    protected lastFocusWatcher?: Subscription;

    @Input() host?: HTMLElement | ElementRef;

    @Input() allowedFocus: HTMLElement[] = [];

    /**
     * For debugging purposes.
     */
    @Input() keepOpen?: true;

    @Input() height?: number | string;

    @Input() width?: number | string;

    @Input() minWidth?: number | string;

    @Input() minHeight?: number | string;

    @Input() scrollbars: boolean = true;

    /**
     * Whether the dropdown aligns to the horizontal center.
     */
    @Input() center: boolean = false;

    /**
     * Whether is styled as overlay
     */
    @Input() overlay: boolean | '' = false;

    @Output() shown = new EventEmitter();

    @Output() hidden = new EventEmitter();

    @ViewChild('dropdownTemplate', {static: false}) dropdownTemplate!: TemplateRef<any>;
    @ViewChild('dropdown', {static: false}) dropdown!: ElementRef<HTMLElement>;

    constructor(
        protected overlay: Overlay,
        protected injector: Injector,
        protected registry: WindowRegistry,
        protected viewContainerRef: ViewContainerRef,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
    ) {
    }

    @HostListener('window:keyup', ['$event'])
    public key(event: KeyboardEvent) {
        if (this.isOpen && event.key.toLowerCase() === 'escape') {
            this.close();
        }
    }

    public toggle(target?: HTMLElement | ElementRef | MouseEvent) {
        if (this.isOpen) {
            this.close();
        } else {
            this.open(target);
        }
    }

    public open(target?: HTMLElement | ElementRef | MouseEvent) {
        if (this.lastFocusWatcher) {
            this.lastFocusWatcher.unsubscribe();
        }

        if (!target) {
            target = this.host!;
        }

        target = target instanceof ElementRef ? target.nativeElement : target;

        if (!target) {
            throw new Error('No target or host specified for dropdown');
        }
        let position: PositionStrategy | undefined;

        const document = this.registry.getCurrentViewContainerRef().element.nativeElement.ownerDocument;

        //this is necessary for multi-window environments, but doesn't work yet.
        // const overlayContainer = new OverlayContainer(document);
        // const overlayContainer = new OverlayContainer(document);
        // const overlay = new Overlay(
        //     this.injector.get(ScrollStrategyOptions),
        //     overlayContainer,
        //     this.injector.get(ComponentFactoryResolver),
        //     new OverlayPositionBuilder(this.injector.get(ViewportRuler), document, this.injector.get(Platform), overlayContainer),
        //     this.injector.get(OverlayKeyboardDispatcher),
        //     this.injector,
        //     this.injector.get(NgZone),
        //     document,
        //     this.injector.get(Directionality),
        // );
        const overlay = this.overlay;

        if (target instanceof MouseEvent) {
            position = overlay
                .position()
                .flexibleConnectedTo({x: target.pageX, y: target.pageY})
                .withFlexibleDimensions(false)
                .withViewportMargin(12)
                .withPush(true)
                .withDefaultOffsetY(this.overlay !== false ? 15 : 0)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    }
                ]);
            ;
        } else {
            position = overlay
                .position()
                .flexibleConnectedTo(target)
                .withFlexibleDimensions(false)
                .withViewportMargin(12)
                .withPush(true)
                .withDefaultOffsetY(this.overlay !== false ? 15 : 0)
                .withPositions([
                    {
                        originX: this.center ? 'center' : 'start',
                        originY: 'bottom',
                        overlayX: this.center ? 'center' : 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    }
                ]);
        }

        if (this.overlayRef) {
            this.overlayRef.updatePositionStrategy(position);
            this.overlayRef.updatePosition();
        } else {
            this.isOpen = true;
            const options: OverlayConfig = {
                minWidth: 50,
                maxWidth: 450,
                maxHeight: '90%',
                hasBackdrop: false,
                scrollStrategy: overlay.scrollStrategies.reposition(),
                positionStrategy: position
            };
            if (this.width) options.width = this.width;
            if (this.height) options.height = this.height;
            if (this.minWidth) options.minWidth = this.minWidth;
            if (this.minHeight) options.minHeight = this.minHeight;

            this.overlayRef = overlay.create(options);

            const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);

            this.overlayRef!.attach(portal);

            this.cd.detectChanges();

            this.overlayRef!.updatePosition();
            this.shown.emit();

            setTimeout(() => {
                if (this.overlayRef) {
                    this.overlayRef.updatePosition();
                }
            }, 250);

        }

        this.lastFocusWatcher = focusWatcher(this.dropdown.nativeElement, [...this.allowedFocus, target as any]).subscribe(() => {
            if (!this.keepOpen) {
                this.close();
            }
        });
    }

    public close() {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;

        if (this.overlayRef) {
            this.overlayRef.dispose();
            delete this.overlayRef;
        }

        this.cd.detectChanges();
        this.hidden.emit();
    }
}

/**
 * A directive to open the given dropdown on regular left click.
 */
@Directive({
    'selector': '[openDropdown]',
})
export class OpenDropdownDirective {
    @Input() openDropdown?: DropdownComponent;

    constructor(protected elementRef: ElementRef) {
    }

    @HostListener('click')
    onClick() {
        if (this.openDropdown) {
            this.openDropdown.toggle(this.elementRef);
        }
    }
}

/**
 * A directive to open the given dropdown upon right click / context menu.
 */
@Directive({
    'selector': '[contextDropdown]',
})
export class ContextDropdownDirective {
    @Input() contextDropdown?: DropdownComponent;

    @HostListener('mousedown', ['$event'])
    onClick($event: MouseEvent) {
        if (this.contextDropdown && $event.button === 2) {
            this.contextDropdown.close();
            $event.preventDefault();
            $event.stopPropagation();
            this.contextDropdown.open($event);
        }
    }
}

@Component({
    selector: 'dui-dropdown-splitter',
    template: `
        <div></div>
    `,
    styles: [`
        :host {
            display: block;
            padding: 4px 0;
        }

        div {
            border-top: 1px solid var(--line-color-light);
        }
    `]
})
export class DropdownSplitterComponent {
}


@Component({
    selector: 'dui-dropdown-item',
    template: `
        <dui-icon [size]="10" class="selected" *ngIf="selected" name="check"></dui-icon>
        <ng-content></ng-content>
    `,
    host: {
        '[class.selected]': 'selected !== false',
        '[class.disabled]': 'disabled !== false',
    },
    styleUrls: ['./dropdown-item.component.scss']
})
export class DropdownItemComponent {
    @Input() selected = false;

    @Input() disabled?: boolean = false;

    @Input() closeOnClick: boolean = true;

    constructor(protected dropdown: DropdownComponent) {
    }

    @HostListener('click')
    onClick() {
        if (this.closeOnClick) {
            this.dropdown.close();
        }
    }
}
