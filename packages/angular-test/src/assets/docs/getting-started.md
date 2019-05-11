<h1>Getting started</h1>


<p>
    The library angular-desktop-ui is available in NPM.
</p>

```bash
npm instsall @marcj/angular-desktop-ui
```

<p>
    After the installation, you need add the icon font to your angular.json
</p>

```json
  "projects": {
    "myprojectName": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "node_modules/@marcj/angular-desktop-ui/src/scss/icon.scss"
```

<p>
    Then you can import the modules of angular-desktop-ui. Make sure to import only what you need.
</p>


```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {
    DuiButtonModule,
    DuiCheckboxModule,
    DuiFormComponent,
    DuiInputModule,
    DuiRadioboxModule,
    DuiSelectModule,
    DuiWindowModule,
    DuiIconModule,
    DuiListModule,
    DuiTableModule,
} from '@marcj/angular-desktop-ui';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        DuiCheckboxModule,
        DuiButtonModule,
        DuiInputModule,
        DuiFormComponent,
        DuiRadioboxModule,
        DuiSelectModule,
        DuiWindowModule,
        DuiIconModule,
        DuiListModule,
        DuiTableModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

```
