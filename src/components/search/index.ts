import {NgModule} from "@angular/core";
import {SearchComponent} from "./search.component";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        SearchComponent
    ],
    exports: [
        SearchComponent,
    ],
    imports: [
        FormsModule,
    ]
})
export class AmuSearchModule {

}
