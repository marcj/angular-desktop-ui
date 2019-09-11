import {NgModule} from "@angular/core";
import {
    ButtonComponent,
    ButtonGroupComponent,
    ButtonGroupsComponent,
    FileChooserDirective
} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {
    DropdownComponent,
    DropdownItemComponent,
    DropdownSplitterComponent,
    OpenDropdownDirective,
    ContextDropdownDirective,
} from "./dropdown.component";
import {FormsModule} from "@angular/forms";

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
        FileChooserDirective,
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
        FileChooserDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
