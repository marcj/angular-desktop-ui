import {
    ChangeDetectorRef,
    Component, Directive,
    ElementRef, EventEmitter,
    HostListener, Input, Output,
    SkipSelf, TemplateRef,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {TemplatePortal} from "@angular/cdk/portal";
import {focusWatcher} from "../../core/utils";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {Subscription} from "rxjs";

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
        <div>
            <ng-content></ng-content>
        </div>
    `,
    host: {
        '[class.selected]': 'selected !== false',
    },
    styleUrls: ['./dropdown-item.component.scss']
})
export class DropdownItemComponent {
    @Input() selected = false;
}

@Component({
    selector: 'dui-dropdown',
    template: `
        <ng-template #dropdownTemplate>
            <div class="dropdown overlay-scrollbar" tabindex="1" #dropdown>
                <ng-content></ng-content>
            </div>
        </ng-template>
    `,
    styleUrls: ['./dropdow.component.scss']
})
export class DropdownComponent {
    public isOpen = false;
    public overlayRef?: OverlayRef;
    protected lastFocusWatcher?: Subscription;

    @Input() host?: HTMLElement | ElementRef;

    @Input() allowedFocus: HTMLElement[] = [];

    @Output() shown = new EventEmitter();

    @Output() hidden = new EventEmitter();

    @ViewChild('dropdownTemplate', {static: false}) dropdownTemplate!: TemplateRef<any>;
    @ViewChild('dropdown', {static: false}) dropdown!: ElementRef<HTMLElement>;

    constructor(
        protected overlay: Overlay,
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

    @HostListener('click')
    public open(target?: HTMLElement | ElementRef) {
        if (this.isOpen) {
            this.close();
            return;
        }

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

        this.isOpen = true;
        this.overlayRef = this.overlay.create({
            minWidth: 50,
            maxWidth: 450,
            maxHeight: '90%',
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(target)
                .withFlexibleDimensions()
                .withPositions([{
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top',
                }])
        });

        this.overlayRef!.backdropClick().subscribe(() => {
            this.close();
        });

        const portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);

        this.overlayRef!.attach(portal);
        this.overlayRef!.updatePosition();

        this.cd.detectChanges();

        this.lastFocusWatcher = focusWatcher(this.dropdown.nativeElement, [...this.allowedFocus, target as any]).subscribe(() => {
            this.close();
        });

        this.overlayRef!.updatePosition();
        this.shown.emit();
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

@Directive({
    'selector': '[openDropdown]',
})
export class OpenDropdownDirective {
    @Input() openDropdown!: DropdownComponent;

    constructor(protected elementRef: ElementRef) {
    }

    @HostListener('click')
    onClick() {
        this.openDropdown.open(this.elementRef);
    }
}
