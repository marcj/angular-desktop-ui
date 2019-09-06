import {NgModule} from "@angular/core";
import {ButtonComponent, ButtonGroupComponent, ButtonGroupsComponent} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {
    DropdownComponent,
    DropdownItemComponent,
    DropdownSplitterComponent,
    OpenDropdownDirective,
    ContextDropdownDirective,
} from "./dropdown.component";

export {
    DropdownComponent,
    DropdownItemComponent,
    DropdownSplitterComponent,
    OpenDropdownDirective,
    ContextDropdownDirective,
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
        ContextDropdownDirective,
    ],
    exports: [
        ButtonComponent,
        ButtonGroupComponent,
        ButtonGroupsComponent,
        DropdownComponent,
        DropdownItemComponent,
        DropdownSplitterComponent,
        OpenDropdownDirective,
        ContextDropdownDirective,
    ],
    imports: [
        CommonModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
