import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {ChangeDetectorRef, forwardRef, Inject, Injector, OnDestroy, SkipSelf, Type} from "@angular/core";
import {Subject} from "rxjs";
import {Subscriptions} from "@marcj/estdlib-rxjs";

export function ngValueAccessor<T>(clazz: Type<T>) {
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => clazz),
        multi: true
    };
}

export class ValueAccessorBase<T> implements ControlValueAccessor, OnDestroy {
    private _innerValue: T | undefined;

    public readonly changed = new Subject<T | undefined>();
    public readonly touched = new Subject<void>();

    private _ngControl?: NgControl;
    private _ngControlFetched = false;

    public disabled = false;

    protected readonly subs = new Subscriptions();

    constructor(
        @Inject(Injector) protected injector: Injector,
        @SkipSelf() @Inject(ChangeDetectorRef) protected cd: ChangeDetectorRef
    ) {
    }

    get ngControl(): NgControl | undefined {
        if (!this._ngControlFetched) {
            try {
                this._ngControl = this.injector.get(NgControl);
            } catch (e) {
            }
            this._ngControlFetched = true;
        }

        return this._ngControl;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    get innerValue(): T | undefined {
        return this._innerValue;
    }

    /**
     * Sets the internal value with notifying all changed callbacks and onInnerValueChange callback.
     * Use `_innerValue` for hidden value change.
     * @param value
     */
    set innerValue(value: T | undefined) {
        if (this._innerValue !== value) {
            this._innerValue = value;
            this.changed.next(value);
            this.onInnerValueChange();
            this.cd.detectChanges();
        }
    }

    protected onInnerValueChange() {

    }

    touch() {
        this.touched.next();
    }

    onTouched() {
        this.touched.next();
    }

    writeValue(value?: T) {
        this._innerValue = value;
        this.changed.next(value);
        this.onInnerValueChange();
        this.cd.detectChanges();
    }

    registerOnChange(fn: (value: T | undefined) => void) {
        this.subs.add = this.changed.subscribe(fn);
    }

    registerOnTouched(fn: () => void) {
        this.subs.add = this.touched.subscribe(fn);
    }
}
