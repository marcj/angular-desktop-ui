import {Component, Input, OnChanges, Optional, SimpleChanges} from "@angular/core";
import {HeaderComponent} from "../header/header.component";

@Component({
    selector: 'dui-button',
    template: `
        <ng-content></ng-content>
    `,
    styles: [`
        :host {
            vertical-align: middle;
        }
    `]
})
export class ButtonComponent {
}

@Component({
    selector: 'dui-tabbed-button',
    template: `
        <ng-content></ng-content>
        <div class="label" *ngIf="label">{{label}}</div>
    `,
    styles: [`
        :host {
            vertical-align: middle;
            position: relative;
        }
        
        .label {
            position: absolute;
            top: 100%;
            font-size: 11px;
            font-weight: 500;
        }
    `]
})
export class TabbedButtonComponent implements OnChanges {
    @Input() label?: string;

    constructor(private headerComponent: HeaderComponent) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.label) {
            this.headerComponent.atLeastOneButtonIsMedium();
        }
    }
}
