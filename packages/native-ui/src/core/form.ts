import {ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {ChangeDetectorRef, forwardRef, InjectFlags, Injector, OnDestroy, Type} from "@angular/core";
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
    /**
     * @hidden
     */
    private _innerValue: T | undefined;

    /**
     * @hidden
     */
    public readonly changed = new Subject<T | undefined>();

    /**
     * @hidden
     */
    public readonly touched = new Subject<void>();

    /**
     * @hidden
     */
    private _ngControl?: NgControl;

    /**
     * @hidden
     */
    private _ngControlFetched = false;

    public disabled = false;

    /**
     * @hidden
     */
    protected readonly subs = new Subscriptions();

    /**
     * @hidden
     */
    protected cd: ChangeDetectorRef;

    constructor(protected injector: Injector) {
        if (!injector) {
            throw new Error('injector undefined');
        }
        this.cd = injector.get(ChangeDetectorRef as Type<ChangeDetectorRef>, undefined, InjectFlags.SkipSelf);
    }

    /**
     * @hidden
     */
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

    /**
     * @hidden
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * @hidden
     */
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    /**
     * @hidden
     */
    get innerValue(): T | undefined {
        return this._innerValue;
    }

    /**
     * Sets the internal value with notifying all changed callbacks and onInnerValueChange callback.
     * Use `_innerValue` for hidden value change.
     * @param value
     * @hidden
     */
    set innerValue(value: T | undefined) {
        if (this._innerValue !== value) {
            this._innerValue = value;
            this.changed.next(value);
            this.onInnerValueChange();
            this.cd.detectChanges();
        }
    }

    /**
     * @hidden
     */
    protected onInnerValueChange() {

    }

    /**
     * @hidden
     */
    touch() {
        this.touched.next();
    }

    /**
     * @hidden
     */
    onTouched() {
        this.touched.next();
    }

    /**
     * @hidden
     */
    writeValue(value?: T) {
        this._innerValue = value;
        this.changed.next(value);
        this.onInnerValueChange();
        this.cd.detectChanges();
    }

    /**
     * @hidden
     */
    registerOnChange(fn: (value: T | undefined) => void) {
        this.subs.add = this.changed.subscribe(fn);
    }

    /**
     * @hidden
     */
    registerOnTouched(fn: () => void) {
        this.subs.add = this.touched.subscribe(fn);
    }
}
