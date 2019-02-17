import {NgModule} from "@angular/core";
import {OptionDirective, SelectboxComponent} from "./selectbox.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

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
    ]
})
export class DuiSelectModule {

}
