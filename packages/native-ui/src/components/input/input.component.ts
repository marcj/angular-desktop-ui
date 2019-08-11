import {ChangeDetectorRef, Component, HostBinding, Injector, Input, SkipSelf} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input 
                    *ngIf="type !== 'textarea'"
                    [type]="type" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false"
                   [placeholder]="placeholder" [disabled]="isDisabled" [(ngModel)]="innerValue"/>
            <textarea
                    *ngIf="type === 'textarea'" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false"
                    [placeholder]="placeholder" [disabled]="isDisabled" [(ngModel)]="innerValue"></textarea>
        </div>
        <dui-icon *ngIf="icon" class="icon" [size]="13" [name]="icon"></dui-icon>
        <dui-icon *ngIf="hasClearer" class="clearer" [size]="14" name="clear" (click)="clear()"></dui-icon>
    `,
    styleUrls: ['./input.component.scss'],
    host: {
        '[class.is-textarea]': 'type === "textarea"'
    },
    providers: [ngValueAccessor(InputComponent)]
})
export class InputComponent extends ValueAccessorBase<any> {
    @Input() type: string = 'text';

    @Input() placeholder: string = '';

    @Input() icon: string = '';

    @Input() disabled: boolean = false;

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
}
