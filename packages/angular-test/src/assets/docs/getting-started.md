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
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "strict": true,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es2017",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2017",
      "es2016",
      "es2015",
      "dom"
    ]
  },
  "include": [
    "./src",
    "node_modules/@marcj/angular-desktop-ui/src/**/*.ts"
  ],
  "exclude": [
    "src/electron.ts"
  ]
}
```

<p>
    Then you can import the modules of angular-desktop-ui. Make sure to import only what you need, but you have to import at least `DuiAppModule`.
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
    DuiAppModule,
    DuiDialogModule,
    DuiSliderModule,
    DuiEmojiModule,
} from '@marcj/angular-desktop-ui';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        
        DuiAppModule.forRoot(), //<--- important#
        DuiWindowModule.forRoot(),
        
        DuiCheckboxModule,
        DuiButtonModule,
        DuiInputModule,
        DuiFormComponent,
        DuiRadioboxModule,
        DuiSelectModule,
        DuiIconModule,
        DuiListModule,
        DuiTableModule,
        DuiButtonModule,
        DuiDialogModule,
        DuiEmojiModule,
        DuiSliderModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

```

<h2>Disable Zone.js</h2>

<p>
    To get better performance you should disable Zone.js. This library implemented some workarounds to make most other libraries working without 
    Zonejs, but that's not guaranteed.
</p>

<p>
    Open `main.ts` and adjust accordingly. The important part is `ngZone: 'noop'`.
</p>

```typescript
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZone: 'noop'
})
  .catch(err => console.error(err));

```

Open `polyfills.ts` and uncomment the import of zone.js. Make sure to provide a simple noop implementation as follows:

```typescript
// import 'zone.js/dist/zone';  // Included with Angular CLI.
(window as any)['Zone'] = {
    current: {
        get: function() {}
    }
};
```
