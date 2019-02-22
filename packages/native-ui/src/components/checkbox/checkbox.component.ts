import {ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";

@Component({
    selector: 'dui-checkbox',
    template: `
        <span class="box">
            <dui-icon [size]="8" name="check"></dui-icon>
        </span>
        <ng-content></ng-content>
    `,
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
    @Input() model: boolean = false;
    @Output() modelChange = new EventEmitter<boolean>();

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @HostBinding('tabindex')
    get tabIndex() {
        return 1;
    }

    constructor(private cd: ChangeDetectorRef) {

    }

    @HostBinding('class.checked')
    get isChecked() {
        return true === this.model;
    }

    @HostListener('click')
    public onClick() {
        if (this.isDisabled) return;

        this.model = !this.model;
        this.modelChange.emit(this.model);
        this.cd.detectChanges();
    }
}
