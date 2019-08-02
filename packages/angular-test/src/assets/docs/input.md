<h1>Input</h1>

```typescript
import {DuiInputModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {name: 'Peter'}
```

```html
<dui-window-toolbar for="main">
    <dui-button-group>
        <dui-button textured [disabled]="name === ''" (click)="name = ''">clear</dui-button>
    </dui-button-group>
</dui-window-toolbar>

<p>
    <dui-input placeholder="Username"></dui-input>
</p>

<p>
    <dui-input [(ngModel)]="name"></dui-input>
</p>

<p>
    <dui-input clearer [(ngModel)]="name"></dui-input>
</p>

<p>
    <dui-input textured [(ngModel)]="name"></dui-input>
</p>

<p>
    <dui-input round [(ngModel)]="name"></dui-input>
</p>

<p>
    <dui-input icon="star" [(ngModel)]="name"></dui-input>
</p>

<p>
    <dui-input icon="star" round clearer [(ngModel)]="name"></dui-input>
</p>

```

<api-doc module="components/input/input.component" component="InputComponent"></api-doc>
