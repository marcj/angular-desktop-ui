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
    SimpleChanges, SkipSelf,
    TemplateRef,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {
    arrayClear,
    arrayHasItem,
    arrayRemoveItem,
    eachPair,
    empty,
    first,
    indexOf,
    isArray,
    isNumber
} from "@marcj/estdlib";
import * as Hammer from "hammerjs";
import {Observable} from "rxjs";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

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
     * The name of the column. Needs to be unique. If no renderer (*duiTableCell) is specified, this
     * name is used to render the content T[name].
     */
    @Input('name') name?: string;

    /**
     * A different header name. Use dui-table-header to render HTML there.
     */
    @Input('header') header?: string;

    /**
     * Default width.
     */
    @Input('width') width?: number | string = 100;

    /**
     * Adds additional class to the columns cells.
     */
    @Input('class') class: string = '';

    /**
     * Whether this column is start hidden. User can unhide it using the context menu on the header.
     */
    @Input('hidden') hidden: boolean = false;

    /**
     * At which position this column will be placed.
     */
    @Input('position') position?: number;

    //todo, write/read from localStorage

    /**
     * This is the new position when the user moved it manually.
     * @hidden
     */
    ovewrittenPosition?: number;

    @ContentChild(TableCellDirective, {static: false}) cell?: TableCellDirective;

    isHidden() {
        return this.hidden !== false;
    }

    toggleHidden() {
        this.hidden = !this.isHidden();
    }

    /**
     * @hidden
     */
    getWidth(): string | undefined {
        if (!this.width) return undefined;

        if (isNumber(this.width)) {
            return this.width + 'px';
        }

        return this.width;
    }

    /**
     * @hidden
     */
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

    @ViewChild('templateRef', {static: false}) template!: TemplateRef<any>;
}

