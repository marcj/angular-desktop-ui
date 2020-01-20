import {Component} from "@angular/core";
import {DuiExternalWindow} from "@marcj/angular-desktop-ui";
import {SecondWindowComponent} from "./second-window.component";

@Component({
    template: `
        <dui-window>
            <dui-window-header>
                First window
            </dui-window-header>
            <dui-window-content>
                <p>Hi, what's up?</p>
                <dui-button (click)="openThird()">Open third window</dui-button>
                <dui-button (click)="dialog.show()">Open dialog</dui-button>
                <dui-button confirm="Yes?">Confirm</dui-button>
                <dui-select [(ngModel)]="select">
                    <dui-option value="a">A</dui-option>
                    <dui-option value="b">B</dui-option>
                    <dui-option value="c">C</dui-option>
                </dui-select>
            </dui-window-content>
            <dui-dialog #dialog>
                This is a lovely little dialog.
                <dui-dialog-actions>
                    <dui-button closeDialog>Close</dui-button>
                </dui-dialog-actions>
            </dui-dialog>
        </dui-window>
    `
})
export class FirstWindowComponent {
    public select = 'a';

    constructor(protected duiWindow: DuiExternalWindow) {
    }

    public openThird() {
        this.duiWindow.open(SecondWindowComponent, {}, {alwaysRaised: true});
    }
}
