import {NgModule} from '@angular/core';

import {
    DuiTableColumnDirective,
    DuiTableHeaderDirective,
    SimpleTableCellDirective,
    SimpleTableComponent
} from "./table.component";
import {CommonModule} from "@angular/common";
import {DuiIconModule} from "../icon";
import {DuiSplitterModule} from "../splitter";

@NgModule({
    imports: [
        CommonModule,
        DuiIconModule,
        DuiSplitterModule,
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
