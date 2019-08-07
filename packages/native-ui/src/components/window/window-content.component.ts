import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {WindowSidebarComponent} from "./window-sidebar.component";
import {Subject} from "rxjs";
import {WindowState} from "./window-state";

@Component({
    selector: 'dui-window-content',
    template: `
        <div class="sidebar" #sidebar *ngIf="toolbar">
            <div class="sidebar-container overlay-scrollbar" #sidebarContainer>
                <ng-container [ngTemplateOutlet]="toolbar!.template" [ngTemplateOutletContext]="{}"></ng-container>
            </div>
        </div>

        <div class="content" #content>
            <ng-content></ng-content>
        </div>
    `,
    styleUrls: ['./window-content.component.scss'],
})
export class WindowContentComponent implements OnChanges, AfterViewInit {
    @Input() sidebarVisible: boolean = true;
    @Input() protected sidebarWidth = 250;

    @ContentChild(WindowSidebarComponent) toolbar?: WindowSidebarComponent;

    @ViewChild('sidebar') public sidebar?: ElementRef<HTMLElement>;
    @ViewChild('sidebarContainer') public sidebarContainer?: ElementRef<HTMLElement>;
    @ViewChild('content') public content?: ElementRef<HTMLElement>;

    public readonly sidebarVisibleChanged = new Subject();

    constructor(private windowState: WindowState) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.sidebar && this.sidebarContainer) {
            if (changes.sidebarVisible) {
                this.handleSidebarVisibility(true);
                this.sidebarVisibleChanged.next(this.sidebarVisible);
            }
        }
    }

    ngAfterViewInit(): void {
        this.handleSidebarVisibility();
    }

    protected handleSidebarVisibility(withAnimation = false) {
        if (withAnimation && this.windowState.buttonGroupAlignedToSidebar) {
            this.windowState.buttonGroupAlignedToSidebar.activateOneTimeAnimation();
        }

        if (this.content) {
            if (this.sidebarVisible) {
                this.content.nativeElement.style.marginLeft = '0px';
            } else {
                this.content.nativeElement.style.marginLeft = (-this.sidebarWidth) + 'px';
            }
        }
    }

    public getSidebarWidth(): number {
        return this.sidebarWidth;
    }

    public isSidebarVisible(): boolean {
        return undefined !== this.sidebar && this.sidebarVisible;
    }
}
