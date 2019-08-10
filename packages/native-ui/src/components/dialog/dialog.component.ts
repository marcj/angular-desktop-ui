import {
    AfterViewInit,
    ApplicationRef, ChangeDetectorRef,
    Component, ContentChild,
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy, Optional,
    Output,
    SimpleChanges, TemplateRef, ViewChild, ViewContainerRef
} from "@angular/core";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";
import {WindowComponent} from "../window/window.component";

@Directive({
    'selector': '[dialogContainer]',
})
export class DialogDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Component({
    selector: 'dui-dialog',
    template: `
        <ng-template #template>
            <dui-window>
                <dui-window-content>
                    <div class="content">
                        <ng-container *ngIf="dialogDirective">
                            <ng-container [ngTemplateOutlet]="dialogDirective.template"></ng-container>
                        </ng-container>
                        <ng-container *ngIf="!dialogDirective">
                            <ng-content></ng-content>
                        </ng-container>
                    </div>
                </dui-window-content>

                <div class="dialog-actions" *ngIf="actions">
                    <ng-container [ngTemplateOutlet]="actions"></ng-container>
                </div>
            </dui-window>
        </ng-template>
    `,
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() title: string = '';

    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() minWidth: number | string = 200;
    @Input() minHeight: number | string = 50;

    @Input() maxWidth?: number | string;
    @Input() maxHeight?: number | string;

    @Input() backDropCloses: boolean = false;

    @ViewChild('template', {static: true}) template?: TemplateRef<any>;
    @ContentChild(DialogDirective, {static: true}) dialogDirective?: DialogDirective;

    actions?: TemplateRef<any> | undefined;

    public overlayRef?: OverlayRef;

    constructor(
        protected applicationRef: ApplicationRef,
        protected overlay: Overlay,
        protected viewContainerRef: ViewContainerRef,
        protected cd: ChangeDetectorRef,
        @Optional() protected window?: WindowComponent,
    ) {
    }

    public setActions(actions: TemplateRef<any> | undefined) {
        this.actions = actions;
        this.cd.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible) {
            this.show();
        } else {
            this.close();
        }
    }

    public show() {
        if (this.overlayRef) {
            return;
        }

        console.log('show dialog', this.template);
        const offsetTop = this.window && this.window.header ? this.window.header.getHeight() : 0;

        this.overlayRef = this.overlay.create({
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            maxWidth: this.maxWidth || '90%',
            maxHeight: this.maxHeight || '90%',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .global().centerHorizontally().top(offsetTop + 'px')
        });

        if (this.backDropCloses) {
            this.overlayRef!.backdropClick().subscribe(() => {
                this.close();
            });
        }

        this.overlayRef!.attach(new TemplatePortal(this.template!, this.viewContainerRef));
        this.overlayRef!.updatePosition();

        // console.log('host', this.overlayRef!.hostElement);
        // console.log('overlayElement', this.overlayRef!.overlayElement);
        // this.overlayRef!.overlayElement.style.top = offsetTop + 'px';

        this.visible = true;
        this.visibleChange.emit(true);
    }

    protected beforeUnload() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            delete this.overlayRef;
        }
    }

    ngAfterViewInit() {
    }

    public close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.beforeUnload();
        requestAnimationFrame(() => {
            this.applicationRef.tick();
        });
    }

    ngOnDestroy(): void {
        this.beforeUnload();
    }
}

@Component({
    selector: 'dui-dialog-actions',
    template: '<ng-template #template><ng-content></ng-content></ng-template>'
})
export class DialogActionsComponent implements AfterViewInit, OnDestroy {
    @ViewChild('template', {static: true}) template!: TemplateRef<any>;

    constructor(protected dialog: DialogComponent) {
    }

    ngAfterViewInit(): void {
        this.dialog.setActions(this.template);
    }

    ngOnDestroy(): void {
        if (this.dialog.actions === this.template) {
            this.dialog.setActions(undefined);
        }
    }
}


@Directive({
    selector: '[closeDialog]'
})
export class CloseDialogDirective {
    constructor(protected dialog: DialogComponent) {
    }

    @HostListener('click')
    onClick() {
        this.dialog.close();
    }
}
