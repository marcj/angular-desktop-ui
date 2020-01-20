import {FirstWindowComponent} from "../../app/windows/first-window.component";
import {SecondWindowComponent} from "../../app/windows/second-window.component";
import {DuiExternalWindow, ExternalWindowComponent} from "@marcj/angular-desktop-ui";
import {Component} from "@angular/core";
import {RegisterDocu} from "../../app/decorators";

@Component({
    template: '',
})
@RegisterDocu('window-manager')
export class WindowManager {
    public firstWindow?: ExternalWindowComponent;
    public secondWindow?: ExternalWindowComponent;

    constructor(
        public externalWindow: DuiExternalWindow,
    ) {
    }

    openFirstWindow() {
        if (this.firstWindow) {
            return;
        }

        const {window} = this.externalWindow.open(FirstWindowComponent, {}, {alwaysRaised: true});
        this.firstWindow = window;
        window.closed.subscribe(() => {
            this.firstWindow = undefined;
        })
    }

    openSecondWindow() {
        if (this.secondWindow) {
            return;
        }

        const {window} = this.externalWindow.open(SecondWindowComponent, {}, {alwaysRaised: true});
        this.secondWindow = window;
        window.closed.subscribe(() => {
            this.secondWindow = undefined;
        })
    }
}
