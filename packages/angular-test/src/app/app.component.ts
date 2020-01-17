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
    }

    public toggleDarkMode() {
        console.log('toggleDarkMode');
        this.duiApp.setDarkMode(!this.duiApp.isDarkMode());
    }

    public setPlatform(platform: string) {
        this.duiApp.setPlatform(platform);
    }

    get theme() {
        if (this.duiApp.isDarkModeOverwritten()) {
            return this.duiApp.isDarkMode() ? 'dark' : 'light';
        }

        return 'auto';
    }

    set theme(theme: string) {
        if (theme === 'auto') {
            this.duiApp.setAutoDarkMode();
            return;
        }

        this.duiApp.setDarkMode(theme === 'dark');
    }
}
