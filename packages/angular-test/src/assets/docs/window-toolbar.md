<h1>Window toolbar</h1>

```typescript
import {DuiWindowModule} from '@marcj/angular-desktop-ui';
```

<dui-code-frame height="150">
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

                <dui-button-group padding="none">
                    <dui-button textured>Cool</dui-button>
                    <dui-button [active]="true" textured>Right</dui-button>
                    <dui-button textured>Yes</dui-button>
                </dui-button-group>

                <dui-button-group>
                    <dui-input style="width: 80px;" textured round placeholder="What up?"></dui-input>
                </dui-button-group>

                <dui-input textured icon="search" placeholder="Search" round clearer
                           style="margin-left: auto;"></dui-input>
            </dui-window-toolbar>
        </dui-window-header>

        <dui-window-content [sidebarVisible]="sidebarVisible">
            <dui-window-sidebar>
                Sidebar
            </dui-window-sidebar>

            Content
        </dui-window-content>
    </dui-window>
```
</dui-code-frame>

<api-doc module="components/window/window-header.component" component="WindowToolbarComponent"></api-doc>
