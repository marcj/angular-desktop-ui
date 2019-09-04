import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'dui-form-row',
    template: `
        <div>{{label}}</div>
        <div class="field">
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
        <form (submit)="$event.preventDefault();submitForm()">
            <ng-content></ng-content>
        </form>
    `,
    styleUrls: ['./form.component.scss']
})
export class FormComponent {
    @Input() submit?: ()=> Promise<boolean | void>;

    @Output() success = new EventEmitter();

    public submitting = false;

    async submitForm() {
        this.submitting = true;
        if (this.submit) {
            if (await this.submit()) {
                this.success.emit();
            }
        }
        this.submitting = false;
    }
}
