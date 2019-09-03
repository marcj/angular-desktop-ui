import {
    AfterViewInit,
    ApplicationRef, ChangeDetectorRef,
    Component, ComponentFactoryResolver, ComponentRef, ContentChild,
    Directive,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy, Optional,
    Output,
    SimpleChanges, SkipSelf, TemplateRef, Type, ViewChild, ViewContainerRef
} from "@angular/core";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal, TemplatePortal} from "@angular/cdk/portal";
import {WindowComponent} from "../window/window.component";
import {eachPair} from "@marcj/estdlib";

@Directive({
    'selector': '[dialogContainer]',
})
export class DialogDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

@Component({
    template: `
        <dui-window>
            <dui-window-content>
                <div *ngIf="component"
                     [renderComponent]="component" [renderComponentInputs]="componentInputs">
                </div>

                <ng-container *ngIf="content" [ngTemplateOutlet]="content"></ng-container>
                
                <ng-container *ngIf="dialogDirective">
                    <ng-container [ngTemplateOutlet]="dialogDirective.template"></ng-container>
                </ng-container>

                <ng-container *ngIf="!dialogDirective">
                    <ng-content></ng-content>
                </ng-container>
            </dui-window-content>

            <div class="dialog-actions" *ngIf="actions">
                <ng-container [ngTemplateOutlet]="actions"></ng-container>
            </div>
        </dui-window>
    `,
    styleUrls: ['./dialog-wrapper.component.scss']
})
export class DialogWrapperComponent {
    @Input() dialogDirective?: DialogDirective;

    @Input() component?: Type<any>;
    @Input() componentInputs: { [name: string]: any } = {};

    actions?: TemplateRef<any> | undefined;
    content?: TemplateRef<any> | undefined;

    constructor(
        protected cd: ChangeDetectorRef,
    ){}

    public setActions(actions: TemplateRef<any> | undefined) {
        this.actions = actions;
        this.cd.detectChanges();
    }
}

@Component({
    selector: 'dui-dialog',
    template: `<ng-template #template><ng-content></ng-content></ng-template>`,
    styles: [`:host {display: none;}`]
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

    @Input() component?: Type<any>;
    @Input() componentInputs: { [name: string]: any } = {};

    @Output() closed = new EventEmitter<any>();

    @ViewChild('template', {static: true}) template?: TemplateRef<any>;
    @ContentChild(DialogDirective, {static: false}) dialogDirective?: DialogDirective;

    actions?: TemplateRef<any> | undefined;

    public overlayRef?: OverlayRef;
    protected wrapperComponentRef?: ComponentRef<DialogWrapperComponent>;

    protected dynamicComponentRef?: ComponentRef<any>;

    constructor(
        protected applicationRef: ApplicationRef,
        protected overlay: Overlay,
        protected viewContainerRef: ViewContainerRef,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
        @Optional() protected window?: WindowComponent,
    ) {
    }

    public toPromise(): Promise<any> {
        return new Promise((resolve) => {
            this.closed.subscribe((v: any) => {
                resolve(v);
            })
        })
    }

    public setActions(actions: TemplateRef<any> | undefined) {
        this.actions = actions;
        if (this.wrapperComponentRef) {
            this.wrapperComponentRef.instance.setActions(actions);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible) {
            this.show();
        } else {
            this.close(undefined);
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
            this.overlayRef!.backdropClick().subscribe(() => {
                this.close(undefined);
            });
        }

        const portal = new ComponentPortal(DialogWrapperComponent, this.viewContainerRef);

        this.wrapperComponentRef = this.overlayRef!.attach(portal);
        this.wrapperComponentRef.instance.component = this.component!;
        this.wrapperComponentRef.instance.componentInputs = this.componentInputs;
        this.wrapperComponentRef.instance.dialogDirective = this.dialogDirective!;
        this.wrapperComponentRef.instance.content = this.template!;

        if (this.actions) {
            this.wrapperComponentRef!.instance.setActions(this.actions);
        }
        this.overlayRef!.updatePosition();

        this.visible = true;
        this.visibleChange.emit(true);

        this.wrapperComponentRef!.changeDetectorRef.detectChanges();
        this.cd.detectChanges();
        this.cdParent.detectChanges();
    }

    protected beforeUnload() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            delete this.overlayRef;
        }
    }

    ngAfterViewInit() {
    }

    public close(v: any) {
        if (!this.visible) return;

        this.visible = false;
        this.visibleChange.emit(false);
        this.beforeUnload();

        this.closed.emit(v);
        requestAnimationFrame(() => {
            this.applicationRef.tick();
        });
    }

    ngOnDestroy(): void {
        if (this.dynamicComponentRef) {
            this.dynamicComponentRef.destroy();
        }

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
    @Input() closeDialog: any;

    constructor(protected dialog: DialogComponent) {
    }

    @HostListener('click')
    onClick() {
        this.dialog.close(this.closeDialog);
    }
}
