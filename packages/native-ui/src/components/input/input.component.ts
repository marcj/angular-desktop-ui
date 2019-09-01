import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Injector,
    Input,
    Output,
    SkipSelf,
    ViewChild
} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input
                    *ngIf="type !== 'textarea'"
                    #input
                    [type]="type" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false"
                    [placeholder]="placeholder" (keyup)="onKeyUp($event)" [disabled]="isDisabled"
                    [(ngModel)]="innerValue"/>
            <textarea
                    #input
                    *ngIf="type === 'textarea'" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false"
                    [placeholder]="placeholder" (keyup)="onKeyUp($event)" [disabled]="isDisabled"
                    [(ngModel)]="innerValue"></textarea>
        </div>
        <dui-icon *ngIf="icon" class="icon" [size]="13" [name]="icon"></dui-icon>
        <dui-icon *ngIf="hasClearer" class="clearer" [size]="14" name="clear" (click)="clear()"></dui-icon>
    `,
    styleUrls: ['./input.component.scss'],
    host: {
        '[class.is-textarea]': 'type === "textarea"',
        '[class.light-focus]': 'lightFocus !== false',
    },
    providers: [ngValueAccessor(InputComponent)]
})
export class InputComponent extends ValueAccessorBase<any> implements AfterViewInit {
    @Input() type: string = 'text';

    @Input() placeholder: string = '';

    @Input() icon: string = '';

    @Input() disabled: boolean = false;

    @Input() focus: boolean = false;

    @Input() lightFocus: boolean = false;

    @Output() esc = new EventEmitter<KeyboardEvent>();
    @Output() enter = new EventEmitter<KeyboardEvent>();

    @ViewChild('input', {static: false}) input?: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @Input() textured: boolean = false;

    @HostBinding('class.textured')
    get isTextured() {
        return false !== this.textured;
    }

    @HostBinding('class.focused')
    focused: boolean = false;

    @HostBinding('class.filled')
    get isFilled() {
        return !!this.innerValue;
    }

    @Input() round: boolean = false;

    @HostBinding('class.round')
    get isRound() {
        return false !== this.round;
    }

    @Input() clearer: boolean = false;

    @HostBinding('class.has-clearer')
    get hasClearer() {
        return false !== this.clearer;
    }

    @HostBinding('class.has-icon')
    get hasIcon() {
        return !!this.icon;
    }

    constructor(
        protected injector: Injector,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
    ) {
        super(injector, cd, cdParent);
    }

    public async clear() {
        this.innerValue = '';
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key.toLowerCase() === 'enter') {
            this.enter.emit(event);
        }

        if (event.key.toLowerCase() === 'esc' || event.key.toLowerCase() === 'escape') {
            this.esc.emit(event);
        }
    }

    ngAfterViewInit() {
        if (this.focus !== false && this.input) {
            setTimeout(() => {
                this.input!.nativeElement.focus();
                this.focused = true;
                this.cd.detectChanges();
                this.cdParent.detectChanges();
            });
        }
    }


}
