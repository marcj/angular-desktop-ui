import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ViewDebuggerComponent} from "./view-debugger.component";
import {DuiAppModule, DuiIconModule} from "@marcj/angular-desktop-ui";
import {IconsComponent} from "./icons.component";


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
        DuiAppModule,
        DuiIconModule,
    ],
    providers: [],
})
export class DocuModule {
}
