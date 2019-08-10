import {NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {CloseDialogDirective, DialogActionsComponent, DialogComponent, DialogDirective} from "./dialog.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";
import {ExternalDialogComponent} from "./external-dialog.component";

export * from "./dialog.component";

@NgModule({
    declarations: [
        DialogComponent,
        DialogDirective,
        DialogActionsComponent,
        CloseDialogDirective,
        ExternalDialogComponent,
    ],
    exports: [
        DialogDirective,
        DialogComponent,
        DialogActionsComponent,
        CloseDialogDirective,
        ExternalDialogComponent,
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
