import {NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {CloseDialogDirective, DialogActionsComponent, DialogComponent} from "./dialog.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";

export * from "./dialog.component";

@NgModule({
    declarations: [
        DialogComponent,
        DialogActionsComponent,
        CloseDialogDirective,
    ],
    exports: [
        DialogComponent,
        DialogActionsComponent,
        CloseDialogDirective,
    ],
    providers: [
    ],
    imports: [
        CommonModule,
        DuiWindowModule,
        OverlayModule,
    ]
})
export class DuiDialogModule {

}
