<h1>Window</h1>

```typescript
import {DuiWindowModule} from '@marcj/angular-desktop-ui';
```


<p>
    A window is built of multiple key components, you need for almost all of your desktop applications. The frame,
    header, header toolbar, content, footer.
</p>

<p>
    If you use electron, you need to make sure the electron window is rendering without borders. You do this by setting to titleBarStyle to none.
    To work correctly, this library requires you to set certain window options correctly. Following is an example:
</p>

```javascript
win = new BrowserWindow({
    center: true,
    width: 750,
    height: 750,
    vibrancy: 'window',
    transparent: true, //necessary for vibrancy fix on macos
    backgroundColor: "#80FFFFFF", //necessary for vibrancy fix on macos
    webPreferences: {
        scrollBounce: true,
        allowRunningInsecureContent: false,
        preload: __dirname + '/../../node_modules/@marcj/angular-desktop-ui/preload.js',
        nativeWindowOpen: true,
    },
    titleBarStyle: 'hidden',
    icon: path.join(assetsPath, 'icons/64x64.png')
});
```

<dui-code-frame height="150">
```html
    <dui-window>
        <dui-window-header>
            Angular Desktop UI
        </dui-window-header>
        <dui-window-content>
            <div>
                This is the window content
            </div>
        </dui-window-content>
    </dui-window>
```
</dui-code-frame>


<dui-code-frame height="150">
```html
    <dui-window>
        <dui-window-header>
            Angular Desktop UI
            <dui-window-toolbar>
                <dui-button-group>
                    <dui-button textured icon="envelop"></dui-button>
                </dui-button-group>
                <dui-input textured icon="search" placeholder="Search" round clearer style="margin-left: auto;"></dui-input>
            </dui-window-toolbar>
        </dui-window-header>
        <dui-window-content>
            <div>
                This is the window content
            </div>
        </dui-window-content>
    </dui-window>
```
</dui-code-frame>


<dui-code-frame height="150">
```html
    <dui-window>
        <dui-window-header>
            Angular Desktop UI
            <dui-window-toolbar>
                <dui-button-group>
                    <dui-button textured icon="envelop"></dui-button>
                </dui-button-group>
                <dui-input textured icon="search" placeholder="Search" round clearer style="margin-left: auto;"></dui-input>
            </dui-window-toolbar>
        </dui-window-header>
        <dui-window-content>
            <div>
                This is the window content
            </div>
        </dui-window-content>
        <dui-window-footer>
            This is the footer.
        </dui-window-footer>
    </dui-window>
```
</dui-code-frame>

<api-doc module="components/window/window.component" component="WindowComponent"></api-doc>

<api-doc module="components/window/window-content.component" component="WindowContentComponent"></api-doc>

<api-doc module="components/window/window-header.component" component="WindowHeaderComponent"></api-doc>

<api-doc module="components/window/window-header.component" component="WindowToolbarComponent"></api-doc>

<api-doc module="components/window/window-sidebar.component" component="WindowSidebarComponent"></api-doc>

<api-doc module="components/window/window-footer.component" component="WindowFooterComponent"></api-doc>
