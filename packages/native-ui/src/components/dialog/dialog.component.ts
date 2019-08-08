import {
    AfterViewInit,
    ApplicationRef,
    Component, ContentChild,
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges, TemplateRef, ViewChild, ViewContainerRef
} from "@angular/core";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {TemplatePortal} from "@angular/cdk/portal";

@Component({
    selector: 'dui-dialog-actions',
    template: '<ng-template #template><ng-content></ng-content></ng-template>'
})
export class DialogActionsComponent {
    @ViewChild('template') template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-dialog',
    template: `
        <ng-template #template>
            <dui-window>
                <dui-window-header>
                    {{title}}
                </dui-window-header>
                
                <dui-window-content>
                    <div class="content">
                        <ng-content></ng-content>
                    </div>
                </dui-window-content>

                <div class="actions" *ngIf="actions">
                    <ng-container [ngTemplateOutlet]="actions.template"></ng-container>
                </div>
            </dui-window>
        </ng-template>
    `,
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterViewInit, OnDestroy, OnChanges {
    @Input() title: string = '';

    @Input() visible: boolean = true;
    @Output() visibleChange = new EventEmitter<boolean>();

    @Input() minWidth = 200;
    @Input() minHeight = 50;

    @Input() backDropCloses: boolean = true;

    @ViewChild('template') template?: TemplateRef<any>;

    @ContentChild(DialogActionsComponent) actions?: DialogActionsComponent;

    public overlayRef?: OverlayRef;

    constructor(
        protected applicationRef: ApplicationRef,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
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

        this.overlayRef = this.overlay.create({
            minWidth: this.minWidth,
            minHeight: this.minHeight,
            maxWidth: '90%',
            maxHeight: '90%',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .global().centerHorizontally().centerVertically()
        });

        if (this.backDropCloses) {
            this.overlayRef.backdropClick().subscribe(() => {
                this.close();
            });
        }

        this.overlayRef.attach(new TemplatePortal(this.template!, this.viewContainerRef));
        this.overlayRef.updatePosition();

        this.visible = true;
        this.visibleChange.emit(true);
    }

    beforeUnload() {
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
