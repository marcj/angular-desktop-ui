import {
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    Injectable,
    Input,
    OnDestroy,
    Type,
    ViewContainerRef
} from "@angular/core";
import {Overlay} from "@angular/cdk/overlay";
import {DialogComponent} from "./dialog.component";
import {isTargetChildOf} from "../../core/utils";
import {eachPair} from "@marcj/estdlib";
import {DuiDialogProgress, ProgressDialogState} from "./progress-dialog.component";


@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>

        <dui-dialog-actions>
            <dui-button [closeDialog]="false">Cancel</dui-button>
            <dui-button focus [closeDialog]="true">OK</dui-button>
        </dui-dialog-actions>
    `
})
export class DuiDialogConfirm {
    @Input() title: string = 'Confirm';
    @Input() content: string = '';

    static dialogDefaults = {
        maxWidth: '700px'
    }
}

@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>

        <dui-dialog-actions>
            <dui-button focus [closeDialog]="true">OK</dui-button>
        </dui-dialog-actions>
    `
})
export class DuiDialogAlert {
    @Input() title: string = 'Alert';
    @Input() content: string = '';

    static dialogDefaults = {
        maxWidth: '700px'
    }
}

@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>
        <div style="padding-top: 5px;">
            <dui-input (enter)="dialog.close(value)" focus [(ngModel)]="value"></dui-input>
        </div>

        <dui-dialog-actions>
            <dui-button [closeDialog]="false">Cancel</dui-button>
            <dui-button [closeDialog]="value">OK</dui-button>
        </dui-dialog-actions>
    `
})
export class DuiDialogPrompt {
    @Input() title: string = 'Alert';
    @Input() content: string = '';

    @Input() value: string = '';

    static dialogDefaults = {
        maxWidth: '700px'
    }

    constructor(public dialog: DialogComponent) {
    }
}

@Injectable()
export class DuiDialog {
    constructor(
        protected app: ApplicationRef,
        protected overlay: Overlay,
        protected resolver: ComponentFactoryResolver,
    ) {

    }

    public open(
        viewContainerRef: ViewContainerRef,
        component: Type<any>,
        inputs: { [name: string]: any } = {},
        dialogInputs: { [name: string]: any } = {},
    ): DialogComponent {
        const factoryMain = this.resolver.resolveComponentFactory(DialogComponent);
        const original = (factoryMain.create as any).bind(factoryMain);
        factoryMain.create = function (...args: any[]) {
            const comp = original(...args);

            comp.instance.visible = true;
            comp.instance.component = component;
            comp.instance.componentInputs = inputs;

            if ((component as any).dialogDefaults) {
                for (const [i, v] of eachPair((component as any).dialogDefaults)) {
                    (comp.instance as any)[i] = v;
                }
            }

            for (const [i, v] of eachPair(dialogInputs)) {
                (comp.instance as any)[i] = v;
            }

            return comp;
        };

        const comp = viewContainerRef.createComponent(factoryMain, 0, viewContainerRef.injector);

        comp.instance.show();
        comp.changeDetectorRef.detectChanges();

        comp.instance.closed.subscribe(() => {
            comp.destroy();
        });
        return comp.instance;
    }

    public async alert(viewContainerRef: ViewContainerRef, title: string, content?: string, dialodInputs: { [name: string]: any } = {}): Promise<boolean> {
        const dialog = this.open(viewContainerRef, DuiDialogAlert, {title, content}, dialodInputs);
        return dialog.toPromise();
    }

    public async confirm(viewContainerRef: ViewContainerRef, title: string, content?: string, dialodInputs: { [name: string]: any } = {}): Promise<boolean> {
        const dialog = this.open(viewContainerRef, DuiDialogConfirm, {title, content}, dialodInputs);
        return dialog.toPromise();
    }

    public async prompt(viewContainerRef: ViewContainerRef, title: string, value: string, content?: string, dialodInputs: { [name: string]: any } = {}): Promise<false | string> {
        const dialog = this.open(viewContainerRef, DuiDialogPrompt, {title, value, content}, dialodInputs);
        return dialog.toPromise();
    }

    public progress(viewContainerRef: ViewContainerRef): ProgressDialogState {
        const state$ = new ProgressDialogState;
        this.open(viewContainerRef, DuiDialogProgress, {state$});
        return state$;
    }
}

@Directive({
    selector: '[confirm]',
})
export class DuiDialogConfirmDirective implements OnDestroy {
    @Input() confirm!: string;

    ignoreNextClick = false;

    callback = async (event: MouseEvent) => {
        if (isTargetChildOf(event.target, this.element.nativeElement)) {
            if (this.ignoreNextClick) {
                this.ignoreNextClick = false;
                return;
            }

            event.stopPropagation();
            event.preventDefault();
            const a = await this.dialog.confirm(this.viewContainerRef, this.confirm);
            if (a) {
                this.ignoreNextClick = true;
                this.element.nativeElement.dispatchEvent(event);
            }
            this.cd.detectChanges();
        }
    };

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected element: ElementRef<HTMLElement>,
        protected dialog: DuiDialog,
        protected cd: ChangeDetectorRef,
    ) {
        document.body!.addEventListener('click', this.callback, true);
    }

    ngOnDestroy() {
        document.body!.removeEventListener('click', this.callback, true);
    }
}

@Directive({
    selector: '[alert]',
})
export class DuiDialogAlertDirective {
    @Input() confirm!: string;

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected element: ElementRef<HTMLElement>,
        protected dialog: DuiDialog,
        protected cd: ChangeDetectorRef,
    ) {
        let ignoreNextClick = false;
        document.body!.addEventListener('click', async (event) => {
            if (event.target === this.element.nativeElement) {
                if (ignoreNextClick) {
                    ignoreNextClick = false;
                    return;
                }

                event.stopPropagation();
                event.preventDefault();
                await this.dialog.alert(this.viewContainerRef, this.confirm);
                ignoreNextClick = true;
                this.element.nativeElement.dispatchEvent(event);
                this.cd.detectChanges();
            }
        }, true);
    }
}
