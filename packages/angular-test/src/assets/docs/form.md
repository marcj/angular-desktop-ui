```javascript
//@angular
return {disabled: false, disabledAll: false, i: 0}
```

<h1>Form</h1>

```typescript
import {DuiFormComponent} from '@marcj/angular-desktop-ui';
```

```html
<dui-form>
    <dui-form-row label="Username">
        <dui-input [disabled]="disabled" clearer></dui-input>
    </dui-form-row>

    <dui-form-row label="Name">
        <dui-input [disabled]="disabledAll" placeholder="Your full name"></dui-input>
    </dui-form-row>

    <dui-form-row label="Nope">
        <dui-input disabled placeholder="Disabled"></dui-input>
    </dui-form-row>

    <dui-form-row label="Textured">
        <dui-input [disabled]="disabledAll" textured round placeholder="and round"></dui-input>
    </dui-form-row>

    <dui-form-row label="Really?">
        <dui-checkbox [disabled]="disabledAll">Checkbox A</dui-checkbox>
    </dui-form-row>

    <dui-form-row label="Which one">
        <dui-radiobox [disabled]="disabledAll" [(model)]="radioValue" value="a">Radio A</dui-radiobox><br/>
        <dui-radiobox [disabled]="disabledAll" [(model)]="radioValue" value="b">Radio B</dui-radiobox>
        <p>
            Chosen: {{radioValue}}
        </p>
    </dui-form-row>

    <dui-form-row label="Search">
        <dui-input [disabled]="disabledAll" icon="search" round clearer style="margin-left: auto;"></dui-input>
    </dui-form-row>

    <dui-form-row label="Another one">
        <dui-select [disabled]="disabledAll" [(model)]="radioValue" placeholder="Please choose">
            <dui-option value="a">Option A</dui-option>
            <dui-option value="b">Option B</dui-option>
        </dui-select>
    </dui-form-row>

    <dui-form-row label="Empty">
        <dui-select [disabled]="disabledAll" style="width: 100px;" [(model)]="selectBox1" placeholder="Please choose">
            <dui-option value="x">Option X</dui-option>
            <dui-option value="y">Option Y</dui-option>
        </dui-select>
    </dui-form-row>

    <dui-form-row label="Textured">
        <dui-select [disabled]="disabledAll" textured [(model)]="radioValue" placeholder="Please choose">
            <dui-option value="a">Option A</dui-option>
            <dui-option value="b">Option B</dui-option>
        </dui-select>
    </dui-form-row>

    <dui-form-row label="">
        <dui-button [disabled]="disabledAll"
            (click)="i = i + 1"
        ><dui-icon name="star"></dui-icon> Button</dui-button>
        {{i}}
    </dui-form-row>

    <dui-form-row label="">
        <dui-button [disabled]="disabledAll" textured>Textured Button</dui-button>
    </dui-form-row>

    <dui-form-row label="">
        <dui-button [disabled]="disabledAll" square>Square button</dui-button>
    </dui-form-row>

    <dui-form-row label="">
        <dui-checkbox [(ngModel)]="disabledAll" [disabled]="true">Disabled</dui-checkbox>
    </dui-form-row>

    <dui-form-row label="">
        <dui-checkbox [(ngModel)]="disabledAll">Disable all</dui-checkbox>
    </dui-form-row>
</dui-form>
```
