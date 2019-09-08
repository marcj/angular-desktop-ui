import {Directive, ElementRef, HostListener, Input, OnChanges} from "@angular/core";
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
