import {Component, HostBinding, Input, OnChanges, Optional, SimpleChanges} from "@angular/core";
import {WindowHeaderComponent} from "../window/window-header.component";

@Component({
    selector: 'dui-button',
    template: `
        <div class="content"><ng-content></ng-content></div>
    `,
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() square: boolean = false;

    @HostBinding('class.square')
    get isRound() {
        return false !== this.square;
    }
}
