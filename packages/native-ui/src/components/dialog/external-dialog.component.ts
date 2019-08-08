import {
    AfterViewInit,
    ApplicationRef,
    Component,
    ComponentFactoryResolver, Directive, EventEmitter, HostListener,
    Injector, Input, OnChanges, OnDestroy, Output, SimpleChanges,
    TemplateRef, ViewChild,
    ViewContainerRef
} from "@angular/core";
import {DomPortalHost, PortalHost, TemplatePortal} from "@angular/cdk/portal";

function PopupCenter(url: string, title: string, w: number, h: number): Window {
    let top = window.screenTop + (window.outerHeight / 2) - w / 2;
    top = top > 0 ? top : 0;

    let left = window.screenLeft + (window.outerWidth / 2) - w / 2;
    left = left > 0 ? left : 0;

    const newWindow: Window = window.open(url, title, 'alwaysRaised,scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)!;

    // Puts focus on the newWindow
    if (window.focus) newWindow.focus();

    return newWindow;
}

@Component({
    selector: 'dui-external-dialog',
    template: `
        <ng-template #template>
            <ng-content></ng-content>
        </ng-template>
    `,
})
export class ExternalDialogComponent implements AfterViewInit, OnDestroy, OnChanges {
    private portalHost?: PortalHost;

    //todo implement that
    @Input() alwaysRaised: boolean = true;

    @Input() visible: boolean = true;
    @Output() visibleChange = new EventEmitter<boolean>();

    @ViewChild('template') template?: TemplateRef<any>;

    externalWindow?: Window;

    observerStyles?: MutationObserver;
    observerClass?: MutationObserver;

    constructor(
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected applicationRef: ApplicationRef,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.visible) {
            this.show();
        } else {
            this.close();
        }
    }

    public show() {
        if (this.externalWindow) {
            return;
        }

        this.externalWindow = PopupCenter('', '', 300, 300);

        this.externalWindow.onunload = () => {
            this.close();
        };

        const cloned = new Map<Node, Node>();

        for (let i = 0; i < window.document.styleSheets.length; i++) {
            const style = window.document.styleSheets[i];
            const clone: Node = style.ownerNode.cloneNode(true);
            cloned.set(style.ownerNode, clone);
            this.externalWindow!.document.head!.appendChild(clone);
        }

        this.observerStyles = new MutationObserver((mutations: MutationRecord[]) => {
            for (const mutation of mutations) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (!cloned.has(node)) {
                        const clone: Node = node.cloneNode(true);
                        cloned.set(node, clone);
                        this.externalWindow!.document.head!.appendChild(clone);
                    }
                }

                for (let i = 0; i < mutation.removedNodes.length; i++) {
                    const node = mutation.removedNodes[i];
                    if (cloned.has(node)) {
                        const clone = cloned.get(node)!;
                        clone.parentNode!.removeChild(clone);
                        cloned.delete(node);
                    }
                }
            }
        });

        this.observerStyles.observe(window.document.head!, {
            childList: true,
        });

        const copyBodyClass = () => {
            if (this.externalWindow) {
                this.externalWindow.document.body.className = window.document.body.className;
            }
        };

        this.observerClass = new MutationObserver((mutations: MutationRecord[]) => {
            copyBodyClass();
        });

        this.observerClass.observe(window.document.body, {
            attributeFilter: ['class']
        });
        copyBodyClass();

        window.addEventListener('beforeunload', () => {
            this.beforeUnload();
        });

        this.portalHost = new DomPortalHost(
            this.externalWindow!.document.body,
            this.componentFactoryResolver,
            this.applicationRef,
            this.injector
        );

        if (this.template && this.portalHost) {
            const portal = new TemplatePortal(
                this.template!,
                this.viewContainerRef
            );

            this.portalHost.attach(portal);
        }
    }

    beforeUnload() {
        if (this.externalWindow) {
            if (this.portalHost) {
                this.portalHost.detach();
                this.portalHost.dispose();
                delete this.portalHost;
            }
            this.externalWindow!.close();
            delete this.externalWindow;
            this.observerStyles!.disconnect();
            this.observerClass!.disconnect();
        }
    }

    ngAfterViewInit() {
    }

    public close() {
        this.visible = false;
        this.visibleChange.emit(false);
        this.beforeUnload();
        requestAnimationFrame(() => {
            this.applicationRef.tick();
        });
    }

    ngOnDestroy(): void {
        this.beforeUnload();
    }
}
