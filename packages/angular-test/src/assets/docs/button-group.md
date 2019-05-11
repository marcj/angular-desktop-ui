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
        <dui-button square>+</dui-button>
        <dui-button square>-</dui-button>
    </dui-button-group>
</p>
```
