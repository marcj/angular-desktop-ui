import {NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {
    MenuCheckboxDirective,
    MenuDirective,
    MenuItemDirective,
    MenuRadioDirective,
    MenuSeparatorDirective
} from "./menu.component";
import {OpenExternalDirective} from "./utils";
import {HiddenDirective} from "./dui-view.directive";
import {CdCounterComponent} from "./cd-counter.component";
import {DuiResponsiveDirective} from "./dui-responsive.directive";

@NgModule({
    declarations: [
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        HiddenDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    exports: [
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        HiddenDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    providers: [
    ],
    imports: [
        DuiWindowModule,
    ]
})
export class DuiAppModule {

}
