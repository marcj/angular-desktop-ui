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

export class Base {

}

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input
                    *ngIf="type !== 'textarea'"
                    #input
                    [step]="step"
                    [type]="type" (focus)="cdParent.detectChanges()" (blur)="cdParent.detectChanges()"
                    [placeholder]="placeholder" (keyup)="onKeyUp($event)" (keydown)="onKeyDown($event)" [disabled]="isDisabled"
                    [(ngModel)]="innerValue"/>
            <textarea
                    #input
                    *ngIf="type === 'textarea'" (focus)="cdParent.detectChanges()" (blur)="cdParent.detectChanges()"
                    [placeholder]="placeholder" (keyup)="onKeyUp($event)" (keydown)="onKeyDown($event)" [disabled]="isDisabled"
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

    @Input() step: number = 1;

    @Input() placeholder: string = '';

    @Input() icon: string = '';

    @Input() focus: boolean | '' = false;

    @Input() lightFocus: boolean | '' = false;

    @Output() esc = new EventEmitter<KeyboardEvent>();
    @Output() enter = new EventEmitter<KeyboardEvent>();

    @ViewChild('input', {static: false}) input?: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

    @Input() textured: boolean | '' = false;

    @HostBinding('class.textured')
    get isTextured() {
        return false !== this.textured;
    }

    @HostBinding('class.focused')
    get isFocused() {
        return this.input ? document.activeElement === this.input!.nativeElement : false;
    }

    @HostBinding('class.filled')
    get isFilled() {
        return !!this.innerValue;
    }

    @Input() round: boolean | '' = false;

    @HostBinding('class.round')
    get isRound() {
        return false !== this.round;
    }

    @Input() clearer: boolean | '' = false;

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
        public readonly cd: ChangeDetectorRef,
        @SkipSelf() public readonly cdParent: ChangeDetectorRef,
    ) {
        super(injector, cd, cdParent);
    }

    public async clear() {
        this.innerValue = '';
    }

    onKeyDown(event: KeyboardEvent) {
        this.touch();
    }

    onKeyUp(event: KeyboardEvent) {
        if (event.key.toLowerCase() === 'enter') {
            this.enter.emit(event);
        }

        if (event.key.toLowerCase() === 'esc' || event.key.toLowerCase() === 'escape') {
            this.esc.emit(event);
        }
    }

    focusInput() {
        setTimeout(() => {
            this.input!.nativeElement.focus();
        });
    }

    ngAfterViewInit() {
        if (this.focus !== false && this.input) {
            setTimeout(() => {
                this.input!.nativeElement.focus();
                this.cdParent.detectChanges();
            });
        }
    }
}
