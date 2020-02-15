<h1>Table</h1>

```typescript
import {DuiSliderModule} from '@marcj/angular-desktop-ui';
```

```javascript
//@angular
return {
    value: 0.30,
    value2: 60,
    value3: 75,
}
```

```html
<p>
    <dui-slider [(ngModel)]="value"></dui-slider><br/>
    Value: {{value}}
</p>
<p>
    <dui-slider [min]="50" [max]="200" [(ngModel)]="value2"></dui-slider><br/>
    Value2: {{value2}}
</p>

<p>
    <dui-slider [min]="50" [steps]="25" [max]="200" [(ngModel)]="value3"></dui-slider><br/>
    Value3: {{value3}}
</p>

<p>
    <dui-slider mini></dui-slider><br/>
</p>
```
