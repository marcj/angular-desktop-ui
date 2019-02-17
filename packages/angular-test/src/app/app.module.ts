import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {
    DuiButtonModule,
    DuiCheckboxModule,
    DuiFormComponent,
    DuiHeaderModule,
    DuiSearchModule,
    DuiRadioboxModule,
    DuiSelectModule,
} from '@marcj/angular-desktop-ui';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DuiCheckboxModule,
        DuiButtonModule,
        DuiHeaderModule,
        DuiSearchModule,
        DuiFormComponent,
        DuiRadioboxModule,
        DuiSelectModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
