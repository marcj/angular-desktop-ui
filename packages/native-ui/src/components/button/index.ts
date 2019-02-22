import {NgModule} from "@angular/core";
import {ButtonComponent} from "./button.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";


@NgModule({
    declarations: [
        ButtonComponent,
    ],
    exports: [
        ButtonComponent,
    ],
    imports: [
        CommonModule,
        DuiIconModule,
    ]
})
export class DuiButtonModule {

}
