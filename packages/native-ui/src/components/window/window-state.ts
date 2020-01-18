import {Injectable, Input, TemplateRef} from "@angular/core";
import {ButtonGroupComponent} from "../button/button.component";
import {WindowHeaderComponent, WindowToolbarContainerComponent} from "./window-header.component";
import {arrayRemoveItem} from "@marcj/estdlib";
import {WindowComponent} from "./window.component";
import {WindowMenuState} from "./window-menu";

@Injectable()
export class WindowRegistry {
    registry = new Map<WindowComponent, {
        state: WindowState,
        menu: WindowMenuState
    }>();

    windowHistory: WindowComponent[] = [];
    activeWindow?: WindowComponent;

    register(win: WindowComponent, state: WindowState, menu: WindowMenuState) {
        this.registry.set(win, {
            state, menu
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

        reg.menu.focus();
    }

    unregister(win: WindowComponent) {
        this.registry.delete(win);
        arrayRemoveItem(this.windowHistory, win);

        if (this.windowHistory.length) {
            this.focus(this.windowHistory[this.windowHistory.length - 1]);
        }
    }
}

@Injectable()
export class WindowState {
    public buttonGroupAlignedToSidebar?: ButtonGroupComponent;
    public header?: WindowHeaderComponent;

    public toolbars: {[name: string]: TemplateRef<any>[]} = {};
    public toolbarContainers: {[name: string]: WindowToolbarContainerComponent} = {};

    closable = true;
    maximizable = true;
    minimizable = true;

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
