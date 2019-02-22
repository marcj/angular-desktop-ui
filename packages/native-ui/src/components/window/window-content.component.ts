import {Component, ContentChild} from "@angular/core";
import {WindowSidebarComponent} from "./window-sidebar.component";

@Component({
    selector: 'dui-window-content',
    template: `
        <div class="sidebar" *ngIf="toolbar">
            <ng-container [ngTemplateOutlet]="toolbar.template" [ngTemplateOutletContext]="{}"></ng-container>
        </div>
        
        <div class="content">
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./window-content.component.scss'],
})
export class WindowContentComponent {
    @ContentChild(WindowSidebarComponent) toolbar?: WindowSidebarComponent;
}
