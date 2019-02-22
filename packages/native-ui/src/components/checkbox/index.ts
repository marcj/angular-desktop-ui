import {NgModule} from "@angular/core";
import {CheckboxComponent} from "./checkbox.component";
import {DuiIconModule} from "../icon";

@NgModule({
    declarations: [
        CheckboxComponent
    ],
    exports: [
        CheckboxComponent
    ],
    imports: [
        DuiIconModule,
    ]
})
export class DuiCheckboxModule {

}
