<h1>Checkbox</h1>

```typescript
import {DuiCheckboxModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {active: false}
```

```html
<p>
    <dui-checkbox [(ngModel)]="active">Disable all</dui-checkbox><br/>
    Active: {{active}}
</p>
<p>
    <dui-checkbox [(ngModel)]="active" disabled>Disabled</dui-checkbox><br/>
</p>
```

<api-doc module="components/checkbox/checkbox.component" component="CheckboxComponent"></api-doc>
