import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {arrayClear, arrayHasItem, arrayRemoveItem, eachPair, empty, first, indexOf, isNumber} from "@marcj/estdlib";
import * as Hammer from "hammerjs";

export interface Column<T> {
    id: string;
    header?: string;
    cell?: (row: T) => string;
}

/**
 * Necessary directive to get information about the row item T in dui-table-column.
 *
 * ```html
 * <dui-table-column>
 *     <ng-container *duiTableCell="let item">
 *          {{item.fieldName | date}}
 *     </ng-container>
 * </dui-table-column>
 * ```
 */
@Directive({
    selector: '[duiTableCell]',
})
export class TableCellDirective {
    constructor(public template: TemplateRef<any>) {
    }
}

/**
 * Defines a new column.
 */
@Directive({
    selector: 'dui-table-column'
})
export class TableColumnDirective {
    /**
     * The name of the field of T.
     */
    @Input('name') name?: string;

    /**
     * A different header name. Use dui-table-header to render HTML there.
     */
    @Input('header') header?: string;

    /**
     * Default width.
     */
    @Input('width') width?: number | string;

    /**
     * Adds additional class to the columns cells.
     */
    @Input('class') class: string = '';

    /**
     * At which position this column will be placed.
     */
    @Input('position') position?: number;

    //todo, write/read from localStorage
    /**
     * @hidden
     */
    ovewrittenPosition?: number;

    @ContentChild(TableCellDirective) cell?: TableCellDirective;

    getWidth(): string | undefined {
        if (!this.width) return undefined;

        if (isNumber(this.width)) {
            return this.width + 'px';
        }

        return this.width;
    }

    public getPosition() {
        if (this.ovewrittenPosition !== undefined) {
            return this.ovewrittenPosition
        }

        return this.position;
    }
}

/**
 * Used to render a different column header.
 *
 * ```html
 * <dui-table>
 *     <dui-table-header name="fieldName" [sortable]="false">Different Header</dui-table-header>
 * </dui-table
 * ```
 */
@Component({
    selector: 'dui-table-header',
    template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'

})
export class TableHeaderDirective {
    /**
     * The name of the field of T.
     */
    @Input('name') name!: string;
    @Input('sortable') sortable: boolean = true;

