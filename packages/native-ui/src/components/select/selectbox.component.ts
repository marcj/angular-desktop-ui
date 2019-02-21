import {
    AfterViewInit, ChangeDetectorRef,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter, HostBinding,
    Input, OnChanges,
    OnDestroy,
    Output,
    QueryList, SimpleChanges
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
        <div class="value" *ngIf="isSelected">{{label}}</div>

        <div class="knob">
            <span class="icon-arrows"></span>
        </div>

        <select [(ngModel)]="model" (ngModelChange)="setLabel()">
            <option *ngFor="let option of options"
                    [ngValue]="option.value">{{option.element.nativeElement.innerText}}</option>
        </select>
    `,
    styleUrls: ['./selectbox.component.scss']
})
export class SelectboxComponent<T> implements AfterViewInit, OnDestroy, OnChanges {
    @Input() placeholder: string = '';

    @Input() model: T | undefined;
    @Output() modelChange = new EventEmitter<T>();

    @ContentChildren(OptionDirective) options: QueryList<OptionDirective>;

    public label: string = '';
    public optionsValueMap = new Map<T, string>();

    protected changeSubscription?: Subscription;

    constructor(private cd: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        this.changeSubscription = this.options.changes.subscribe(() => this.updateMap());
        setTimeout(() => {
            this.updateMap();
        });
    }

    @HostBinding('class.selected')
    get isSelected(): boolean {
        return this.model !== undefined;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setLabel();
    }

    public setLabel() {
        if (this.model !== undefined) {
            this.label = this.optionsValueMap.get(this.model);
            this.cd.detectChanges();
        }
    }

    protected updateMap() {
        this.optionsValueMap.clear();
        if (!this.options) return;

        for (const option of this.options.toArray()) {
            this.optionsValueMap.set(option.value, option.element.nativeElement.innerText);
        }

        this.setLabel();
    }


    ngOnDestroy(): void {
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    }
}
