import {ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input} from "@angular/core";

@Component({
    selector: 'amu-checkbox',
    template: `
        <span class="box">
            <span class="icon-check"></span>
        </span>
        <ng-content></ng-content>
    `,
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
    @Input() model: boolean = false;
    @Input() modelChange = new EventEmitter<boolean>();

    constructor(private cd: ChangeDetectorRef) {

    }

    @HostBinding('class.checked')
    get isChecked() {
        return true === this.model;
    }

    @HostListener('click')
    public onClick() {
        this.model = !this.model;
        this.modelChange.emit(this.model);
        this.cd.detectChanges();
    }
}
