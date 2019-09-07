import {ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, SkipSelf} from "@angular/core";
import {FormGroup, NgControl} from "@angular/forms";

@Component({
    selector: 'dui-form-row',
    template: `
        <div>{{label}}</div>
        <div class="field">
            <ng-content></ng-content>

            <div class="error" *ngIf="ngControl && ngControl.errors && ngControl.touched">
                <div *ngFor="let kv of ngControl.errors|keyvalue">
                    <ng-container *ngIf="kv.value !== false && kv.value !== true">
                        {{kv.key ? kv.key + ': ' : ''}}{{kv.value}}
                    </ng-container>
                    <ng-container *ngIf="kv.value === false || kv.value === true">
                        {{kv.key}}
                    </ng-container>
                </div>
            </div>
        </div>`,
    styleUrls: ['./form-row.component.scss']
})
export class FormRowComponent {
    @Input() label: string = '';

    @ContentChild(NgControl, {static: false}) ngControl: NgControl;
}

@Component({
    selector: 'dui-form',
    template: `
        <form [formGroup]="formGroup" (submit)="$event.preventDefault();submitForm()">
            <ng-content></ng-content>

            <div *ngIf="errorText" class="error">{{errorText}}</div>
        </form>
    `,
    styleUrls: ['./form.component.scss']
})
export class FormComponent {
    @Input() formGroup!: FormGroup;

    @Input() submit?: () => Promise<any> | any;

    @Output() success = new EventEmitter();
    @Output() error = new EventEmitter();

    public errorText = '';
    public submitting = false;

    constructor(
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
    ) {
    }

    async submitForm() {
        if (this.formGroup.invalid) return;
        this.submitting = true;
        this.cd.detectChanges();
        this.cdParent.detectChanges();

        if (this.submit) {
            try {
                await this.submit();
                this.success.emit();
            } catch (error) {
                this.error.emit(error);

                if (error.errors && error.errors[0]) {
                    //we got a validation-like error object
                    for (const item of error.errors) {
                        const control = this.formGroup.get(item.path);
                        if (control) {
                            control.setErrors({
                                ...control.errors,
                                [item.code]: item.message,
                            });
                        }
                    }
                } else {
                    this.errorText = error.message || error;
                }
            }
        }

        this.submitting = false;
        this.cd.detectChanges();
        this.cdParent.detectChanges();
    }
}
