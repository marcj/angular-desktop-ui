import {Injectable, TemplateRef} from "@angular/core";
import {ButtonGroupComponent} from "../button/button.component";
import {WindowHeaderComponent, WindowToolbarContainerComponent} from "./window-header.component";
import {arrayRemoveItem, each} from "@marcj/estdlib";

@Injectable()
export class WindowState {
    public buttonGroupAlignedToSidebar?: ButtonGroupComponent;
    public header?: WindowHeaderComponent;

    public toolbars: {[name: string]: TemplateRef<any>[]} = {};
    public toolbarContainers: {[name: string]: WindowToolbarContainerComponent} = {};

    public addToolbarContainer(forName: string, template: TemplateRef<any>) {
        if (!this.toolbars[forName]) {
           this.toolbars[forName] = []
        }

        this.toolbars[forName].push(template);

        console.log('addToolbarContainer', forName, this.toolbarContainers[forName]);

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
