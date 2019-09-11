import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ViewDebuggerComponent} from "./view-debugger.component";
import {DuiAppModule} from "@marcj/angular-desktop-ui";


@NgModule({
    declarations: [
        ViewDebuggerComponent,
    ],
    exports: [
        ViewDebuggerComponent
    ],
    imports: [
        CommonModule,
        DuiAppModule,
    ],
    entryComponents: [
        ViewDebuggerComponent,
    ],
    providers: [],
})
export class DocuModule {
}
