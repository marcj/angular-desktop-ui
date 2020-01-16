import {ApplicationRef, NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {
    MenuCheckboxDirective,
    MenuDirective,
    MenuItemDirective,
    MenuRadioDirective,
    MenuSeparatorDirective
} from "./menu.component";
import {OpenExternalDirective, ZonelessChangeDetector} from "./utils";
import {ViewDirective} from "./dui-view.directive";
import {CdCounterComponent} from "./cd-counter.component";
import {DuiResponsiveDirective} from "./dui-responsive.directive";
import {CommonModule} from "@angular/common";

export * from "./dui-view.directive";
export * from "./utils";



import {Component, HostBinding, Input} from "@angular/core";
export class BaseComponent {
    @Input() disabled?: boolean;

    @HostBinding('class.disabled')
    get isDisabled() {
        return this.disabled === true;
    }
}

@Component({
    selector: 'ui-component',
    template: `
        {{name}} disabled={{isDisabled}}
    `,
    styles: [`
        :host {
            display: inline-block;
        }

        :host.disabled {
            border: 1px solid red;
        }
    `],
    host: {
        '[class.is-textarea]': 'name === "textarea"',
    }
})
export class UiComponentComponent extends BaseComponent {
    @Input() name: string = '';
}


@NgModule({
    declarations: [
        UiComponentComponent,
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        ViewDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    exports: [
        UiComponentComponent,
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        ViewDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    providers: [],
    imports: [
        CommonModule,
        DuiWindowModule,
    ]
})
export class DuiAppModule {
    constructor(app: ApplicationRef) {
        ZonelessChangeDetector.app = app;
    }
}
