import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";

@Component({
    selector: 'dui-input',
    template: `
        <div class="input-wrapper">
            <input [type]="type" (focus)="focused=true" (mousedown)="focused=true" (blur)="focused=false" 
                   [placeholder]="placeholder" [disabled]="isDisabled" [(ngModel)]="model"/>
        </div>
        <dui-icon *ngIf="icon" class="icon" [size]="13" [name]="icon"></dui-icon>
        <dui-icon *ngIf="hasClearer" class="clearer" [size]="14" name="clear" (click)="clear()"></dui-icon>
    `,
    styleUrls: ['./input.component.scss']
})
export class InputComponent {
    @Input() type: string = 'text';

    @Input() placeholder: string = '';

    @Input() icon: string = '';

    @Input() clearer: boolean = false;

    @Input() round: boolean = false;

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @HostBinding('class.focused')
    focused: boolean = false;

    @Input() model?: string;

    @Output() modelChange = new EventEmitter<string>();

    @HostBinding('class.filled')
    get isFilled() {
        return !!this.model;
    }

    @HostBinding('class.round')
    get isRound() {
        return false !== this.round;
    }

    @HostBinding('class.has-clearer')
    get hasClearer() {
        return false !== this.clearer;
    }


    @HostBinding('class.has-icon')
    get hasIcon() {
        return !!this.icon;
    }

    public async clear() {
        this.model = '';
        this.modelChange.emit(this.model);
    }
}
