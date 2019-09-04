import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import * as Hammer from 'hammerjs';

@Component({
    selector: 'dui-splitter',
    template: '',
    styleUrls: ['./splitter.component.scss'],
    host: {
        '[class.right]': 'position === "right"',
        '[class.left]': 'position === "left"',
        '[class.top]': 'position === "top"',
        '[class.bottom]': 'position === "bottom"',
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
        mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_ALL, threshold: 0}));

        // if (!this.element) {
        //     return;
        // }

        let start: number = 0;

        this.host.nativeElement.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.host.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
        });

        mc.on('panstart', (event: HammerInput) => {
            if (this.position === 'right' || this.position === 'left') {
                start = (this.element ? this.element.clientWidth : this.host.nativeElement!.parentElement.clientWidth);
            } else {
                start = (this.element ? this.element.clientHeight : this.host.nativeElement!.parentElement.clientHeight);
            }
        });

        mc.on('pan', (event: HammerInput) => {

            if (this.element) {
                this.element.style.width = (start + event.deltaX) + 'px';
            }

            if (this.position === 'right') {
                this.model = (start + event.deltaX);
                this.modelChange.emit(start + event.deltaX);
                this.triggerWindowResize();
            } else if (this.position === 'left') {
                this.model = (start - event.deltaX);
                this.modelChange.emit(start - event.deltaX);
                this.triggerWindowResize();
            } else if (this.position === 'top') {
                this.model = (start - event.deltaY);
                this.modelChange.emit(start - event.deltaY);
                this.triggerWindowResize();
            } else if (this.position === 'bottom') {
                this.model = (start + event.deltaY);
                this.modelChange.emit(start + event.deltaY);
                this.triggerWindowResize();
            }
        })
    }

    protected triggerWindowResize() {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        });
    }
}
