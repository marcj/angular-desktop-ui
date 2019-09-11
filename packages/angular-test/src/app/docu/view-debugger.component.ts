import {Viewable, ViewState} from "@marcj/angular-desktop-ui";
import {Component} from "@angular/core";

@Component({
    selector: 'view-debugger',
    template: `
        id={{viewState.id}}, attached={{viewState.attached|json}}
        <dui-cd-counter></dui-cd-counter>
        <ng-content></ng-content>
    `,
    styles: [`
        :host {
            display: block;
            margin: 5px;
            padding: 5px;
            border: 1px solid silver;
            display: block !important;
        }
    `]
})
export class ViewDebuggerComponent implements Viewable {
    readonly viewState = new ViewState;
}
