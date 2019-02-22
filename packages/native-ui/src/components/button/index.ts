import {NgModule} from "@angular/core";
import {ButtonComponent, ButtonGroupComponent} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";


@NgModule({
    declarations: [
        ButtonComponent,
        ButtonGroupComponent,
    ],
    exports: [
        ButtonComponent,
        ButtonGroupComponent,
    ],
    imports: [
        CommonModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
