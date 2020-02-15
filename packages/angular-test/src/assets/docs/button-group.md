<h1>Button group</h1>

```typescript
import {DuiButtonModule} from '@marcj/angular-desktop-ui';
```

```html
<p>
    <dui-button-group padding="none">
        <dui-button textured>Cool</dui-button>
        <dui-button textured [active]="true">Right</dui-button>
        <dui-button textured>Yes</dui-button>
    </dui-button-group>
</p>

<p>
    <dui-button-group padding="none">
        <dui-button>Cool</dui-button>
        <dui-button>Right</dui-button>
        <dui-button>Yes</dui-button>
    </dui-button-group>
</p>

<p>
    <dui-button-group>
        <dui-button>Cool</dui-button>
        <dui-button>Right</dui-button>
        <dui-button>Yes</dui-button>
    </dui-button-group>
</p>

<p>
    <dui-button-group padding="none">
        <dui-button square icon="add"></dui-button>
        <dui-button square icon="remove"></dui-button>
    </dui-button-group>
</p>
<p>
    <dui-button-group padding="none">
        <dui-button textured>Split button</dui-button>
        <dui-button textured small [iconSize]="12" icon="arrow_down" [openDropdown]="dropdown1"></dui-button>
    </dui-button-group>
    <dui-dropdown #dropdown1>
        <div style="padding: 5px 25px;">
            Hi there!
            <dui-button (click)="dropdown1.close()">Thanks!</dui-button>
        </div>
    </dui-dropdown>
</p>
```

<api-doc module="components/button/button.component" component="ButtonGroupComponent"></api-doc>
