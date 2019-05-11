
```javascript
//@angular
return {
    sidebarVisible: true,
    selected: 'button',
}
```

<h1>Window sidebar</h1>

```typescript
import {DuiWindowComponent} from '@marcj/angular-desktop-ui';
```


<dui-code-frame height="350">
```html
    <dui-window>
        <dui-window-header>
            Angular Desktop UI
            <dui-window-toolbar>
                <dui-button-group>
                    <dui-button textured icon="envelop"></dui-button>
                </dui-button-group>
                <dui-button-group float="sidebar">
                    <dui-button textured (click)="sidebarVisible = !sidebarVisible;"
                                icon="toggle_sidebar"></dui-button>
                </dui-button-group>
            </dui-window-toolbar>
        </dui-window-header>
        <dui-window-content [sidebarVisible]="sidebarVisible">
            <dui-window-sidebar>
                <dui-list [(ngModel)]="selected">
                    <dui-list-title>Form controls</dui-list-title>
                    <dui-list-item value="button">Button</dui-list-item>
                    <dui-list-item value="button-group">Button Group</dui-list-item>
                    <dui-list-title>Window</dui-list-title>
                    <dui-list-item value="window">Window</dui-list-item>
                    <dui-list-item value="toolbar">Toolbar</dui-list-item>
                    <dui-list-item value="sidebar">Sidebar</dui-list-item>
                    <dui-list-title>Buttons & Indicators</dui-list-title>
                    <dui-list-item value="checkbox">Checkbox</dui-list-item>
                    <dui-list-item value="radiobox">Radiobox</dui-list-item>
                    <dui-list-item value="select">Select</dui-list-item>
                </dui-list>
            </dui-window-sidebar>
            <div>
                Selected dui-list-item: {{selected}}
            </div>
        </dui-window-content>
    </dui-window>
```
</dui-code-frame>
