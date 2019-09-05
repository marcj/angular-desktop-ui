import {Component, Input} from "@angular/core";
import {Emoji, emojis} from "./emojis";

@Component({
    selector: 'dui-emoji',
    template: `
        <div class="emoji-image"
             *ngIf="emoji as em"
             [style.transform]="'scale(' + (1/32*size) +')'"
             [style.backgroundPosition]="-((em.x * 34) + 1) + 'px ' + -((em.y * 34) + 1) + 'px'"></div>
    `,
    host: {
        '[style.height.px]': 'size',
        '[style.width.px]': 'size',
    },
    styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent {
    @Input() name!: string;
    @Input() size: number = 16;

    get emoji(): Emoji {
        return emojis[this.name];
    }
}
