import {NgModule} from '@angular/core';

import {
    TableColumnDirective,
    TableHeaderDirective,
    TableCellDirective,
    TableComponent
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
        TableCellDirective,
        TableColumnDirective,
        TableHeaderDirective,
        TableComponent,
    ],
    declarations: [
        TableCellDirective,
        TableColumnDirective,
        TableHeaderDirective,
        TableComponent,
    ],
    providers: [],
})
export class DuiTableModule {
}
