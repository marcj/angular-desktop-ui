import {NgModule} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowComponent} from "./window.component";
import {WindowFooterComponent} from "./window-footer.component";
import {WindowToolbarComponent, WindowHeaderComponent} from "./window-header.component";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
    ],
    exports: [
        WindowContentComponent,
        WindowComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
    ],
    imports: [
        CommonModule,
    ]
})
export class DuiWindowModule {
}
