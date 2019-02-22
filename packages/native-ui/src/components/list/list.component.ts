import {ChangeDetectorRef, Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';

@Component({
    selector: 'dui-list-title',
    template: `
        <ng-content></ng-content>`,
    styleUrls: ['./list-title.component.scss']
})
export class ListTitleComponent {
    constructor() {
    }
}


@Component({
    selector: 'dui-list',
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ['./list.component.scss']
})
export class ListComponent {
    @Input() model: any;
    @Output() modelChange = new EventEmitter<any>();

    @HostBinding('tabindex') tabIndex: number = 1;

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    constructor(private cd: ChangeDetectorRef) {
    }

    public setValue(v: any) {
        this.model = v;
        this.modelChange.emit(this.model);
        this.cd.detectChanges();
        console.log(this.model);
    }
}


@Component({
    selector: 'dui-list-item',
    template: `
        <ng-content></ng-content>
    `,
    host: {
        '[class.selected]': 'list.model === value',
    },
    styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
    @Input() value: any;

    constructor(public list: ListComponent) {
    }

    @HostListener('click')
    public onClick() {
        this.list.setValue(this.value);
    }
}
