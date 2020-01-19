import {ChangeDetectorRef, Injectable, TemplateRef} from "@angular/core";
import {ButtonGroupComponent} from "../button/button.component";
import {WindowHeaderComponent, WindowToolbarContainerComponent} from "./window-header.component";
import {arrayRemoveItem} from "@marcj/estdlib";
import {WindowComponent} from "./window.component";
import {WindowMenuState} from "./window-menu";
import {BehaviorSubject} from "rxjs";
import {detectChangesNextFrame} from "../app";

@Injectable()
export class WindowRegistry {
    registry = new Map<WindowComponent, {
        state: WindowState,
        menu: WindowMenuState,
        cd: ChangeDetectorRef
    }>();

    windowHistory: WindowComponent[] = [];
    activeWindow?: WindowComponent;

    /**
     * When BrowserWindow of electron is focused.
     */
    public focused = new BehaviorSubject(false);

    constructor() {
        this.focused.subscribe((v) => {
            for (const win of this.registry.values()) {
                win.state.focus.next(v);
            }
            detectChangesNextFrame();
        });
    }

    register(win: WindowComponent, cd: ChangeDetectorRef, state: WindowState, menu: WindowMenuState) {
        this.registry.set(win, {
            state, menu, cd
        });
    }

    /**
     * Finds the activeWindow and returns its most outer parent.
     */
    getOuterActiveWindow(): WindowComponent | undefined {
        if (this.activeWindow) return this.activeWindow.getParentOrSelf();
    }

    focus(win: WindowComponent) {
        const reg = this.registry.get(win);
        if (!reg) throw new Error('Window not registered');

        this.activeWindow = win;

        arrayRemoveItem(this.windowHistory, win);
        this.windowHistory.push(win);

        reg.state.focus.next(true);
        reg.menu.focus();
        detectChangesNextFrame();
    }

    blur(win: WindowComponent) {
        const reg = this.registry.get(win);
        reg.state.focus.next(false);
        detectChangesNextFrame();
    }

    unregister(win: WindowComponent) {
        const reg = this.registry.get(win);
        reg.state.focus.next(false);

        this.registry.delete(win);
        arrayRemoveItem(this.windowHistory, win);

        if (this.windowHistory.length) {
            this.focus(this.windowHistory[this.windowHistory.length - 1]);
        }
        detectChangesNextFrame();
    }
}

@Injectable()
export class WindowState {
    public buttonGroupAlignedToSidebar?: ButtonGroupComponent;
    public header?: WindowHeaderComponent;
    public focus = new BehaviorSubject<boolean>(false);

    public toolbars: { [name: string]: TemplateRef<any>[] } = {};
    public toolbarContainers: { [name: string]: WindowToolbarContainerComponent } = {};

    closable = true;
    maximizable = true;
    minimizable = true;

    constructor() {
    }

    public addToolbarContainer(forName: string, template: TemplateRef<any>) {
        if (!this.toolbars[forName]) {
            this.toolbars[forName] = []
        }

        this.toolbars[forName].push(template);

        if (this.toolbarContainers[forName]) {
            this.toolbarContainers[forName].toolbarsUpdated();
        }
    }

    public removeToolbarContainer(forName: string, template: TemplateRef<any>) {
        arrayRemoveItem(this.toolbars[forName], template);
        if (this.toolbarContainers[forName]) {
            this.toolbarContainers[forName].toolbarsUpdated();
        }
    }
}
