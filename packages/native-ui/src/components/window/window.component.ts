import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
    selector: 'dui-window',
    template: '<ng-content></ng-content>',
    styleUrls: ['./window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent {
}
