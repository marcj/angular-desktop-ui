import {NgModule} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowComponent, WindowFrameComponent} from "./window.component";
import {WindowFooterComponent} from "./window-footer.component";
import {
    WindowToolbarComponent,
    WindowHeaderComponent,
    WindowToolbarContainerComponent
} from "./window-header.component";
import {CommonModule} from "@angular/common";
import {WindowSidebarComponent} from "./window-sidebar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {WindowMenuState} from "./window-menu";
import {DuiSplitterModule} from "../splitter";

@NgModule({
    declarations: [
        WindowContentComponent,
        WindowComponent,
        WindowFrameComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
        WindowToolbarContainerComponent,
        WindowSidebarComponent,
    ],
    exports: [
        WindowContentComponent,
        WindowComponent,
        WindowFrameComponent,
        WindowFooterComponent,
        WindowHeaderComponent,
        WindowToolbarComponent,
        WindowToolbarContainerComponent,
        WindowSidebarComponent,
    ],
    providers: [
        WindowMenuState,
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        DuiSplitterModule,
    ]
})
export class DuiWindowModule {
}
