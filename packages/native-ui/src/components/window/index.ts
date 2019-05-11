import {NgModule} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowComponent, WindowFrameComponent} from "./window.component";
import {WindowFooterComponent} from "./window-footer.component";
import {WindowToolbarComponent, WindowHeaderComponent} from "./window-header.component";
import {CommonModule} from "@angular/common";
import {WindowSidebarComponent} from "./window-sidebar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowComponent,
        WindowFrameComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
        WindowSidebarComponent,
    ],
    exports: [
        WindowContentComponent,
        WindowComponent,
        WindowFrameComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
        WindowSidebarComponent,
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
    ]
})
export class DuiWindowModule {
}
