import {NgModule} from "@angular/core";
import {ButtonComponent, ButtonGroupComponent, ButtonGroupsComponent} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {DropdownComponent} from "./dropdown.component";


@NgModule({
    declarations: [
        ButtonComponent,
        ButtonGroupComponent,
        ButtonGroupsComponent,
        DropdownComponent,
    ],
    exports: [
        ButtonComponent,
        ButtonGroupComponent,
        ButtonGroupsComponent,
        DropdownComponent,
    ],
    imports: [
        CommonModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
