import {NgModule} from '@angular/core';

import {
    DuiTableColumnDirective,
    DuiTableHeaderDirective,
    SimpleTableCellDirective,
    SimpleTableComponent
} from "./table.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";

@NgModule({
    imports: [
        CommonModule,
        DuiIconModule,
    ],
    exports: [
        SimpleTableCellDirective,
        DuiTableColumnDirective,
        DuiTableHeaderDirective,
        SimpleTableComponent,
    ],
    declarations: [
        SimpleTableCellDirective,
        DuiTableColumnDirective,
        DuiTableHeaderDirective,
        SimpleTableComponent,
    ],
    providers: [],
})
export class DuiTableModule {
}
