import {ApplicationRef, ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivationEnd, Event, NavigationEnd, Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public sidebarVisible = true;
    public darkMode = false;
    public showDialog = false;

    public toggleDarkMode() {
        this.darkMode = !this.darkMode;
        this.setDarkMode(this.darkMode);
    }

    public setDarkMode(active: boolean) {
        document.body.classList.remove('dark');
        document.body.classList.remove('light');

        if (active) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.add('light');
        }
    }


    constructor(
        router: Router,
        private a: ApplicationRef,
    ) {
        //necessary to render all router-outlet once the router changes
        router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd || event instanceof ActivationEnd) {
                a.tick();
            }
        });

        document.addEventListener('click', () => a.tick());
        document.addEventListener('focus', () => a.tick());
        document.addEventListener('blur', () => a.tick());
        document.addEventListener('keydown', () => a.tick());
        document.addEventListener('keyup', () => a.tick());
        document.addEventListener('keypress', () => a.tick());
        document.addEventListener('mousedown', () => a.tick());
    }
}
