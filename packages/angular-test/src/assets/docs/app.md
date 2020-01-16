<h1>App</h1>

```typescript
import {DuiAppModule} from '@marcj/angular-desktop-ui';
```


<h3>duiView</h3>

```javascript
//@angular
return {
    tab: 'first',
    deep: false,
    dummy: false,
}
```

```html
<dui-checkbox [(ngModel)]="dummy">Dummy</dui-checkbox>
<dui-button (click)="tab = 'first'">First</dui-button>
<dui-checkbox [(ngModel)]="deep">First child</dui-checkbox>
<dui-button (click)="tab = 'second'">Second</dui-button>
<dui-button (click)="tab = 'third'">Third</dui-button>

<div>
    result: (tab={{tab}}, deep={{deep}})
    <view-debugger *duiView="tab === 'first'">
        <view-debugger *duiView="deep"></view-debugger>
    </view-debugger>
    <view-debugger *duiView="tab === 'second'"></view-debugger>
    <view-debugger *duiView="tab === 'third'"></view-debugger>
</div>
```