    @ViewChild('templateRef') template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-table',
    template: `
        <table>
            <thead *ngIf="showHeader" #header>
            <tr>
                <th *ngFor="let column of sortedColumnDefs"
                    [style.width]="getColumnWidth(column)"
                    (click)="sortBy(column.name)"
                    #th
                >
                    <ng-container
                        *ngIf="headerMapDef[column.name]"
                        [ngTemplateOutlet]="headerMapDef[column.name].template"
                        [ngTemplateOutletContext]="{$implicit: column}"></ng-container>

                    <ng-container *ngIf="!headerMapDef[column.name]">
                        {{column.header || column.name}}
                    </ng-container>

                    <ng-container *ngIf="(currentSort || defaultSort) === column.name">
                        <dui-icon *ngIf="!isAsc()" [size]="12" name="arrow_down"></dui-icon>
                        <dui-icon *ngIf="isAsc()" [size]="12" name="arrow_up"></dui-icon>
                    </ng-container>

                    <dui-splitter [element]="th" indicator position="right"></dui-splitter>
                </th>
                <th style="width: auto"></th>
            </tr>
            </thead>
            <tbody>
            <ng-container *ngFor="let row of sorted; trackBy: trackByFn">
                <tr
                    [class.selected]="selectedMap.has(row)"
                    (click)="select(row, $event)"
                    (dblclick)="dbclick.emit(row)"
                >
                    <td *ngFor="let column of sortedColumnDefs"
                        [class]="column.class">
                        <ng-container *ngIf="column.cell">
                            <ng-container [ngTemplateOutlet]="column.cell!.template"
                                          [ngTemplateOutletContext]="{ $implicit: row }"></ng-container>
                        </ng-container>
                        <ng-container *ngIf="!column.cell">
                            {{ row[column.name] }}
                        </ng-container>
                    </td>
                    <td></td>
                </tr>
            </ng-container>
            </tbody>
        </table>
    `,
    styleUrls: ['./table.component.scss'],
    host: {
        '[class.no-focus-outline]': 'noFocusOutline !== false'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements AfterViewInit, OnChanges, OnDestroy {
    /**
     * @hidden
     */
    @HostBinding() tabindex = 0;

    /**
     * Array of items that should be used for each row.
     */
    @Input() public items!: T[];

    /**
     * Whether the header should be shown.
     */
    @Input() public showHeader: boolean = true;

    /**
     * Default field of T for sorting.
     */
    @Input() public defaultSort: string = '';

    /**
     * Default sorting order.
     */
    @Input() public defaultSortDirection: 'asc' | 'desc' = 'asc';

    /**
     * Whether rows are selectable.
     */
    @Input() public selectable: boolean = false;

    /**
     * Whether multiple rows are selectable at the same time.
     */
    @Input() public multiSelect: boolean = false;

    /**
     * TrackFn for ngFor to improve performance. Default is order by index.
     */
    @Input() public trackFn?: (index: number, item: T) => any;

    /**
     * Not used yet.
     */
    @Input() public displayInitial: number = 20;

    /**
     * Not used yet.
     */
    @Input() public increaseBy: number = 10;

    /**
     * Filter function.
     */
    @Input() public filter?: (item: T) => boolean;

    /**
     * Filter query.
     */
    @Input() public filterQuery?: string;

    /**
     * Against which fields filterQuery should run.
     */
    @Input() public filterFields?: string[];

    @Input() noFocusOutline = false;

    public currentSort: string = '';

    public currentSortDirection: 'asc' | 'desc' | '' = '';

    public sorted: T[] = [];

    public selectedMap = new Map<T, boolean>();

    /**
     * Elements that are selected, by reference.
     */
    @Input() public selected: T[] = [];

    /**
     * Elements that are selected, by reference.
     */
    @Output() public selectedChange: EventEmitter<T[]> = new EventEmitter();

    /**
     * When a row gets double clicked.
     */
    @Output() public dbclick: EventEmitter<T> = new EventEmitter();

    @ViewChild('header') header?: ElementRef;
    @ViewChildren('th') ths?: QueryList<ElementRef>;

    @ContentChildren(TableColumnDirective) columnDefs?: QueryList<TableColumnDirective>;
    @ContentChildren(TableHeaderDirective) headerDefs?: QueryList<TableHeaderDirective>;

    sortedColumnMap = new Map<HTMLElement, TableColumnDirective>();
    sortedColumnDefs: TableColumnDirective[] = [];

    headerMapDef: { [name: string]: TableHeaderDirective } = {};

    public displayedColumns?: string[] = [];

    // private directiveSubscriptions = new Subscriptions;

    // private dataSubscriptions = new Subscriptions;

    // private itemsSubscription?: Subscription;

    constructor(private cd: ChangeDetectorRef) {
    }

    public getColumnWidth(column: TableColumnDirective): string {
        if (this.columnDefs!.length === 1) {
            return '100%';
        }

        return column.getWidth()!;
    }

    ngOnDestroy(): void {
    }

    public isAsc(): boolean {
        return (this.currentSortDirection || this.defaultSortDirection) === 'asc';
    }

    public sortBy(name: string) {

        if (this.headerMapDef[name]) {
            const headerDef = this.headerMapDef[name];
            if (!headerDef.sortable) {
                return;
            }
        }

        if (!this.currentSort && this.defaultSort === name) {
            this.currentSort = this.defaultSort;
            this.currentSortDirection = this.defaultSortDirection;

            if (this.currentSortDirection === 'asc') {
                this.currentSortDirection = 'desc';
            } else {
                this.currentSortDirection = 'asc';
            }
        } else if (this.currentSort === name) {
            if (this.currentSortDirection === 'asc') {
                this.currentSortDirection = 'desc';
            } else {
                this.currentSortDirection = 'asc';
            }
        } else if (!this.currentSort && this.defaultSort !== name) {
            this.currentSort = this.defaultSort;
            this.currentSortDirection = this.defaultSortDirection;
        }

        this.currentSort = name;
        this.doSort();
    }

    trackByFn(index: number, item: any) {
        return this.trackFn ? this.trackFn(index, item) : index;
    }


    protected initHeaderMovement() {
        // console.log('InitHeaderMovement', this.header, this.ths);
        if (this.header && this.ths) {
            const mc = new Hammer(this.header.nativeElement);
            mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));

            interface Box {
                left: number;
                width: number;
                element: HTMLElement;
            }

            const THsBoxes: Box[] = [];

            let element: HTMLElement | undefined;
            let originalPosition = -1;
            let newPosition = -1;
            const columnDirectives = this.columnDefs!.toArray();

            mc.on('panstart', (event: HammerInput) => {
                if (this.ths && event.target.tagName.toLowerCase() === 'th') {
                    element = event.target as HTMLElement;
                    element.style.zIndex = '1000000';

                    arrayClear(THsBoxes);

                    for (const th of this.ths.toArray()) {
                        if (th.nativeElement === element) {
                            originalPosition = THsBoxes.length;
                            newPosition = THsBoxes.length;
                        }
                        THsBoxes.push({
                            left: th.nativeElement.offsetLeft,
                            width: th.nativeElement.offsetWidth,
                            element: th.nativeElement
                        })
                    }

                    console.log('THsBoxes', THsBoxes);
                }
            });

            mc.on('panend', (event: HammerInput) => {
                if (element) {
                    element.style.left = 'auto';
                    element.style.zIndex = 'auto';
                    console.log('new position', originalPosition, newPosition);

                    for (const box of THsBoxes) {
                        box.element.style.left = 'auto';
                    }

                    if (originalPosition !== newPosition) {
                        const directive = columnDirectives[originalPosition];
                        columnDirectives.splice(originalPosition, 1);
                        columnDirectives.splice(newPosition, 0, directive);

                        for (let [i, v] of eachPair(columnDirectives)) {
                            v.ovewrittenPosition = i;
                        }

                        this.sortColumnDefs();

                        // const position =
                        // this.columnDefs.toArray()[]
                        // this.sortColumnDefs();
                    }

                    element = undefined;
                }
            });

            mc.on('pan', (event: HammerInput) => {
                if (element) {
                    element.style.left = (event.deltaX) + 'px';
                    let afterElement = false;

                    for (const [i, box] of eachPair(THsBoxes)) {
                        if (box.element === element) {
                            afterElement = true;
                            continue;
                        }

                        box.element.style.left = 'auto';
                        if (!afterElement && box.left + (box.width / 2) > element.offsetLeft) {
                            box.element.style.left = element.offsetWidth + 'px';
                            if (i < newPosition) {
                                newPosition = i;
                            }
                        }

                        if (afterElement && box.left + (box.width / 2) < element.offsetLeft + element.offsetWidth) {
                            box.element.style.left = -element.offsetWidth + 'px';
                            newPosition = i;
                        }
                    }
                }
            });
        }
    }

