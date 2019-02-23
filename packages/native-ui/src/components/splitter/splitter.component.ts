import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import * as Hammer from 'hammerjs';

@Component({
    selector: 'dui-splitter',
    template: '',
    styleUrls: ['./splitter.component.scss'],
    host: {
        '[class.right]': 'position === "right"',
        '[class.with-indicator]': 'indicator !== false',
    }
})
export class SplitterComponent implements AfterViewInit {
    @Input() model?: number;
    @Output() modelChange = new EventEmitter<number>();

    @Input() indicator: boolean = false;

    @Input() position: 'right' | 'left' | 'top' | 'bottom' = 'right';

    @Input() element?: HTMLElement;

    constructor(private host: ElementRef) {

    }

    ngAfterViewInit(): void {
        const mc = new Hammer(this.host.nativeElement);
        mc.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );

        if (!this.element) {
            return;
        }

        let startWidth: number = 0;

        this.host.nativeElement.addEventListener('click', (e: MouseEvent)  => {
           e.preventDefault();
           e.stopPropagation();
        });

        this.host.nativeElement.addEventListener('mousedown', (e: MouseEvent)  => {
           e.preventDefault();
           e.stopPropagation();
        });

        mc.on('panstart', (event: HammerInput) => {
            startWidth = this.model || (this.element ? this.element.clientWidth : 0);
        });

        mc.on('pan', (event: HammerInput) => {
            // console.log('pan', startWidth + event.deltaX, event);

            if (!this.element) return;

            this.element.style.width = (startWidth + event.deltaX) + 'px';

            this.model = (startWidth + event.deltaX);
            this.modelChange.emit(startWidth + event.deltaX);
        })
    }
}
