import {ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivationEnd, Event, NavigationEnd, Router} from "@angular/router";
import {arrayRemoveItem} from "../../../native-ui/src";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public i: number = 1;

    public radioValue: string = 'a';
    public selectBox1?: string;

    public sidebarVisible = true;
    public disabledAll = false;

    public items = [{title: 'first', i: 1, created: new Date}, {title: 'second', i: 2, created: new Date}];
    public selectedItems = [];
    public itemName: string = 'Item Name';

    public removeItem() {
        for (const item of this.selectedItems) {
            arrayRemoveItem(this.items, item);
        }
        this.selectedItems = [];
    }

    public addItem() {
        if (this.itemName) {
            this.items.push({title: this.itemName, i: this.items.length + 1, created: new Date});
            this.items = this.items.slice(0);
            this.cd.detectChanges();
        }
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
        private cd: ChangeDetectorRef,
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
