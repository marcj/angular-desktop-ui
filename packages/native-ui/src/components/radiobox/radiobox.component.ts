import {ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";

@Component({
    selector: 'dui-radiobox',
    template: `
        <span class="box"><div class="circle"></div></span>
        <ng-content></ng-content>
    `,
    styleUrls: ['./radiobox.component.scss']
})
export class RadioboxComponent<T> {
    @Input() model?: T;
    @Output() modelChange = new EventEmitter<T>();

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
        return this.value === this.model;
    }

    @HostListener('click')
    public onClick() {
        if (this.isDisabled) return;
        this.model = this.value;
        this.modelChange.emit(this.model);
    }
}
