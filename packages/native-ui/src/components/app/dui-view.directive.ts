import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef} from "@angular/core";

@Directive({
    selector: '[duiView]',
})
export class HiddenDirective {
    protected view?: EmbeddedViewRef<any>;

    protected visible = false;

    constructor(
        protected template: TemplateRef<any>,
        protected viewContainer: ViewContainerRef,
    ) {

    }

    @Input()
    set duiView(v: boolean) {
        if (this.visible === v) return;

        this.visible = v;

        if (this.visible) {
            if (this.view) {
                this.view.reattach();
                this.view.rootNodes.map(element => element.style.display = '');
                this.view.rootNodes.map(element => element.dispatchEvent(new Event('reattach')));
                return;
            }

            this.view = this.viewContainer.createEmbeddedView(this.template);
        } else {
            if (this.view) {
                this.view.detach();
                this.view.rootNodes.map(element => element.dispatchEvent(new Event('detach')));
                this.view.rootNodes.map(element => element.style.display = 'none');
            }
        }

    }
}
