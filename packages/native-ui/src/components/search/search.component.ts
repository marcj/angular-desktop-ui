import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";

@Component({
    selector: 'dui-search',
    template: `
        <input type="text" placeholder="Suche ..." class="round" [(ngModel)]="model"/>
        <span class="icon-search"></span>
        <span class="icon-clear" (click)="clear()"></span>
    `,
    styleUrls: ['./search.component.scss']
})
export class SearchComponent {
    @Input() model?: string;
    @Output() modelChange = new EventEmitter<string>();

    @HostBinding('class.filled')
    get isFilled() {
        return !!this.model;
    }

    public async clear() {
        this.model = '';
        this.modelChange.emit(this.model);
    }
}
