import {NgModule} from "@angular/core";
import {FormComponent, FormRowComponent} from "./form.component";

@NgModule({
    declarations: [
        FormComponent,
        FormRowComponent,
    ],
    exports: [
        FormComponent,
        FormRowComponent,
    ]
})
export class DuiFormComponent {

}
