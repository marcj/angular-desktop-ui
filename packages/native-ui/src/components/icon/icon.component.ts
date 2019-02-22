import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'dui-icon',
    template: `{{name}}`,
    host: {
        '[class.ui-icon]': 'true',
        '[style.fontSize.px]': 'size',
        '[style.height.px]': 'size',
        '[style.width.px]': 'size',
    },
    styles: [`
        :host {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            font-size: 17px;
            height: 17px;
            width: 17px;
            color: #565656;
        }
        
        :host-context(.dark) {
            color: white;
        }
    `]
})
export class IconComponent implements OnInit {
    @Input() name: string;
    @Input() size: number = 17;

    constructor() {
    }

    ngOnInit() {
    }
}
