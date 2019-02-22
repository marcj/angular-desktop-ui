import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    Output
} from "@angular/core";
import {WindowComponent} from "../window/window.component";
import {Subscription} from "rxjs";

@Component({
    selector: 'dui-button',
    template: `
        <dui-icon *ngIf="icon" [name]="icon" [size]="iconSize"></dui-icon>
        <ng-content></ng-content>
    `,
    host: {
        '[class.icon]': '!!icon',
        '[class.active]': 'active'
    },
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() icon?: string;
    @Input() iconSize?: number;

    @Input() active: boolean = false;

    @Input() disabled: boolean = false;
    @HostBinding('class.disabled')
    get isDisabled() {
        return false !== this.disabled;
    }

    @Input() square: boolean = false;

    @HostBinding('class.square')
    get isRound() {
        return false !== this.square;
    }
}

@Component({
    selector: 'dui-button-group',
    template: '<ng-content></ng-content>',
    styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements AfterViewInit, OnDestroy {
    @Input() float: 'static' | 'sidebar' | 'float' | 'right' = 'static';

    @Input() padding: 'normal' | 'none' = 'normal';

    @HostBinding('class.padding-none')
    get isPaddingNone() {
        return this.padding === 'none';
    }

    protected siderbarVisibleSubscription?: Subscription;

    @HostBinding('class.ready')
    protected init = false;

    constructor(
        private windowComponent: WindowComponent,
        private element: ElementRef,
    ) {
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
        this.init = true;

        if (this.float === 'sidebar') {
            const element = this.element.nativeElement as HTMLElement;

            if (this.windowComponent.content) {
                console.log('buttonGroup', 'afterViewInit');
                if (this.siderbarVisibleSubscription) {
                    this.siderbarVisibleSubscription.unsubscribe();
                }

                this.siderbarVisibleSubscription = this.windowComponent.content.sidebarVisibleChanged.subscribe((visible) => {
                    console.log('visible', visible, this.windowComponent.content!.getSidebarWidth());
                    if (visible) {
                        element.style.paddingLeft = (this.windowComponent.content!.getSidebarWidth() - element.offsetLeft) + 'px';
                    } else {
                        element.style.paddingLeft = '0px';
                    }
                });
            }
        }
    }
}
