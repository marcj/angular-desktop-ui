import {Component, Input} from "@angular/core";

@Component({
    selector: 'dui-form-row',
    template: `
        <div>{{label}}</div>
        <div>
            <ng-content></ng-content>
        </div>`,
    styleUrls: ['./form-row.component.scss']
})
export class FormRowComponent {
    @Input() label: string = 'No Label';
}

@Component({
    selector: 'dui-form',
    template: `
        <ng-content></ng-content>`,
    styleUrls: ['./form.component.scss']
})
export class FormComponent {
}
