<h1>Checkbox</h1>

```typescript
import {DuiSelectModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {radioValue: 'a'}
```

```html
<dui-select [(ngModel)]="radioValue" placeholder="Please choose">
    <dui-option value="a">Option A</dui-option>
    <dui-option value="b">Option B</dui-option>
    <dui-option value="c">Option C</dui-option>
</dui-select>
<p>
    Chosen: {{radioValue}}
</p>
<dui-select [(ngModel)]="radioValue" disabled placeholder="Please choose">
    <dui-option value="a">Option A</dui-option>
    <dui-option value="b">Option B</dui-option>
    <dui-option value="c">Option C</dui-option>
</dui-select>
```

<api-doc module="components/select/selectbox.component" component="SelectboxComponent"></api-doc>
