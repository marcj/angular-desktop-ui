import {ModuleWithProviders, NgModule} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";
import {WindowComponent, WindowFrameComponent} from "./window.component";
import {WindowFooterComponent} from "./window-footer.component";
import {
    WindowHeaderComponent,
    WindowToolbarComponent,
    WindowToolbarContainerComponent
} from "./window-header.component";
import {CommonModule} from "@angular/common";
import {WindowSidebarComponent} from "./window-sidebar.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DuiSplitterModule} from "../splitter";
import {DuiIconModule} from "../icon";
import {WindowRegistry} from "./window-state";

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
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        DuiSplitterModule,
        DuiIconModule,
    ]
})
export class DuiWindowModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DuiWindowModule,
            providers: [WindowRegistry]
        }
    }
}
