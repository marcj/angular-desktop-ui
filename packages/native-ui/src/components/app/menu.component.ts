import {
    AfterViewInit,
    ContentChildren,
    Directive,
    EventEmitter,
    forwardRef,
    Injectable,
    Input,
    OnDestroy,
    Output,
    QueryList
} from "@angular/core";
import {WindowMenuState} from "../window/window-menu";
import {arrayHasItem} from "@marcj/estdlib";
import {Subscription} from "rxjs";
import {Electron} from "./utils";

@Injectable()
export class MenuBase implements AfterViewInit {
    @Input() label?: string;
    @Input() sublabel?: string;
    @Input() icon?: string;
    @Input() enabled: boolean = true;
    @Input() accelerator?: string;
    @Input() role?: string;

    @Input() visible: boolean = true;

    @Input() onlyMacOs: boolean | undefined = false;
    @Input() noMacOs: boolean | undefined = false;

    @Input() id?: string;
    @Input() before?: string;
    @Input() after?: string;
    @Input() beforeGroupContaining?: string;
    @Input() afterGroupContaining?: string;

    @Output() click = new EventEmitter();

    @Output() change = new EventEmitter;

    public type = '';

    protected registered = new Set<MenuBase>();
    protected subscriptions = new Map<MenuBase, Subscription>();

    @ContentChildren(MenuBase) public child?: QueryList<MenuBase>;

    constructor() {

    }

    buildTemplate() {
        const submenu = [];
        if (this.child) {
            for (const item of this.child.toArray()) {
                if (item === this) continue;
                if (item.validOs()) {
                    submenu.push(item.buildTemplate());
                }
            }
        }

        const result: {[name: string]: any} = {
            click: () => {
                this.click.emit()
            },
        };

        if (this.label) result['label'] = this.label;
        if (this.sublabel) result['sublabel'] = this.sublabel;

        if (!this.enabled) result['enabled'] = false;
        if (this.type) result['type'] = this.type;

        if (this.accelerator) result['accelerator'] = this.accelerator;
        if (this.role) result['role'] = this.role;
        if (this.type) result['type'] = this.type;
        if (this.accelerator) result['accelerator'] = this.accelerator;
        if (submenu.length) result['submenu'] = submenu;

        return result;
    }

    public validOs(): boolean {
        if ('undefined' !== typeof Electron.isAvailable()) {
            if (this.onlyMacOs !== false && Electron.getPlatform() !== 'darwin') {
                return false;
            }

            if (this.noMacOs !== false && Electron.getPlatform() === 'darwin') {
                return false;
            }
        }

        return true;
    }

    ngAfterViewInit() {
        console.log('menuBase ngAfterViewInit', this);
        if (this.child) {
            this.child!.changes.subscribe((items: MenuBase[]) => {
                for (const item of items) {
                    if (!this.registered.has(item)) {
                        this.registered.add(item);
                        this.subscriptions.set(item, item.change.subscribe(() => {
                            this.change.emit();
                        }));
                    }
                }

                for (const item of this.registered) {
                    if (!arrayHasItem(items, item)) {
                        //got removed
                        this.registered.delete(item);
                        this.subscriptions.get(item)!.unsubscribe();
                        this.subscriptions.delete(item);
                    }
                }

                this.change.emit();
            });
        }
    }
}

@Directive({
    selector: 'dui-menu-item',
    providers: [{provide: MenuBase, useExisting: forwardRef(() => MenuItemDirective)}]
})
export class MenuItemDirective extends MenuBase {
}

@Directive({
    selector: 'dui-menu-checkbox',
    providers: [{provide: MenuBase, useExisting: forwardRef(() => MenuCheckboxDirective)}]
})
export class MenuCheckboxDirective extends MenuBase {
    @Input() checked: boolean = false;

    type = 'checkbox';

    buildTemplate() {
        return {...super.buildTemplate(), checked: this.checked};
    }
}

@Directive({
    selector: 'dui-menu-radio',
    providers: [{provide: MenuBase, useExisting: forwardRef(() => MenuRadioDirective)}]
})
export class MenuRadioDirective extends MenuBase {
    @Input() checked: boolean = false;

    type = 'radio';

    buildTemplate() {
        return {...super.buildTemplate(), checked: this.checked};
    }
}

@Directive({
    selector: 'dui-menu-separator',
    providers: [{provide: MenuBase, useExisting: forwardRef(() => MenuSeparatorDirective)}]
})
export class MenuSeparatorDirective {
    type = 'separator';
}

@Directive({
    selector: 'dui-menu'
})
export class MenuDirective extends MenuBase implements OnDestroy, AfterViewInit {
    @Input() position: number = 0;

    constructor(protected windowMenuState: WindowMenuState) {
        super();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
        this.windowMenuState.addMenu(this);
    }

    ngOnDestroy() {
        this.windowMenuState.removeMenu(this);
    }
}
