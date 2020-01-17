import {ApplicationRef, Injectable, ModuleWithProviders, NgModule, Optional} from "@angular/core";
import {DuiWindowModule} from "../window";
import {
    MenuCheckboxDirective,
    MenuDirective,
    MenuItemDirective,
    MenuRadioDirective,
    MenuSeparatorDirective
} from "./menu.component";
import {detectChangesNextFrame, OpenExternalDirective, ZonelessChangeDetector} from "./utils";
import {ViewDirective} from "./dui-view.directive";
import {CdCounterComponent} from "./cd-counter.component";
import {DuiResponsiveDirective} from "./dui-responsive.directive";
import {CommonModule} from "@angular/common";
import {Component, HostBinding, Input} from "@angular/core";
import {Electron} from "../../core/utils";
import {ActivationEnd, NavigationEnd, Router, Event as RouterEvent} from "@angular/router";

export * from "./dui-view.directive";
export * from "./utils";

export class BaseComponent {
    @Input() disabled?: boolean;

    @HostBinding('class.disabled')
    get isDisabled() {
        return this.disabled === true;
    }
}

@Component({
    selector: 'ui-component',
    template: `
        {{name}} disabled={{isDisabled}}
    `,
    styles: [`
        :host {
            display: inline-block;
        }

        :host.disabled {
            border: 1px solid red;
        }
    `],
    host: {
        '[class.is-textarea]': 'name === "textarea"',
    }
})
export class UiComponentComponent extends BaseComponent {
    @Input() name: string = '';
}

@Injectable()
export class DuiApp {
    protected darkMode = false;
    protected platform = '';

    protected win?: any;

    constructor(
        protected app: ApplicationRef,
        @Optional() protected router?: Router
    ) {
        ZonelessChangeDetector.app = app;
        if ('undefined' !== typeof window) {
            (window as any)['DuiApp'] = this;
        }
    }

    start() {
        if (Electron.isAvailable()) {
            document.body.classList.add('electron');

            const remote = Electron.getRemote();
            this.win = remote.getCurrentWindow();

            console.log('remote', remote);

            let overwrittenDarkMode = localStorage.getItem('duiApp/darkMode');
            if (overwrittenDarkMode) {
                this.setDarkMode(JSON.parse(overwrittenDarkMode));
            } else {
                this.setDarkMode(remote.systemPreferences.isDarkMode());
            }

            this.setPlatform(remote.process.platform);

            if (this.platform === 'darwin') {
                remote.systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
                    if (localStorage.getItem('duiApp/darkMode') === null) {
                        this.setAutoDarkMode();
                        this.app.tick();
                    }
                })
            }
        }

        if ('undefined' !== typeof document) {
            document.addEventListener('click', () => detectChangesNextFrame());
            document.addEventListener('focus', () => detectChangesNextFrame());
            document.addEventListener('blur', () => detectChangesNextFrame());
            document.addEventListener('keydown', () => detectChangesNextFrame());
            document.addEventListener('keyup', () => detectChangesNextFrame());
            document.addEventListener('keypress', () => detectChangesNextFrame());
            document.addEventListener('mousedown', () => detectChangesNextFrame());
        }

        //necessary to render all router-outlet once the router changes
        if (this.router) {
            this.router.events.subscribe((event: RouterEvent) => {
                if (event instanceof NavigationEnd || event instanceof ActivationEnd) {
                    detectChangesNextFrame();
                }
            });
        }
    }

    setPlatform(platform: string) {
        this.platform = platform;
        document.body.classList.remove('platform-linux');
        document.body.classList.remove('platform-darwin');
        document.body.classList.remove('platform-win32');
        document.body.classList.add('platform-' + platform);
    }

    getPlatform(): string {
        return this.platform;
    }

    isDarkMode() {
        return this.darkMode;
    }

    setAutoDarkMode() {
        this.setDarkMode();
    }

    isDarkModeOverwritten() {
        return localStorage.getItem('duiApp/darkMode') !== null;
    }

    setGlobalDarkMode(darkMode: boolean) {
        if (Electron.isAvailable()) {
            const remote = Electron.getRemote();
            for (const win of remote.BrowserWindow.getAllWindows()) {
                win.webContents.executeJavaScript(`DuiApp.setDarkMode(${darkMode})`);
            }
        }
    }

    setDarkMode(darkMode?: boolean) {
        if (darkMode === undefined) {
            const remote = Electron.getRemote();
            this.darkMode = remote.systemPreferences.isDarkMode();
            localStorage.removeItem('duiApp/darkMode');
        } else {
            if (this.darkMode !== darkMode) {
                localStorage.setItem('duiApp/darkMode', JSON.stringify(darkMode));
            }
            this.darkMode = darkMode;
        }

        const vibrancy = this.darkMode ? 'ultra-dark' : 'window';
        console.log('setDarkMode', this.darkMode, vibrancy);
        this.win.setVibrancy(vibrancy);

        document.body.classList.remove('dark');
        document.body.classList.remove('light');
        document.body.classList.add(this.darkMode ? 'dark' : 'light');
        window.dispatchEvent(new Event('theme-changed'));
    }
}

@NgModule({
    declarations: [
        UiComponentComponent,
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        ViewDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    exports: [
        UiComponentComponent,
        MenuDirective,
        MenuSeparatorDirective,
        MenuRadioDirective,
        MenuCheckboxDirective,
        MenuItemDirective,
        OpenExternalDirective,
        ViewDirective,
        CdCounterComponent,
        DuiResponsiveDirective,
    ],
    imports: [
        CommonModule,
        DuiWindowModule,
    ]
})
export class DuiAppModule {
    constructor(app: DuiApp) {
        app.start();
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DuiAppModule,
            providers: [DuiApp]
        }
    }
}
