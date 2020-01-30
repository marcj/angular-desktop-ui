<h1>Indicator</h1>

```typescript
import {DuiIndicatorModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {progress: 0.5}
```

```html
<dui-indicator [step]="progress"></dui-indicator> {{progress}}<br/>
<dui-indicator [step]="0.2"></dui-indicator><br/>
<dui-indicator [step]="1"></dui-indicator><br/>
<dui-indicator [step]="0"></dui-indicator><br/>

<p>
    <dui-slider [(ngModel)]="progress"></dui-slider>
</p>
```

<api-doc module="components/indicator/indicator.component" component="IndicatorComponent"></api-doc>
