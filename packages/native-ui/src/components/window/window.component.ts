import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Inject,
    Input, OnChanges, OnDestroy,
    Optional, SimpleChanges,
    SkipSelf
} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowRegistry, WindowState} from "./window-state";
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
    host: {
        '[class.in-dialog]': 'isInDialog()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        WindowState,
        WindowMenuState,
    ]
})
export class WindowComponent implements OnChanges, OnDestroy {
    @ContentChild(WindowContentComponent, {static: false}) public content?: WindowContentComponent;
    @ContentChild(WindowHeaderComponent, {static: false}) public header?: WindowHeaderComponent;

    @Input() closable = true;
    @Input() maximizable = true;
    @Input() minimizable = true;

    constructor(
        @Inject(DOCUMENT) document: Document,
        protected registry: WindowRegistry,
        public windowState: WindowState,
        cd: ChangeDetectorRef,
        windowMenuState: WindowMenuState,
        @SkipSelf() @Optional() protected parentWindow?: WindowComponent,
    ) {
        registry.register(this, cd, windowState, windowMenuState);

        this.registry.focus(this);

        //todo, windowMenuState.blur() when window is not focused anymore
        // we can not store this WindowComponent in a list since this list
        // is not shared across Electron windows.
    }

    ngOnDestroy() {
        this.registry.unregister(this);
    }

    public isInDialog(): boolean {
        return !!this.parentWindow;
    }

    public getParentOrSelf(): WindowComponent {
        return this.parentWindow ? this.parentWindow.getParentOrSelf() : this;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.windowState.closable = this.closable;
        this.windowState.minimizable = this.minimizable;
        this.windowState.maximizable = this.maximizable;
    }
}
