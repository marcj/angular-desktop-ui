import {ChangeDetectorRef, Directive, ElementRef, HostListener, Input, OnChanges} from "@angular/core";
import {Electron} from "../../core/utils";


@Directive({
    selector: '[openExternal]',
})
export class OpenExternalDirective implements OnChanges {
    @Input('openExternal') private openExternal: string = '';

    constructor(private element: ElementRef) {
        this.element.nativeElement.href = '#';
    }

    ngOnChanges(): void {
        this.element.nativeElement.href = this.openExternal;
    }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        if (Electron.isAvailable()) {
            event.preventDefault();
            Electron.getRemote().shell.openExternal(this.openExternal);
        }
    }
}


let lastFrameRequest: any;
let lastFrameRequestStack = new Set<ChangeDetectorRef>();

/**
 * This handy function makes sure that in the next animation frame the given ChangeDetectorRef is called.
 * It makes automatically sure that it is only called once per frame.
 */
export function detectChangesNextFrame(cd: ChangeDetectorRef) {
    if (lastFrameRequest) {
        cancelAnimationFrame(lastFrameRequest);
    }

    lastFrameRequestStack.add(cd);

    requestAnimationFrame(() => {
        for (const i of lastFrameRequestStack) {
            i.detectChanges();
        }
        lastFrameRequestStack.clear();
    });
}
