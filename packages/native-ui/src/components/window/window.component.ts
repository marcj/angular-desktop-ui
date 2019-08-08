import {ChangeDetectionStrategy, Component, ContentChild, Inject, Input} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowState} from "./window-state";
import {DOCUMENT} from "@angular/common";
import {WindowMenuState} from "./window-menu";
import {WindowHeaderComponent} from "./window-header.component";

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
        WindowState,
        WindowMenuState,
    ]
})
export class WindowComponent {
    @ContentChild(WindowContentComponent) public content?: WindowContentComponent;
    @ContentChild(WindowHeaderComponent) public header?: WindowHeaderComponent;

    constructor(
        @Inject(DOCUMENT) document: Document,
        windowMenuState: WindowMenuState,
    ) {
        document.addEventListener('focus', () => {
            windowMenuState.focus();
        });
        //todo, windowMenuState.blur() when window is not focused anymore
        // we can not store this WindowComponent in a list since this list
        // is not shared across Electron windows.
    }
}
