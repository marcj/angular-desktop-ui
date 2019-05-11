<h1>Checkbox</h1>

```typescript
import {DuiCheckboxModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {radioValue: 'a'}
```

```html

<dui-radiobox [(ngModel)]="radioValue" value="a">Radio A</dui-radiobox><br/>
<dui-radiobox [(ngModel)]="radioValue" value="b">Radio B</dui-radiobox><br/>
<dui-radiobox [(ngModel)]="radioValue" value="c">Radio C</dui-radiobox>
<p>
    Chosen: {{radioValue}}
</p>

<dui-radiobox [(ngModel)]="radioValue" disabled value="a">Radio A</dui-radiobox><br/>
<dui-radiobox [(ngModel)]="radioValue" disabled value="b">Radio B</dui-radiobox><br/>
<dui-radiobox [(ngModel)]="radioValue" disabled value="c">Radio C</dui-radiobox>
```

<api-doc module="components/radiobox/radiobox.component" component="RadioboxComponent"></api-doc>
