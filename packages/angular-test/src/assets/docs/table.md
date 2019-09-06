<h1>Table</h1>

```typescript
import {DuiTableModule} from '@marcj/angular-desktop-ui';
```

```typescript
//@angular
return {
    items: [
        {title: 'first', i: 1, created: new Date}, 
        {title: 'second', i: 2, created: new Date},
        {title: 'another', i: 3, created: new Date},
        {title: 'yeah', i: 4, created: new Date},
        {title: 'peter', i: 5, created: new Date},
    ],
    selectedItems: [],
    itemName: '',
    remove: function() {
        for (var item of this.selectedItems) {
            this.items.splice(this.items.indexOf(item), 1);
        }
        this.items = this.items.slice(0);
        this.selectedItems = [];
    },
    addItem: function() {
        if (this.itemName) {
            this.items.push({title: this.itemName, i: this.items.length + 1, created: new Date});
            this.items = this.items.slice(0);
            this.itemName = '';
        }
    }
}
```

<dui-code-frame height="280">
```html
    <dui-window>
        <dui-window-header>
            Angular Desktop UI
        </dui-window-header>
        <dui-window-content>
            <p>With right click on the header, you can display additional columns.</p>
            <dui-table style="height: calc(100% - 80px)" multiSelect [items]="items" [selectable]="true" [(selected)]="selectedItems">
                <dui-dropdown duiTableCustomRowContextMenu>
                    <dui-dropdown-item [disabled]="!selectedItems.length" (click)="remove()">Delete</dui-dropdown-item>
                </dui-dropdown>
                <dui-table-column name="title" header="Title" [width]="150"></dui-table-column>
                <dui-table-column name="i" [width]="30"></dui-table-column>
                <dui-table-column name="created" header="Created">
                    <ng-container *duiTableCell="let row">
                        {{row.created|date:'mediumTime'}}
                    </ng-container>
                </dui-table-column>
                <dui-table-column name="columnA" header="Another A" hidden>
                    <ng-container *duiTableCell="let row">
                        I'm just A
                    </ng-container>
                </dui-table-column>
                <dui-table-column name="columnB" header="Another B" hidden>
                    <ng-container *duiTableCell="let row">
                        I'm just B
                    </ng-container>
                </dui-table-column>
            </dui-table>
            <dui-button-group padding="none" style="margin-top: 10px;">
                <dui-input (enter)="itemName && addItem()" [(ngModel)]="itemName" required></dui-input>
                <dui-button [disabled]="!selectedItems.length" (click)="remove()" square icon="remove"></dui-button>
                <dui-button (click)="addItem()" [disabled]="!itemName" square icon="add"></dui-button>
            </dui-button-group>
        </dui-window-content>
    </dui-window>
```

```typescript
export class MyWindow {
    items = [
        {title: 'first', i: 1, created: new Date}, 
        {title: 'second', i: 2, created: new Date},
        {title: 'another', i: 3, created: new Date},
        {title: 'yeah', i: 4, created: new Date},
        {title: 'peter', i: 5, created: new Date},
    ];
    
    selectedItems = [];
    
    itemName = '';
    
    remove(selected: any[]) {
        for (const item of this.selectedItems) {
            this.items.splice(this.items.indexOf(item), 1);
        }
        this.items = this.items.slice(0);
        this.selectedItems = [];
    }
    
    addItem() {
        if (this.itemName) {
            this.items.push({title: this.itemName, i: this.items.length + 1, created: new Date});
            this.items = this.items.slice(0);
            this.itemName = '';
        }
    }
}
```
</dui-code-frame>

<api-doc module="components/table/table.component" component="TableComponent"></api-doc>

<api-doc module="components/table/table.component" component="TableHeaderDirective"></api-doc>

<api-doc module="components/table/table.component" component="TableColumnDirective"></api-doc>

<api-doc module="components/table/table.component" component="TableCellDirective"></api-doc>