@Component({
    selector: 'dui-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <dui-dropdown #chooseColumns>

            <dui-dropdown-item
                    *ngFor="let column of sortedColumnDefs; trackBy: trackByColumn"
                    [selected]="!column.isHidden()"
                    (click)="column.toggleHidden(); sortColumnDefs(); chooseColumns.close()"
            >
                <ng-container *ngIf="!headerMapDef[column.name]">
                    {{column.header || column.name}}
                </ng-container>
                <ng-container
                        *ngIf="headerMapDef[column.name]"
                        [ngTemplateOutlet]="headerMapDef[column.name].template"
                        [ngTemplateOutletContext]="{$implicit: column}"></ng-container>
            </dui-dropdown-item>
        </dui-dropdown>

        <div [style.height]="autoHeight !== false ? height + 'px' : '100%'" [style.minHeight.px]="itemHeight">
            <div class="header" *ngIf="showHeader" #header [contextDropdown]="chooseColumns">
                <div class="th"
                     *ngFor="let column of visibleColumns(sortedColumnDefs); trackBy: trackByColumn"
                     [style.width]="column.getWidth()"
                     (click)="sortBy(column.name)"
                     [attr.name]="column.name"
                     [style.top]="scrollTop + 'px'"
                     #th>
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

                    <dui-splitter [model]="column.width" (modelChange)="setColumnWidth(column, $event)"
                                  indicator position="right"></dui-splitter>
                </div>
            </div>

            <div class="body" [class.with-header]="showHeader">
                <cdk-virtual-scroll-viewport #viewportElement
                                             [itemSize]="itemHeight"
                >
                    <ng-container
                            *cdkVirtualFor="let row of filterSorted(sorted); trackBy: trackByFn.bind(this); odd as isOdd">
                        <div class="table-row"
                             [class.selected]="selectedMap.has(row)"
                             [class.odd]="isOdd"
                             [style.height.px]="itemHeight"
                             (click)="select(row, $event)"
                             (dblclick)="dbclick.emit(row)"
                        >
                            <div *ngFor="let column of visibleColumns(sortedColumnDefs); trackBy: trackByColumn"
                                 [class]="column.class"
                                 [attr.row-column]="column.name"
                                 [style.width]="column.getWidth()"
                            >
                                <ng-container *ngIf="column.cell">
                                    <ng-container [ngTemplateOutlet]="column.cell!.template"
                                                  [ngTemplateOutletContext]="{ $implicit: row }"></ng-container>
                                </ng-container>
                                <ng-container *ngIf="!column.cell">
                                    {{ row[column.name] }}
                                </ng-container>
                            </div>
                        </div>
                    </ng-container>
                </cdk-virtual-scroll-viewport>
            </div>
        </div>
    `,
    styleUrls: ['./table.component.scss'],
    host: {
        '[class.no-focus-outline]': 'noFocusOutline !== false',
        '[class.borderless]': 'borderless !== false',
        '[class.overlay-scrollbar]': 'true',
        '[class.auto-height]': 'autoHeight !== false',
    },
})
export class TableComponent<T> implements AfterViewInit, OnChanges, OnDestroy {
    /**
     * @hidden
     */
    @HostBinding() tabindex = 0;

    @Input() borderless = false;

    /**
     * Array of items that should be used for each row.
     */
    @Input() public items!: T[] | Observable<T[]>;

    /**
     * Since dui-table has virtual-scroll active per default, it's required to define the itemHeight to
     * make scrolling actually workable correctly.
     */
    @Input() public itemHeight: number = 23;

    /**
     * Whether the table height is calculated based on current item count and [itemHeight].
     */
    @Input() public autoHeight: boolean = false;

    /**
     * Current calculated height, used only when autoHeight is given.
     */
    public height: number = 23;

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

    @Input() public columnState: { name: string, position: number, visible: boolean }[] = [];

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

    @Output() public sortedChange: EventEmitter<T[]> = new EventEmitter();

    /**
     * When a row gets double clicked.
     */
    @Output() public dbclick: EventEmitter<T> = new EventEmitter();

    @ViewChild('header', {static: false}) header?: ElementRef;
    @ViewChildren('th') ths?: QueryList<ElementRef<HTMLElement>>;

    @ContentChildren(TableColumnDirective) columnDefs?: QueryList<TableColumnDirective>;
    @ContentChildren(TableHeaderDirective) headerDefs?: QueryList<TableHeaderDirective>;

    @ViewChild(CdkVirtualScrollViewport, {static: true}) viewport!: CdkVirtualScrollViewport;
    @ViewChild('viewportElement', {static: true, read: ElementRef}) viewportElement!: ElementRef;

    sortedColumnDefs: TableColumnDirective[] = [];

    headerMapDef: { [name: string]: TableHeaderDirective } = {};

    public displayedColumns?: string[] = [];

    protected ignoreThisSort = false;
    public scrollTop = 0;

    constructor(
        protected element: ElementRef,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected parentCd: ChangeDetectorRef,
    ) {
    }

    public setColumnWidth(column: TableColumnDirective, width: number) {
        column.width = width;
        this.cd.detectChanges();
    }

    ngOnDestroy(): void {
    }

    @HostListener('window:resize')
    onResize() {
        this.viewport.checkViewportSize();
    }

    /**
     * @hidden
     */
    public isAsc(): boolean {
        return (this.currentSortDirection || this.defaultSortDirection) === 'asc';
    }

    /**
     * Toggles the sort by the given column name.
     */
    public sortBy(name: string) {
        if (this.ignoreThisSort) {
            this.ignoreThisSort = false;
            return;
        }

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

    /**
     * @hidden
     */
    trackByFn(index: number, item: any) {
        return this.trackFn ? this.trackFn(index, item) : index;
    }

    /**
     * @hidden
     */
    trackByColumn(column: TableColumnDirective) {
        return column.name;
    }

    /**
     * @hidden
     */
    filterSorted(items: T[]): T[] {
        //apply filter
        if (this.filter || (this.filterQuery && this.filterFields)) {
            return items.filter((v) => this.filterFn(v));
        }

        return items;
    }

    protected initHeaderMovement() {
        if (this.header && this.ths) {
            const mc = new Hammer(this.header!.nativeElement);
            mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 2}));

            interface Box {
                left: number;
                width: number;
                element: HTMLElement;
                directive: TableColumnDirective;
            }

            const THsBoxes: Box[] = [];

            let element: HTMLElement | undefined;
            let elementCells: HTMLElement[] = [];
            let originalPosition = -1;
            let foundBox: Box | undefined;
            let rowCells: {cells: HTMLElement[]}[] = [];

            let animationFrame: any;
            mc.on('panstart', (event: HammerInput) => {
                foundBox = undefined;

                if (this.ths && event.target.classList.contains('th')) {
                    element = event.target as HTMLElement;
                    element.style.zIndex = '1000000';
                    element.style.opacity = '0.8';

                    arrayClear(THsBoxes);

                    for (const th of this.ths.toArray()) {
                        const directive: TableColumnDirective = this.sortedColumnDefs.find((v) => v.name === th.nativeElement.getAttribute('name')!)!;
                        const cells = [...this.element.nativeElement.querySelectorAll('div[row-column="' + directive.name + '"]')] as any as HTMLElement[];

                        if (th.nativeElement === element) {
                            originalPosition = this.sortedColumnDefs.indexOf(directive);
                            elementCells = cells;
                            for (const cell of elementCells) {
                                cell.classList.add('active-drop');
                            }
                        } else {
                            for (const cell of cells) {
                                cell.classList.add('other-cell');
                            }
                            th.nativeElement.classList.add('other-cell');
                        }

                        THsBoxes.push({
                            left: th.nativeElement.offsetLeft,
                            width: th.nativeElement.offsetWidth,
                            element: th.nativeElement,
                            directive: directive,
                        });

                        rowCells.push({cells: cells});
                    }
                }
            });

            mc.on('panend', (event: HammerInput) => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }
                if (element) {
                    element.style.left = '0px';
                    element.style.zIndex = '1';
                    element.style.opacity = '1';

                    for (const t of rowCells) {
                        for (const cell of t.cells) {
                            cell.classList.remove('active-drop');
                            cell.classList.remove('other-cell');
                            cell.style.left = '0px';
                        }
                    }

                    this.ignoreThisSort = true;

                    for (const [i, box] of eachPair(THsBoxes)) {
                        box.element.style.left = '0px';
                        box.element.classList.remove('other-cell');
                        for (const cell of rowCells[i].cells) {
                            cell.style.left = '0px';
                        }
                    }

                    if (!foundBox) return;

                    const newPosition = this.sortedColumnDefs.indexOf(foundBox.directive);

                    if (originalPosition !== newPosition) {
                        const directive = this.sortedColumnDefs[originalPosition];
                        this.sortedColumnDefs.splice(originalPosition, 1);
                        this.sortedColumnDefs.splice(newPosition, 0, directive);

                        for (let [i, v] of eachPair(this.sortedColumnDefs)) {
                            v.ovewrittenPosition = i;
                        }

                        this.sortColumnDefs();

                    }

                    element = undefined;
                }
            });

            mc.on('pan', (event: HammerInput) => {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }

                animationFrame = requestAnimationFrame(() => {
                    if (element) {
                        element!.style.left = (event.deltaX) + 'px';
                        for (const cell of elementCells) {
                            cell.style.left = (event.deltaX) + 'px';
                        }
                        let afterElement = false;

                        foundBox = undefined;
                        for (const [i, box] of eachPair(THsBoxes)) {
                            if (box.element === element) {
                                afterElement = true;
                                continue;
                            }

                            box.element.style.left = '0px';
                            for (const cell of rowCells[i].cells) {
                                cell.style.left = '0px';
                            }

                            if (!afterElement && box.left + (box.width / 2) > element!.offsetLeft) {
                                //the dragged element is before the current
                                box.element.style.left = element!.offsetWidth + 'px';

                                for (const cell of rowCells[i].cells) {
                                    cell.style.left = element!.offsetWidth + 'px';
                                }

                                if (foundBox && box.left > foundBox.left) {
                                    //we found already a box that fits and that is more left
                                    continue;
                                }

                                foundBox = box;
                            } else if (afterElement && box.left + (box.width / 2) < element!.offsetLeft + element!.offsetWidth) {
                                //the dragged element is after the current
                                box.element.style.left = -element!.offsetWidth + 'px';
                                for (const cell of rowCells[i].cells) {
                                    cell.style.left = -element!.offsetWidth + 'px';
                                }
                                foundBox = box;
                            }
                        }
                    }
                });
            });
        }
    }

    ngAfterViewInit(): void {
        this.viewport.renderedRangeStream.subscribe(() => {
            this.cd.detectChanges();
        });

        this.viewportElement.nativeElement.addEventListener('scroll', () => {
            const scrollLeft = this.viewportElement.nativeElement.scrollLeft;
            this.header!.nativeElement.scrollLeft = scrollLeft;
        });

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
            const originalDefs = this.columnDefs.toArray();

            this.sortedColumnDefs = this.columnDefs.toArray().slice(0);

            this.sortedColumnDefs = this.sortedColumnDefs.sort((a: TableColumnDirective, b: TableColumnDirective) => {
                const aPosition = a.getPosition() === undefined ? originalDefs.indexOf(a) : a.getPosition()!;
                const bPosition = b.getPosition() === undefined ? originalDefs.indexOf(b) : b.getPosition()!;

                if (aPosition > bPosition) return 1;
                if (aPosition < bPosition) return -1;

                return 0;
            });

            setTimeout(() => {
                this.cd.detectChanges();
            })
        }
    }

    visibleColumns(t: TableColumnDirective[]): TableColumnDirective[] {
        return t.filter(v => !v.isHidden());
    }

    filterFn(item: T) {
        if (this.filter) {
            return this.filter(item);
        }

        if (this.filterQuery && this.filterFields) {
            const q = this.filterQuery!.toLowerCase();
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
        if (changes.items) {
            if (this.items instanceof Observable) {
                this.items.subscribe((items: T[]) => {
                    this.sorted = items;
                    this.doSort();
                    this.viewport.checkViewportSize();
                })
            } else if (isArray(this.items)) {
                this.sorted = this.items;
                this.doSort();
                this.viewport.checkViewportSize();
            } else {
                this.sorted = [];
                this.doSort();
                this.viewport.checkViewportSize();
            }
        }

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

        const sortField = this.currentSort || this.defaultSort;
        this.sorted.sort((a: any, b: any) => {
            if ((this.currentSortDirection || this.defaultSortDirection) === 'asc') {
                if (a[sortField] > b[sortField]) return 1;
                if (a[sortField] < b[sortField]) return -1;
            } else {
                if (a[sortField] > b[sortField]) return -1;
                if (a[sortField] < b[sortField]) return 1;
            }

            return 0;
        });

        this.sortedChange.emit(this.sorted);
        this.height = (this.sorted.length * this.itemHeight) + (this.showHeader ? 23 : 0);

        this.sorted = this.sorted.slice(0);
        this.parentCd.detectChanges();
        this.cd.detectChanges();
    }

    /**
     * @hidden
     */
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
                if (empty(this.sorted)) {
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

                const scrollTop = this.viewport.measureScrollOffset();
                const viewportSize = this.viewport.getViewportSize();
                const itemTop = this.itemHeight * index;

                if (itemTop + this.itemHeight > viewportSize + scrollTop) {
                    const diff = (itemTop + this.itemHeight) - (viewportSize + scrollTop);
                    this.viewport.scrollToOffset(scrollTop + diff);
                }

                if (itemTop < scrollTop) {
                    const diff = (itemTop) - (scrollTop);
                    this.viewport.scrollToOffset(scrollTop + diff);
                }
            }
            this.selectedChange.emit(this.selected);
            this.cd.markForCheck();
        }
    }

    private select(item: T, $event?: MouseEvent) {
        if (this.selectable === false) {
            return;
        }

        if (this.multiSelect === false) {
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
    }
}
