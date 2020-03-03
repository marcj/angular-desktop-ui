import {Component} from '@angular/core';
import {DuiApp, DuiDialog} from "@marcj/angular-desktop-ui";

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
