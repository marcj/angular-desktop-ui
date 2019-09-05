import {NgModule} from "@angular/core";
import {ButtonComponent, ButtonGroupComponent, ButtonGroupsComponent} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {
    DropdownComponent,
    DropdownItemComponent,
    DropdownSplitterComponent,
    OpenDropdownDirective
} from "./dropdown.component";

export {
    DropdownComponent,
    DropdownItemComponent,
    DropdownSplitterComponent,
    OpenDropdownDirective
} from "./dropdown.component";


@NgModule({
    declarations: [
        ButtonComponent,
        ButtonGroupComponent,
        ButtonGroupsComponent,
        DropdownComponent,
        DropdownItemComponent,
        DropdownSplitterComponent,
        OpenDropdownDirective,
    ],
    exports: [
        ButtonComponent,
        ButtonGroupComponent,
        ButtonGroupsComponent,
        DropdownComponent,
        DropdownItemComponent,
        DropdownSplitterComponent,
        OpenDropdownDirective,
    ],
    imports: [
        CommonModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
