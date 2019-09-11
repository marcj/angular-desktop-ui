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
import {ViewDirective, ViewState} from "./dui-view.directive";
import {CdCounterComponent} from "./cd-counter.component";
import {DuiResponsiveDirective} from "./dui-responsive.directive";
import {CommonModule} from "@angular/common";

export * from "./dui-view.directive";
export * from "./utils";


@NgModule({
    declarations: [
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

}
