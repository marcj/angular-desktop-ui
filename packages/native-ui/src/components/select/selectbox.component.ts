import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren, Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    SimpleChanges,
    SkipSelf, TemplateRef,
    ViewChild
} from "@angular/core";
import {Subscription} from "rxjs";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";
import {Overlay} from "@angular/cdk/overlay";
import {DropdownComponent} from "../button/dropdown.component";
import {ButtonComponent} from "../button/button.component";

/**
 * Necessary directive to get a dynamic rendered option.
 *
 * ```html
 * <dui-option>
 *     <ng-container *dynamicOption>
 *          {{item.fieldName | date}}
 *     </ng-container>
 * </dui-option>
 * ```
 */
@Directive({
    selector: '[dynamicOption]',
})
export class DynamicOptionDirective {
    constructor(
        public template: TemplateRef<any>
    ) {
    }
}

@Component({
    selector: 'dui-option',
    template: `
        <ng-content></ng-content>
    `
})
export class OptionDirective {
    @Input() value: any;
    @ContentChild(DynamicOptionDirective, {static: false}) dynamic?: DynamicOptionDirective;

    constructor(public readonly element: ElementRef) {
    }
}

@Component({
    selector: 'dui-select',
    template: `
        <ng-container *ngIf="button">
            <dui-button-group padding="none">
                <ng-content select="dui-button"></ng-content>
                <dui-button class="split-knob"
                            (click)="dropdown.open(); touch()"
                            small textured [iconSize]="12" icon="arrow_down"></dui-button>
            </dui-button-group>
        </ng-container>

        <ng-container *ngIf="!button">
            <div class="placeholder" *ngIf="!isSelected">{{placeholder}}</div>
            <div class="value">
                <ng-container *ngIf="optionsValueMap.get(innerValue) as option">
                    <ng-container *ngIf="option.dynamic" [ngTemplateOutlet]="option.dynamic.template"></ng-container>
                    <div *ngIf="!option.dynamic">
                        <div [innerHTML]="option.element.nativeElement.innerHTML"></div>
                    </div>
                </ng-container>
            </div>

            <div class="knob">
                <dui-icon [size]="12" name="arrows"></dui-icon>
            </div>
        </ng-container>

        <dui-dropdown #dropdown [host]="element.nativeElement">
            <dui-dropdown-item
                 *ngFor="let option of options.toArray()"
                 (click)="select(option.value)"
                 [selected]="innerValue === option.value"
            >
                <ng-container *ngIf="option.dynamic" [ngTemplateOutlet]="option.dynamic.template"></ng-container>
                <div *ngIf="!option.dynamic">
                    <div [innerHTML]="option.element.nativeElement.innerHTML"></div>
                </div>
            </dui-dropdown-item>
        </dui-dropdown>
    `,
    styleUrls: ['./selectbox.component.scss'],
    host: {
        '[attr.tabIndex]': '1',
        '[class.split]': '!!button',
    },
    providers: [ngValueAccessor(SelectboxComponent)]
})
export class SelectboxComponent<T> extends ValueAccessorBase<T> implements AfterViewInit, OnDestroy, OnChanges {
    @Input() placeholder: string = '';

    @Input() textured?: boolean = false;

    @HostBinding('class.textured')
    get isTextured() {
        return false !== this.textured;
    }

    @ContentChild(ButtonComponent, {static: false}) button?: ButtonComponent;

    @ContentChildren(OptionDirective) options?: QueryList<OptionDirective>;
    @ViewChild('dropdown', {static: false}) dropdown!: DropdownComponent;

    public label: string = '';
    public optionsValueMap = new Map<T, OptionDirective>();

    protected changeSubscription?: Subscription;

    constructor(
        protected overlay: Overlay,
        protected injector: Injector,
        public element: ElementRef,
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

    public select(value: T) {
        this.innerValue = value;
        this.dropdown.close();
    }

    @HostListener('click')
    public onClick() {
        if (this.disabled) return;
        if (this.button) return;

        this.dropdown.open();
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    @HostBinding('class.selected')
    get isSelected(): boolean {
        return this.innerValue !== undefined;
    }

    protected updateMap() {
        this.optionsValueMap.clear();
        if (!this.options) return;

        for (const option of this.options.toArray()) {
            this.optionsValueMap.set(option.value, option);
        }

        this.cd.detectChanges();
    }

    ngOnDestroy(): void {
        if (this.changeSubscription) {
            this.changeSubscription.unsubscribe();
        }
    }
}
