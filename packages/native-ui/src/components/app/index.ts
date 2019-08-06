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

@NgModule({
    declarations: [
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
    ],
    exports: [
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
    ],
    providers: [
    ],
    imports: [
        DuiWindowModule,
    ]
})
export class DuiAppModule {

}
