
<h1>Getting started</h1>


<p>
    The library angular-desktop-ui is available in NPM. Install it with its dependencies in an already existing angular project.
</p>

```bash
npm install @marcj/angular-desktop-ui @angular/cdk
```
<p>
    Next you need to include the Typescript source of this library into your <code>tsconfig.app.json</code> and <code>tsconfig.spec.json</code>,
     since this library is a Typescript only library.
</p>

```json
{
  "include": [
    "src/**/*.d.ts",
    "node_modules/@marcj/angular-desktop-ui/src/**/*.ts"
  ]
}
```

Also activate <code>allowSyntheticDefaultImports</code> in your <code>tsconfig.json</code> since this library uses some external dependencies that requires that.

```json
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}
```

<p>
    Include the scss files in your <code>angular.json</code>.
    Importing it via <code>@import "..."</code> in <code>src/style.scss</code> does not work.
</p>

```json
{
  "projects": {
    "test-dui": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/test-dui",
            "index": "src/index.html",
            "main": "src/main.ts",
            "styles": [
              "node_modules/@marcj/angular-desktop-ui/src/scss/all.scss",
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
```

<p>
    Then you can import the modules of angular-desktop-ui. Make sure to import only what you need, but you have to import at least 
    <code>DuiAppModule</code> and <code>DuiWindowModule</code>.
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
    To get better performance you should disable Zone.js. 
    This library implemented some workarounds to make most other libraries work without Zonejs, but that's not guaranteed.
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

Open now `polyfills.ts` and uncomment the import of zone.js. Make sure to provide a simple noop implementation as follows:

```typescript
// import 'zone.js/dist/zone';  // Included with Angular CLI.
(window as any)['Zone'] = {
    current: {
        get: function() {}
    }
};
```

This changes requires you to use `ChangeDetectorRef` more often to reflect async operations by the user to your application. For example:

```typescript
@Component({
    template: '<div *ngIf=loggingIn>Logging in ...</div>'
})
export class MyLoginComponent {
    public logginIn = false;
    
    constructor(protected cd: ChangeDetectorRef) {}
    
    async doLogin() {
        this.loggingIn = true;
        this.cd.detectChanges();
    
        await this.httpClient.post('/login', ...);
        
        this.loggingIn = false;
        this.cd.detectChanges();
    }
}
```

<h2>Start using the library</h2>

<p>
    Open now your <code>app.component.html</code> and create your first desktop app.
</p>

```html
<dui-window>
    <dui-window-header>
        Angular Desktop UI
        <dui-window-toolbar>
            <dui-button-group>
                <dui-button textured icon="envelop"></dui-button>
            </dui-button-group>
            <dui-button-group float="right">
                <dui-input textured icon="search" placeholder="Search" round clearer></dui-input>
            </dui-button-group>
        </dui-window-toolbar>
    </dui-window-header>
    <dui-window-content>
        <div>
            This is the window content
        </div>
    </dui-window-content>
</dui-window>
```

Please note that you need at least one and max one <code>dui-window</code> element. 
Multiple windows are currently not supported except if you use a new Electron Window instance (and thus bootstrap the whole Angular application again). 
This is currently a limitation with Angular itself not supporting multiple HTML documents. 
