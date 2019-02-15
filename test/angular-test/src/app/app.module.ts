import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AmuCheckboxModule, AmuButtonModule, AmuHeaderModule, AmuSearchModule} from 'angular-macos-ui';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AmuCheckboxModule,
        AmuButtonModule,
        AmuHeaderModule,
        AmuSearchModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
