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
    DuiIndicatorModule
} from '@marcj/angular-desktop-ui';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DocModule} from "./components/doc.module";
import {DocuModule} from "./docu/docu.module";
import {SecondWindowComponent} from "./windows/second-window.component";
import {FirstWindowComponent} from "./windows/first-window.component";
import {WindowManager} from "../assets/docs/window-manager";


@NgModule({
    declarations: [
        AppComponent,
        FirstWindowComponent,
        SecondWindowComponent,
        WindowManager,
    ],
    imports: [
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,

        DuiAppModule.forRoot(),
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
        DuiIndicatorModule,

        DocuModule,
        DocModule.forRoot(),
    ],
    entryComponents: [
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

DocModule.parent = AppModule;
