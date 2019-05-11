import {Component, HostBinding, HostListener, Input} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

@Component({
    selector: 'dui-radiobox',
    template: `
        <span class="box"><div class="circle"></div></span>
        <ng-content></ng-content>
    `,
    styleUrls: ['./radiobox.component.scss'],
    providers: [ngValueAccessor(RadioboxComponent)]
})
export class RadioboxComponent<T> extends ValueAccessorBase<T> {
    @Input() value?: T;

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
        return this.value === this.innerValue;
    }

    @HostListener('click')
    public onClick() {
        if (this.isDisabled) return;

        this.innerValue = this.value;
    }
}
