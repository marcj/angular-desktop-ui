import {Component} from "@angular/core";

@Component({
    template: `
        <dui-window>
            <dui-window-header>
                Second window
            </dui-window-header>
            <dui-window-content>
                <p>I'm the second window. Nothing to see here</p>
            </dui-window-content>
            <dui-dialog #dialog>
                <dui-dialog-actions>
                    <dui-button closeDialog>Close</dui-button>
                </dui-dialog-actions>
            </dui-dialog>
        </dui-window>
    `
})
export class SecondWindowComponent {
}
