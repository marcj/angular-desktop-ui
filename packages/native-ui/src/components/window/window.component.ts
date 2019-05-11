import {ChangeDetectionStrategy, Component, ContentChild, Input} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";

/**
 * This is only for documentation purposes.
 */
@Component({
    selector: 'dui-window-frame',
    template: '<ng-content></ng-content>',
    styleUrls: ['./window-frame.component.scss'],
    host: {
        '[style.height]': `height ? height + 'px' : 'auto'`
    }
})
export class WindowFrameComponent {
    @Input() height: number = 350;
}

@Component({
    selector: 'dui-window',
    template: '<ng-content></ng-content>',
    styleUrls: ['./window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent  {
    @ContentChild(WindowContentComponent) public content?: WindowContentComponent;
}
