import {NgModule} from "@angular/core";
import {OptionDirective, SelectboxComponent} from "./selectbox.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {DuiButtonModule} from "../button";

@NgModule({
    declarations: [
        SelectboxComponent,
        OptionDirective,
    ],
    exports: [
        SelectboxComponent,
        OptionDirective,
    ],
    imports: [
        FormsModule,
        CommonModule,
        DuiIconModule,
        DuiButtonModule,
    ]
})
export class DuiSelectModule {

}
