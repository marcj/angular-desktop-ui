import {Component, HostBinding, HostListener, Input} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-checkbox',
    template: `
        <span class="box">
            <dui-icon [size]="8" name="check"></dui-icon>
        </span>
        <ng-content></ng-content>
    `,
    styleUrls: ['./checkbox.component.scss'],
    providers: [ngValueAccessor(CheckboxComponent)]
})
export class CheckboxComponent extends ValueAccessorBase<any> {
    @Input() disabled: boolean = false;

    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @HostBinding('tabindex')
    get tabIndex() {
        return 1;
    }

    @HostBinding('class.checked')
    get isChecked() {
        return true === this.innerValue;
    }

    @HostListener('click')
    public onClick() {
        if (this.isDisabled) return;

        this.innerValue = !this.innerValue;
    }
}
