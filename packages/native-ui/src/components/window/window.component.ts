import {ChangeDetectionStrategy, Component, ContentChild} from "@angular/core";
import {WindowContentComponent} from "./window-content.component";

@Component({
    selector: 'dui-window',
    template: '<ng-content></ng-content>',
    styleUrls: ['./window.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WindowComponent  {
    @ContentChild(WindowContentComponent) public content?: WindowContentComponent;
}
