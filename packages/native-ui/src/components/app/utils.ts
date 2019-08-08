import {Directive, ElementRef, HostListener, Input, OnChanges} from "@angular/core";

const electron = (window as any).electron || ((window as any).require ? (window as any).require('electron') : undefined);

export class Electron {
    public static getRemote(): any {
        if (!electron) {
            throw new Error('No Electron available.');
        }

        return electron.remote;
    }

    public static isAvailable(): any {
        return !!electron;
    }

    public static getRemoteOrUndefined(): any {
        return electron ? electron.remote : undefined;
    }

    public static getProcess() {
        return Electron.getRemote().process;
    }
}


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
