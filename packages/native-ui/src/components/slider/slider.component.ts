import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Injector,
    Input,
    SkipSelf,
    ViewChild
} from "@angular/core";
import {ngValueAccessor, ValueAccessorBase} from "../../core/form";
import * as Hammer from "hammerjs";

@Component({
    selector: 'dui-slider',
    template: `
        <div class="bg"></div>
        <div class="knob-container">
            <div [style.width.%]="getValue() * 100" class="active-line"></div>
            <div #knob [style.left.%]="getValue() * 100" class="knob"></div>
        </div>
    `,
    styleUrls: ['./slider.component.scss'],
    providers: [ngValueAccessor(SliderComponent)]
})
export class SliderComponent extends ValueAccessorBase<number> implements AfterViewInit {
    @ViewChild('knob', {static: true}) knob?: ElementRef;

    @Input() min = 0;
    @Input() steps = 0.01;
    @Input() max = 1;

    constructor(
        protected injector: Injector,
        protected cd: ChangeDetectorRef,
        @SkipSelf() protected cdParent: ChangeDetectorRef,
        protected element: ElementRef,
    ) {
        super(injector, cd, cdParent);
    }

    getValue(): number {
        return Math.max(0, Math.min(1, ((this.innerValue || 0) / (this.max - this.min))));
    }

    ngAfterViewInit() {
        const mc = new Hammer(this.knob!.nativeElement);
        mc.add(new Hammer.Pan({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 1}));

        let startXInPixels = 0;
        const width = (this.element!.nativeElement.offsetWidth - 17);
        let lastRequest: any;

        mc.on('panstart', (event: HammerInput) => {
            startXInPixels = this.getValue() * width;
        });

        mc.on('pan', (event: HammerInput) => {
            if (lastRequest) {
                cancelAnimationFrame(lastRequest);
            }

            lastRequest = requestAnimationFrame(() => {
                const newLeft = Math.min(width, Math.max(0, (startXInPixels + event.deltaX))) / width;

                let newPotentialValue = newLeft * (this.max - this.min);
                const shift = (newPotentialValue % this.steps);
                this.innerValue = newPotentialValue - shift;
            });
        });
    }
}
