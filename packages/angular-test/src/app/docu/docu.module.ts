import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ViewDebuggerComponent} from "./view-debugger.component";
import {DuiAppModule, DuiIconModule, DuiInputModule} from "@marcj/angular-desktop-ui";
import {IconsComponent} from "./icons.component";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        ViewDebuggerComponent,
        IconsComponent
    ],
    exports: [
        ViewDebuggerComponent,
        IconsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        DuiAppModule,
        DuiIconModule,
        DuiInputModule,
    ],
    providers: [],
})
export class DocuModule {
}
