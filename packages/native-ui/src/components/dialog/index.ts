import {NgModule} from "@angular/core";
import {DuiWindowModule} from "../window";
import {
    CloseDialogDirective,
    DialogActionsComponent,
    DialogComponent,
    DialogDirective,
    DialogWrapperComponent,
    DialogErrorComponent,
} from "./dialog.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";
import {ExternalDialogComponent} from "./external-dialog.component";
import {
    DuiDialog,
    DuiDialogAlert,
    DuiDialogAlertDirective,
    DuiDialogConfirm,
    DuiDialogConfirmDirective,
    DuiDialogPrompt
} from "./dialog";
import {DuiButtonModule} from "../button";
import {DuiCoreModule} from "../core";
import {DuiInputModule} from "../input";
import {FormsModule} from "@angular/forms";
import {DuiDialogProgress} from "./progress-dialog.component";

export * from "./dialog.component";
export {DuiDialog} from "./dialog";

@NgModule({
    declarations: [
        DialogComponent,
        DialogDirective,
        DialogActionsComponent,
        CloseDialogDirective,
        ExternalDialogComponent,
        DuiDialogConfirmDirective,
        DuiDialogAlertDirective,
        DuiDialogAlert,
        DuiDialogConfirm,
        DuiDialogPrompt,
        DuiDialogProgress,
        DialogWrapperComponent,
        DialogErrorComponent,
    ],
    exports: [
        DialogDirective,
        DialogComponent,
        DialogActionsComponent,
        CloseDialogDirective,
        ExternalDialogComponent,
        DuiDialogConfirmDirective,
        DuiDialogAlertDirective,
        DuiDialogAlert,
        DuiDialogConfirm,
        DuiDialogPrompt,
        DuiDialogProgress,
        DialogErrorComponent,
    ],
    entryComponents: [
        DialogComponent,
        DuiDialogAlert,
        DuiDialogConfirm,
        DuiDialogPrompt,
        DialogWrapperComponent,
    ],
    providers: [
        DuiDialog,
    ],
    imports: [
        FormsModule,
        CommonModule,
        OverlayModule,
        DuiWindowModule,
        DuiButtonModule,
        DuiCoreModule,
        DuiInputModule,
    ]
})
export class DuiDialogModule {

}
