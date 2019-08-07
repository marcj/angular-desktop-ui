import {NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {CloseDialogDirective, DialogComponent} from "./dialog.component";

export * from "./dialog.component";

@NgModule({
    declarations: [
        DialogComponent,
        CloseDialogDirective,
    ],
    exports: [
        DialogComponent,
        CloseDialogDirective,
    ],
    providers: [
    ],
    imports: [
        DuiWindowModule,
    ]
})
export class DuiDialogModule {

}
