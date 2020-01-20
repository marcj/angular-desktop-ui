<h1>Window</h1>

```typescript
import {DuiWindowModule} from '@marcj/angular-desktop-ui';
```

<p>
    DuiWindowModule provides also a simple window manager that allows you to open Electron windows via Angular directly. 
</p>

<p>
    Note: When you open a second window, the root window (where angular was initially loaded) needs to stay loaded all the time (you can hide it though).
</p>


<dui-code-frame height="150">
```html
    <dui-button (click)="openFirstWindow()">Open first window</dui-button>
    <dui-button (click)="openSecondWindow()">Open second window</dui-button>
```
</dui-code-frame>
