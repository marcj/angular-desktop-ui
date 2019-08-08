import {
    AfterViewInit,
    ApplicationRef,
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

@Component({
    selector: 'dui-dialog-actions',
    template: '<ng-template #template><ng-content></ng-content></ng-template>'
})
export class DialogActionsComponent {
    @ViewChild('template', {static: true}) template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-dialog',
    template: `
        <ng-template #template>
            <dui-window>
                <dui-window-content>
                    <div class="content">
                        <ng-content></ng-content>
                    </div>
                </dui-window-content>

                <div class="dialog-actions" *ngIf="actions">
                    <ng-container [ngTemplateOutlet]="actions.template"></ng-container>
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

    @ContentChild(DialogActionsComponent, {static: false}) actions?: DialogActionsComponent;

    public overlayRef?: OverlayRef;

    constructor(
        protected applicationRef: ApplicationRef,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        @Optional() private window?: WindowComponent,
    ) {

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
            this.overlayRef.backdropClick().subscribe(() => {
                this.close();
            });
        }

        this.overlayRef.attach(new TemplatePortal(this.template!, this.viewContainerRef));
        this.overlayRef.updatePosition();

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
