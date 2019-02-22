import {
    AfterViewInit, ApplicationRef, ChangeDetectorRef,
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
            <dui-icon [size]="14" name="arrows"></dui-icon>
        </div>

        <select (mousedown)="onMouseDown($event)" [ngModel]="model" (ngModelChange)="setValue($event)">
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

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @ContentChildren(OptionDirective) options?: QueryList<OptionDirective>;

    public label: string = '';
    public optionsValueMap = new Map<T, string>();

    protected changeSubscription?: Subscription;

    constructor(private cd: ChangeDetectorRef, private app: ApplicationRef) {}

    ngAfterViewInit(): void {
        if (this.options) {
            this.changeSubscription = this.options.changes.subscribe(() => this.updateMap());

            setTimeout(() => {
                this.updateMap();
            });
        }
    }

    public onMouseDown($event: MouseEvent) {
        if (this.isDisabled) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    @HostBinding('class.selected')
    get isSelected(): boolean {
        return this.model !== undefined;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setLabel();
    }

    public setValue(v: T) {
        this.model = v;
        this.modelChange.emit(this.model);
        console.log('modelChange', this.model);
        this.setLabel();
        this.app.tick();
    }

    public setLabel() {
        if (this.model !== undefined) {
            this.label = this.optionsValueMap.get(this.model) || '';
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
