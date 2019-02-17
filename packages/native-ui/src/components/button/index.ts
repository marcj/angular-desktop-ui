import {NgModule} from "@angular/core";
import {ButtonComponent, TabbedButtonComponent} from "./button.component";
import {CommonModule} from "@angular/common";


@NgModule({
    declarations: [
        ButtonComponent,
        TabbedButtonComponent,
    ],
    exports: [
        ButtonComponent,
        TabbedButtonComponent,
    ],
    imports: [
        CommonModule,
    ]
})
export class DuiButtonModule {

}
