<h1>Checkbox</h1>

```typescript
import {DuiSelectModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {
    manyItems: [...Array(255).keys()].map(x => x + 1),
    radioValue: 'a'
}
```

```html
<p>
<dui-select [(ngModel)]="radioValue" placeholder="Please choose">
    <dui-option value="a">Option A</dui-option>
    <dui-option value="b">Option B</dui-option>
    <dui-option value="c">Option C</dui-option>
</dui-select>
</p>
<dui-select [(ngModel)]="radioValue" textured placeholder="Please choose">
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
<p>
    <dui-select [(ngModel)]="radioValue">
        <dui-button textured (click)="radioValue = ''">Reset</dui-button>
        <dui-option value="a">Option A</dui-option>
        <dui-option value="b">Option B</dui-option>
        <dui-option value="c">Option C</dui-option>
    </dui-select>
</p>
<p>
    <dui-select placeholder="Many items">
        <dui-option *ngFor="let item of manyItems" [value]="item">Option #{{item}}</dui-option>
    </dui-select>
</p>
```

<api-doc module="components/select/selectbox.component" component="SelectboxComponent"></api-doc>
