import {
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    Injectable,
    Input,
    Type,
    ViewContainerRef
} from "@angular/core";
import {Overlay} from "@angular/cdk/overlay";
import {DialogComponent} from "./dialog.component";


@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>

        <dui-dialog-actions>
            <dui-button [closeDialog]="false">Cancel</dui-button>
            <dui-button [closeDialog]="true">OK</dui-button>
        </dui-dialog-actions>
    `
})
export class DuiDialogConfirm {
    @Input() title: string = 'Confirm';
    @Input() content: string = '';
}

@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>

        <dui-dialog-actions>
            <dui-button [closeDialog]="true">OK</dui-button>
        </dui-dialog-actions>
    `
})
export class DuiDialogAlert {
    @Input() title: string = 'Alert';
    @Input() content: string = '';
}

@Component({
    template: `
        <h3>{{title || 'No title'}}</h3>
        <div *ngIf="content">{{content}}</div>
        <dui-input [(ngModel)]="value"></dui-input>

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
}

@Injectable()
export class DuiDialog {
    constructor(
        protected app: ApplicationRef,
        protected overlay: Overlay,
        protected resolver: ComponentFactoryResolver,
    ) {

    }

    public open(viewContainerRef: ViewContainerRef, instance: Type<any>, inputs: { [name: string]: any } = {}): DialogComponent {
        const factoryMain = this.resolver.resolveComponentFactory(DialogComponent);
        const original = (factoryMain.create as any).bind(factoryMain);
        factoryMain.create = function (...args: any[]) {
            const comp = original(...args);

            comp.instance.visible = true;
            comp.instance.component = instance;
            comp.instance.componentInputs = inputs;

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

    public async alert(viewContainerRef: ViewContainerRef, title: string, content?: string): Promise<boolean> {
        const dialog = this.open(viewContainerRef, DuiDialogAlert, {title, content});
        return dialog.toPromise();
    }

    public async confirm(viewContainerRef: ViewContainerRef, title: string, content?: string): Promise<boolean> {
        const dialog = this.open(viewContainerRef, DuiDialogConfirm, {title, content});
        return dialog.toPromise();
    }

    public async prompt(viewContainerRef: ViewContainerRef, title: string, value: string, content?: string): Promise<boolean> {
        const dialog = this.open(viewContainerRef, DuiDialogPrompt, {title, value, content});
        return dialog.toPromise();
    }
}

@Directive({
    selector: '[confirm]',
})
export class DuiDialogConfirmDirective {
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
                const a = await this.dialog.confirm(this.viewContainerRef, this.confirm);
                if (a) {
                    ignoreNextClick = true;
                    this.element.nativeElement.dispatchEvent(event);
                }
                this.cd.detectChanges();
            }
        }, true);
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
