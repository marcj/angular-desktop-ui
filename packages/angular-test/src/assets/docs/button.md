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

    <p>
        <dui-button textured [disabled]="disabled" [openDropdown]="dropdown1">Dropdown</dui-button>
        <dui-dropdown #dropdown1>
            <div style="padding: 5px 25px;">
                Hi there!
            </div>
        </dui-dropdown>
    </p>

    <p>
        <dui-button textured [disabled]="disabled" [openDropdown]="dropdown2">Dropdown items</dui-button>
        <dui-dropdown #dropdown2>
            <dui-dropdown-item>Flag A</dui-dropdown-item>
            <dui-dropdown-item [selected]="true">Flag B</dui-dropdown-item>
            <dui-dropdown-item>Flag C</dui-dropdown-item>
            <dui-dropdown-splitter></dui-dropdown-splitter>
            <dui-dropdown-item>Reset</dui-dropdown-item>
        </dui-dropdown>
    </p>

    <dui-checkbox [(ngModel)]="disabled">Disable all</dui-checkbox>
```


<api-doc module="components/button/button.component" component="ButtonComponent"></api-doc>
