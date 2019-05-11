<h1>Getting started</h1>


<p>
    The library angular-desktop-ui is available in NPM.
</p>

```bash
npm install @marcj/angular-desktop-ui
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

<h2>Compiler adjustments</h2>

<p>
    Since this library comes only as Typescript source, you need to include the library in your compilation process. Do this by adjusting the tsconfig.json.
</p>

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "es2015",
    "strict": true,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "downlevelIteration": true,
    "importHelpers": true,
    "target": "es5",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  },
  "include": [
    "./src",
    "node_modules/@marcj/angular-desktop-ui/src/**/*.ts"
  ]
}
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
