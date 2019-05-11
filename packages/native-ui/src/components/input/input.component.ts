import {Component, HostBinding, Injector, Input} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input [type]="type" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false"
                   [placeholder]="placeholder" [disabled]="isDisabled" [(ngModel)]="innerValue"/>
        </div>
        <dui-icon *ngIf="icon" class="icon" [size]="13" [name]="icon"></dui-icon>
        <dui-icon *ngIf="hasClearer" class="clearer" [size]="14" name="clear" (click)="clear()"></dui-icon>
    `,
    styleUrls: ['./input.component.scss'],
    providers: [ngValueAccessor(InputComponent)]
})
export class InputComponent extends ValueAccessorBase<any> {
    @Input() type: string = 'text';

    @Input() placeholder: string = '';

    @Input() icon: string = '';

    @Input() disabled: boolean = false;

    constructor(injector: Injector) {
        super(injector);
    }

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

    public async clear() {
        this.innerValue = '';
    }
}
