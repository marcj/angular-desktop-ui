import {NgModule} from "@angular/core";
import {HeaderActionsComponent, HeaderComponent} from "./header.component";
import {CommonModule} from "@angular/common";


@NgModule({
    declarations: [
        HeaderComponent,
        HeaderActionsComponent,
    ],
    exports: [
        HeaderComponent,
        HeaderActionsComponent,
    ],
    imports: [
        CommonModule,
    ]
})
export class DuiHeaderModule {

}
