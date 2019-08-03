import {
    AfterViewInit, ApplicationRef, ChangeDetectorRef,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter, HostBinding, Injector,
    Input, OnChanges,
    OnDestroy,
    Output,
    QueryList, SimpleChanges, SkipSelf
} from "@angular/core";
import {Subscription} from "rxjs";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";

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
            <dui-icon [size]="13" name="arrows"></dui-icon>
        </div>

        <select (mousedown)="onMouseDown($event)" [ngModel]="innerValue" (ngModelChange)="setValue($event)">
            <ng-container *ngIf="options">
                <option *ngFor="let option of options.toArray()"
                        [ngValue]="option.value">{{option.element.nativeElement.innerText}}</option>
            </ng-container>
        </select>
    `,
    styleUrls: ['./selectbox.component.scss'],
    providers: [ngValueAccessor(SelectboxComponent)]
})
export class SelectboxComponent<T> extends ValueAccessorBase<T> implements AfterViewInit, OnDestroy, OnChanges {
    @Input() placeholder: string = '';

    @Input() textured: boolean = false;
    @HostBinding('class.textured')
    get isTextured() {
        return false !== this.textured;
    }

    @ContentChildren(OptionDirective) options?: QueryList<OptionDirective>;

    public label: string = '';
    public optionsValueMap = new Map<T, string>();

    protected changeSubscription?: Subscription;

    constructor(
        protected injector: Injector,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
    ) {
        super(injector, cd, cdParent);
    }

    ngAfterViewInit(): void {
        if (this.options) {
            this.changeSubscription = this.options.changes.subscribe(() => this.updateMap());

            setTimeout(() => {
                this.updateMap();
            });
        }
    }

    /**
     * @hidden
     */
    public onMouseDown($event: MouseEvent) {
        if (this.isDisabled) {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    @HostBinding('class.selected')
    get isSelected(): boolean {
        return this.innerValue !== undefined;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.setLabel();
    }

    /**
     * @hidden
     */
    public setValue(v: T) {
        this.innerValue = v;
    }

    protected async onInnerValueChange(): Promise<any> {
        this.setLabel();
    }

    protected setLabel() {
        if (this.innerValue !== undefined) {
            this.label = this.optionsValueMap.get(this.innerValue) || '';
        }
    }

    protected updateMap() {
        this.optionsValueMap.clear();
        if (!this.options) return;

        for (const option of this.options.toArray()) {
            this.optionsValueMap.set(option.value, option.element.nativeElement.innerText);
        }

        this.setLabel();
        this.cd.detectChanges();
    }


    ngOnDestroy(): void {
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    }
}
