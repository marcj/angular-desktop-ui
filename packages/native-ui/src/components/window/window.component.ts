import {ChangeDetectionStrategy, Component, ContentChild, forwardRef, Injectable, Injector, Input} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowState} from "./window-state";

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
    providers: [
        WindowState
    ]
})
export class WindowComponent  {
    @ContentChild(WindowContentComponent) public content?: WindowContentComponent;
}
