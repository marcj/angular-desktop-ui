import {Component} from '@angular/core';
import {DuiApp, DuiDialog, DuiExternalWindow, ExternalWindowComponent} from "@marcj/angular-desktop-ui";
import {FirstWindowComponent} from "./windows/first-window.component";
import {SecondWindowComponent} from "./windows/second-window.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public sidebarVisible = true;

    constructor(
        public duiApp: DuiApp,
        public dialog: DuiDialog,
    ) {
        this.duiApp.setPlatform('darwin');
    }
}
