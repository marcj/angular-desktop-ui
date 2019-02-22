import {Component, HostBinding, Input} from "@angular/core";

@Component({
    selector: 'dui-button',
    template: `
        <dui-icon *ngIf="icon" [name]="icon" [size]="iconSize"></dui-icon>
        <ng-content></ng-content>
    `,
    host: {
        '[class.icon]': '!!icon'
    },
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() icon?: string;
    @Input() iconSize?: number;

    @Input() square: boolean = false;

    @HostBinding('class.square')
    get isRound() {
        return false !== this.square;
    }
}
