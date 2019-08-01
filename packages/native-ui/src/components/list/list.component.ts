import {
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener, Inject, Injectable, Injector,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    SimpleChanges,
    SkipSelf
} from '@angular/core';
import {NavigationEnd, Router, UrlTree} from '@angular/router';
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";
import {Subscription} from "rxjs";

@Component({
    selector: 'dui-list-title',
    template: `
        <ng-content></ng-content>`,
    styleUrls: ['./list-title.component.scss']
})
export class ListTitleComponent {
    constructor() {
    }
}


@Component({
    selector: 'dui-list',
    template: `
        <ng-content></ng-content>
    `,
    styleUrls: ['./list.component.scss'],
    providers: [ngValueAccessor(ListComponent)]
})
@Injectable()
export class ListComponent extends ValueAccessorBase<any> {
    @HostBinding('tabindex') tabIndex: number = 1;

    @ContentChildren(forwardRef(() => ListItemComponent)) list!: QueryList<ListItemComponent>;

    @HostBinding('class.disabled')
    get isDisabled() {
        return this.disabled;
    }

    constructor(
        protected injector: Injector,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
    ) {
        super(injector, cd, cdParent);
    }

    @HostListener('keydown', ['$event'])
    public async onKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowDown') {
            const selectedItem = this.getSelectedItem();
            if (selectedItem) {
                const position = this.list.toArray().indexOf(selectedItem);

                if (this.list.toArray()[position + 1]) {
                    await this.list.toArray()[position + 1].select();
                }
            }
        }

        if (event.key === 'ArrowUp') {
            const selectedItem = this.getSelectedItem();
            if (selectedItem) {
                const position = this.list.toArray().indexOf(selectedItem);

                if (this.list.toArray()[position - 1]) {
                    await this.list.toArray()[position - 1].select();
                }
            }
        }
    }

    public getSelectedItem(): ListItemComponent | undefined {
        for (const item of this.list.toArray()) {
            if (item.isSelected()) {
                return item;
            }
        }

        return;
    }
}


@Component({
    selector: 'dui-list-item',
    template: `
        <ng-content></ng-content>
    `,
    host: {
        '[class.selected]': 'isSelected()',
    },
    styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnChanges, OnDestroy {
    @Input() value: any;
    @Input() routerLink?: string | UrlTree | any[];

    protected routerSub: Subscription;

    constructor(
        public list: ListComponent,
        public element: ElementRef,
        public router: Router,
        @SkipSelf() public cd: ChangeDetectorRef,
    ) {
        this.element.nativeElement.removeAttribute('tabindex');
        this.list.registerOnChange(() => {
            this.cd.detectChanges();
        });
        this.routerSub = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.cd.detectChanges();
            }
        })
    }

    ngOnDestroy(): void {
        this.routerSub.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.cd.detectChanges();
    }

    public async select() {
        if (this.routerLink) {
            if ('string' === typeof this.routerLink) {
                await this.router.navigateByUrl(this.routerLink);
            } else if (Array.isArray(this.routerLink)) {
                await this.router.navigate(this.routerLink);
            } else {
                await this.router.navigateByUrl(this.router.serializeUrl(this.routerLink));
            }
        } else {
            this.list.innerValue = this.value;
        }
    }

    public isSelected(): boolean {
        if (this.value !== undefined) {
            return this.list.innerValue === this.value;
        }

        if (this.routerLink) {
            if ('string' === typeof this.routerLink) {
                return this.router.isActive(this.routerLink, false);
            } else if (Array.isArray(this.routerLink)) {
                return this.router.isActive(this.router.createUrlTree(this.routerLink), false);
            } else {
                return this.router.isActive(this.routerLink, false);
            }
        }

    }

    @HostListener('click')
    public onClick() {
        this.list.innerValue = this.value;
    }
}
