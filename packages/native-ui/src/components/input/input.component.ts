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
import {detectChangesNextFrame} from "../app";
import {Buffer} from "buffer";

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input
                *ngIf="type !== 'textarea'"
                #input
                [step]="step"
                [type]="type" (focus)="onFocus()" (blur)="onBlur()"
                (change)="handleFileInput($event)"
                [placeholder]="placeholder" (keyup)="onKeyUp($event)" (keydown)="onKeyDown($event)"
                [disabled]="isDisabled"
                [ngModel]="type === 'file' ? undefined : innerValue"
                (ngModelChange)="setInnerValue($event)"
            />
            <textarea
                #input
                *ngIf="type === 'textarea'" (focus)="onFocus()" (blur)="onBlur()"
                [placeholder]="placeholder" (keyup)="onKeyUp($event)" (keydown)="onKeyDown($event)"
                [disabled]="isDisabled"
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

    /**
     * Focuses this element once created (AfterViewInit).
     */
    @Input() focus: boolean | '' = false;

    @Input() lightFocus: boolean | '' = false;

    @Output() esc = new EventEmitter<KeyboardEvent>();
    @Output() enter = new EventEmitter<KeyboardEvent>();

    @ViewChild('input', {static: false}) input?: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

    @Input() textured: boolean | '' = false;

    @Output() focusChange = new EventEmitter<boolean>();

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

    onBlur() {
        this.cdParent.detectChanges();
        this.focusChange.next(false);
    }

    onFocus() {
        this.cdParent.detectChanges();
        this.focusChange.next(true);
    }

    public async clear() {
        this.innerValue = '';
    }

    /**
     * From <input>
     */
    setInnerValue(value: any) {
        if (this.type === 'file') return;

        this.innerValue = value;
    }

    async writeValue(value?: any) {
        if (this.type === 'file' && !value && this.input) {
            //we need to manually reset the field, since writing to it via ngModel is not supported.
            this.input!.nativeElement.value = '';
        }

        super.writeValue(value);
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
                detectChangesNextFrame(this.cd);
            });
        }
    }

    public async handleFileInput(event: any) {
        const files = event.target.files;
        this.touch();

        const readFile = (file: File): Promise<Buffer | undefined> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.result) {
                        if (reader.result instanceof ArrayBuffer) {
                            resolve(Buffer.from(reader.result));
                        } else {
                            resolve();
                        }
                    }
                };
                reader.onerror = (error) => {
                    console.log('Error: ', error);
                    reject();
                };

                reader.readAsArrayBuffer(file);
            });
        };

        if (files) {
            if (files.length > 1) {
                const value = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files.item(i);
                    if (file) {
                        value.push(await readFile(file));
                    }
                }
                this.innerValue = value;
            } else if (files.length === 1) {
                this.innerValue = await readFile(files.item(0));
            }
        }
    }
}