    ngAfterViewInit(): void {
        this.initHeaderMovement();

        if (this.columnDefs) {
            if (this.headerDefs) {
                for (const header of this.headerDefs.toArray()) {
                    this.headerMapDef[header.name] = header;
                }
            }
            this.updateDisplayColumns();
            this.sortColumnDefs();
        }
    }

    protected sortColumnDefs() {
        if (this.columnDefs) {
            this.sortedColumnDefs = this.columnDefs.toArray();
            this.sortedColumnDefs = this.sortedColumnDefs.sort((a: TableColumnDirective, b: TableColumnDirective) => {
                const aPosition = a.getPosition();
                const bPosition = b.getPosition();

                if (aPosition !== undefined && bPosition !== undefined) {
                    if (aPosition > bPosition) return 1;
                    if (aPosition < bPosition) return -1;
                } else {
                    if (bPosition === undefined && aPosition !== undefined) return 1;
                    if (bPosition !== undefined && aPosition === undefined) return -1;
                }

                return 0;
            });

            setTimeout(() => {
                this.cd.detectChanges();
            })
        }
    }

    filterFn(item: T) {
        if (this.filter) {
            return this.filter(item);
        }

        if (this.filterQuery && this.filterFields) {
            const q = this.filterQuery.toLowerCase();
            for (const field of this.filterFields) {
                if (-1 !== String((item as any)[field]).toLowerCase().indexOf(q)) {
                    return true;
                }
            }

            return false;
        }

        return true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.sorted = this.items;
        this.doSort();

        if (changes.selected) {
            this.selectedMap.clear();
            if (this.selected) {
                for (const v of this.selected) {
                    this.selectedMap.set(v, true);
                }
            }
        }
    }

