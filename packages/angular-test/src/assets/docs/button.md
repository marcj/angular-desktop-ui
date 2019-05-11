<h1>Button</h1>

```typescript
import {DuiButtonModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {disabled: false}
```

```html
    <p>
        <dui-button [disabled]="disabled">Default Button</dui-button>
    </p>

    <p>
        <dui-button [active]="true" [disabled]="disabled">Active Button</dui-button>
    </p>

    <p>
        <dui-button textured [disabled]="disabled">Textured button</dui-button>
    </p>

    <p>
        <dui-button square [disabled]="disabled">Square button</dui-button><br/>
    </p>

    <p>
        <dui-button square [disabled]="disabled">+</dui-button>
    </p>

    <dui-checkbox [(ngModel)]="disabled">Disable all</dui-checkbox>
```
