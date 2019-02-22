import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import {WindowSidebarComponent} from "./window-sidebar.component";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
    selector: 'dui-window-content',
    template: `
        <div class="sidebar" #sidebar *ngIf="toolbar">
            <div class="sidebar-container" #sidebarContainer>
                <ng-container [ngTemplateOutlet]="toolbar!.template" [ngTemplateOutletContext]="{}"></ng-container>
            </div>
        </div>

        <div class="content" #content>
            <ng-content></ng-content>
        </div>
    `,
    host: {
        '[class.sidebar-invisible]': '!sidebarVisible',
    },
    styleUrls: ['./window-content.component.scss'],
})
export class WindowContentComponent implements OnChanges {
    @Input() sidebarVisible: boolean = true;

    @ContentChild(WindowSidebarComponent) toolbar?: WindowSidebarComponent;

    @ViewChild('sidebar') public sidebar?: ElementRef;
    @ViewChild('sidebarContainer') public sidebarContainer?: ElementRef;
    @ViewChild('content') public content?: ElementRef;

    private resetSidebarContainerWidthTimer: any;

    public readonly sidebarVisibleChanged = new BehaviorSubject(this.sidebarVisible);

    constructor(private element: ElementRef) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.sidebar && this.sidebarContainer) {
            clearTimeout(this.resetSidebarContainerWidthTimer);

            if (changes.sidebarVisible) {
                if (!this.sidebarVisible) {
                    (this.sidebarContainer.nativeElement as HTMLElement).style.width = ((this.sidebar.nativeElement as HTMLElement).offsetWidth) + 'px';
                } else {
                    this.resetSidebarContainerWidthTimer = setTimeout(() => {
                        if (this.sidebarContainer) {
                            (this.sidebarContainer.nativeElement as HTMLElement).style.width = null;
                        }
                    }, 300);
                }
                this.sidebarVisibleChanged.next(this.sidebarVisible);
            }
        }
    }

    public getSidebarWidth(): number {
        if (this.sidebarContainer) {
            return (this.sidebarContainer.nativeElement as HTMLElement).offsetWidth;
        }

        return 0;
    }

    public isSidebarVisible(): boolean {
        return undefined !== this.sidebar && this.sidebarVisible;
    }
}