    private updateDisplayColumns() {
        this.displayedColumns = [];

        if (this.columnDefs) {
            for (const column of this.columnDefs.toArray()) {
                this.displayedColumns.push(column.name!);
            }

            this.doSort();
        }
    }

    private doSort() {
        if (!this.sorted) {
            return;
        }

        this.sorted.sort((a: any, b: any) => {
            if ((this.currentSortDirection || this.defaultSortDirection) === 'asc') {
                if (a[this.currentSort || this.defaultSort] > b[this.currentSort || this.defaultSort]) return 1;
                if (a[this.currentSort || this.defaultSort] < b[this.currentSort || this.defaultSort]) return -1;
            } else {
                if (a[this.currentSort || this.defaultSort] > b[this.currentSort || this.defaultSort]) return -1;
                if (a[this.currentSort || this.defaultSort] < b[this.currentSort || this.defaultSort]) return 1;
            }

            return 0;
        });

        //apply filter
        this.sorted = this.sorted.filter((v) => this.filterFn(v));

        this.cd.detectChanges();
    }

    @HostListener('keydown', ['$event'])
    onFocus(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const firstSelected = first(this.selected);
            if (firstSelected) {
                this.dbclick.emit(firstSelected);
            }
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            const firstSelected = first(this.selected);

            if (!firstSelected) {
                this.select(this.sorted[0]);
                return;
            }

            let index = indexOf(this.sorted, firstSelected);

            // if (-1 === index) {
            //     this.select(this.sorted[0]);
            //     this.paginator.pageIndex = 0;
            //     return;
            // }

            if (event.key === 'ArrowUp') {
                if (0 === index) {
                    return;
                }
                index--;
            }

            if (event.key === 'ArrowDown') {
                if (empty(this.items)) {
                    return;
                }
                index++;
            }

            if (this.sorted[index]) {
                const item = this.sorted[index];
                // if (event.shiftKey) {
                //     this.selectedMap[item.id] = true;
                //     this.selected.push(item);
                // } else {
                this.select(item);
                // }
            }
            this.selectedChange.emit(this.selected);
            this.cd.markForCheck();

        }
    }

    private select(item: T, $event?: MouseEvent) {
        if (!this.selectable) {
            return;
        }

        if (!this.multiSelect) {
            this.selected = [item];
            this.selectedMap.clear();
            this.selectedMap.set(item, true);
        } else {
            if (!$event || !$event.metaKey) {
                this.selected = [item];
                this.selectedMap.clear();
                this.selectedMap.set(item, true);
            } else {
                if (arrayHasItem(this.selected, item)) {
                    arrayRemoveItem(this.selected, item);
                    this.selectedMap.delete(item);
                } else {
                    this.selectedMap.set(item, true);
                    this.selected.push(item);
                }
            }
        }
        this.selectedChange.emit(this.selected);
        this.cd.detectChanges();

        // setTimeout(() => {
        //     scrollIntoView(document.getElementById('simple_table_item_' + (item as any)['id']), {
        //         scrollMode: 'if-needed'
        //     });
        // }, 50);
    }
}
