import {Component, HostBinding, Input, OnInit} from '@angular/core';

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
        
        :host.disabled {
            opacity: 0.6;
        }
    `]
})
export class IconComponent implements OnInit {
    @Input() name?: string;
    @Input() size: number = 17;

    @Input() clickable: boolean = false;
    @HostBinding('class.clickable')
    get isClickable() {
        return false !== this.clickable;
    }

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    constructor() {
    }

    ngOnInit() {
    }
}
