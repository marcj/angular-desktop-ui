import {
    AfterViewInit,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter, HostBinding,
    Input,
    OnDestroy,
    Output,
    QueryList
} from "@angular/core";
import {Subscription} from "rxjs";

@Directive({
    selector: 'dui-option',
})
export class OptionDirective {
    @Input() value: any;

    constructor(public element: ElementRef) {
    }
}


@Component({
    selector: 'dui-select',
    template: `
        <div class="placeholder" *ngIf="!isSelected">{{placeholder}}</div>
        <div class="value" *ngIf="isSelected">{{getLabel()}}</div>

        <div class="knob">
            <span class="icon-arrow-down"></span>
        </div>
        
        <select [(ngModel)]="model">
            <option *ngFor="let option of options"
                    [ngValue]="option.value">{{option.element.nativeElement.innerText}}</option>
        </select>
    `,
    styleUrls: ['./selectbox.component.scss']
})
export class SelectboxComponent<T> implements AfterViewInit, OnDestroy {
    @Input() placeholder: string = '';

    @Input() model: T | undefined;
    @Output() modelChange = new EventEmitter<T>();

    @ContentChildren(OptionDirective) options: QueryList<OptionDirective>;

    public optionsValueMap = new Map<T, string>();

    protected changeSubscription?: Subscription;

    ngAfterViewInit(): void {
        this.changeSubscription = this.options.changes.subscribe(() => this.updateMap());
        this.updateMap();
    }

    @HostBinding('class.selected')
    get isSelected(): boolean {
        return this.model !== undefined;
    }

    getLabel() {
        if (this.model !== undefined) {
            return this.optionsValueMap.get(this.model);
        }

        return '';
    }

    protected updateMap() {
        this.optionsValueMap.clear();
        if (!this.options) return;

        for (const option of this.options.toArray()) {
            this.optionsValueMap.set(option.value, option.element.nativeElement.innerText);
        }
        console.log(this.optionsValueMap.entries());
        console.log(this.optionsValueMap.get(1 as any));
    }


    ngOnDestroy(): void {
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    }
}
