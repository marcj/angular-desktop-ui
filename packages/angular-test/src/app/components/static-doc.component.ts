import {
    Compiler,
    Component,
    ComponentRef,
    NgModule,
    ViewChild,
    ViewContainerRef,
    Input,
    OnChanges,
    SimpleChanges,
    ComponentFactoryResolver,
    AfterViewInit, forwardRef, ChangeDetectorRef, ContentChildren, QueryList
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import * as hljs from 'highlight.js';
import {RegisteredDocComponents} from "../decorators";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../app-routing.module";
import {AppModule} from "../app.module";
import {
    DuiButtonModule,
    DuiCheckboxModule,
    DuiFormComponent,
    DuiInputModule,
    DuiRadioboxModule,
    DuiSelectModule,
    DuiWindowModule,
    DuiIconModule,
    DuiListModule,
    DuiTableModule,
} from '@marcj/angular-desktop-ui';

@Component({
    selector: 'highlighter',
    template: `<code class="hljs" [innerHtml]="highlighted"></code>`,
    styles: [`
        :host {
            display: block;
            white-space: pre;
            margin: 15px 0;
        }

        .hljs {
            background: #f6f7fb;
        }
    `]
})
class Highlighter implements OnChanges {
    @Input() code: string;
    @Input() type: string;

    highlighted: string;

    ngOnChanges(changes: SimpleChanges): void {
        const type = decodeURIComponent(this.type);
        let code = decodeURIComponent(this.code);

        const language = type.lastIndexOf('/') > 0 ? type.substr(type.lastIndexOf('/') + 1) : type;

        code = code.replace(/^[\n]+|[\n\s]+$/g, "");

        //remove first intend
        const indent = code.match(/^[\s]*/)[0].length;
        const regEx = new RegExp('^ {' + indent + '}', 'gm');
        code = code.replace(regEx, '');

        this.highlighted = hljs.highlightAuto(code, [language]).value;
    }

    public getType() {
        const type = decodeURIComponent(this.type);
        return type.lastIndexOf('/') > 0 ? type.substr(type.lastIndexOf('/') + 1) : type;
    }

    public getCode() {
        return decodeURIComponent(this.code);
    }
}


@Component({
    selector: 'dui-code-frame',
    template: `
        <dui-window-frame [height]="show === '' ? height : undefined">
            <div style="text-align: center;position: absolute; left: 0; right: 0; top: -40px;">
                <dui-button-group padding="none">
                    <dui-button (click)="showPage('')" [active]="show === ''">Preview</dui-button>
                    <dui-button *ngIf="hasType('html')" (click)="showPage('html')" [active]="show === 'html'">HTML</dui-button>
                    <dui-button *ngIf="hasType('typescript')" (click)="showPage('typescript')" [active]="show === 'ts'">TS</dui-button>
                    <dui-button *ngIf="hasType('scss')" (click)="showPage('scss')" [active]="show === 'scss'">SCSS</dui-button>
                </dui-button-group>
            </div>
            
            <div *ngIf="show === 'html'">
                <dui-window>
                    <dui-window-header>Source code</dui-window-header>
                    <dui-window-content>
                        <ng-content select="highlighter[type=html]"></ng-content>
                    </dui-window-content>
                </dui-window>
            </div>
            
            <div *ngIf="show === 'typescript'">
                <dui-window>
                    <dui-window-header>Source code</dui-window-header>
                    <dui-window-content>
                        <ng-content select="highlighter[type=typescript]"></ng-content>
                    </dui-window-content>
                </dui-window>
            </div>
            
            <div *ngIf="show === 'scss'">
                <dui-window>
                    <dui-window-header>Source code</dui-window-header>
                    <dui-window-content>
                        <ng-content select="highlighter[type=scss]"></ng-content>
                    </dui-window-content>
                </dui-window>
            </div>

            <ng-container *ngIf="show === ''">
                <ng-content></ng-content>
            </ng-container>
        </dui-window-frame>
    `,
    styles: [`
        :host ::ng-deep highlighter {
            margin: 0;
        }

        :host ::ng-deep .hljs {
            background: transparent !important;
        }
    `]
})
export class CodeFrameComponent implements AfterViewInit {
    @ContentChildren(Highlighter) highlights!: QueryList<Highlighter>;

    @Input() height = 300;

    show: '' | 'html' | 'typescript' | 'scss' = '';

    showPage(show: '' | 'html' | 'typescript' | 'scss') {
        this.show = show;
    }

    public hasType(name: string): boolean {
        return Boolean(this.getHighlightForType(name));
    }

    ngAfterViewInit(): void {
    }

    public getHighlightForType(name: string): Highlighter | undefined {
        for (const h of this.highlights.toArray()) {
            if (h.getType() === name) {
                return h;
            }
        }

        return;
    }
}

@NgModule({
    declarations: [
        Highlighter,
        CodeFrameComponent,
    ],
    imports: [
        DuiButtonModule,
        CommonModule,
        DuiWindowModule,
        DuiWindowModule,
        DuiWindowModule,
    ],
    exports: [
        Highlighter,
        CodeFrameComponent,
    ]
})
class PageModule {
}

const regexScript = /<script\s+type="([^"]+)"\s?((?:component)?)>([\s\S]+?(?=<\/script>))<\/script>/;
const regexCodeBlock = /^```([a-zA-Z0-9]*)\n(\/\/@angular\n)?([\s\S]*?)\n```/gm;

@Component({
    template: `
        <div *ngIf="loading">Loading ...</div>
        <div #container></div>
    `,
    styleUrls: ['./static-doc.component.scss']
})
export class StaticDocComponent implements AfterViewInit {
    public loading = false;
    protected component?: ComponentRef<any>;
    protected componentJavascript = '';

    @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private compiler: Compiler,
        private resolver: ComponentFactoryResolver,
        private cd: ChangeDetectorRef,
    ) {
    }

    ngAfterViewInit(): void {
        this.route.params.subscribe((params) => {

            setTimeout(() => {
                this.loadDoc(params.id)
            });
        })
    }

    protected async loadDoc(name: string) {
        if (this.component) {
            this.component.destroy();
        }

        this.componentJavascript = '';
        if (RegisteredDocComponents[name]) {
            const factory = this.resolver.resolveComponentFactory(RegisteredDocComponents[name]);
            this.component = this.container.createComponent(factory);
            return;
        }

        this.loading = true;
        this.cd.detectChanges();
        const content = await this.http.get('/assets/docs/' + name + '.md', {responseType: "text"}).toPromise();

        this.loading = false;
        this.addComponent(this.parseHtml(content));
        this.cd.detectChanges();
    }

    private parseHtml(content: string) {
        while (content.match(regexScript)) {
            content = content.replace(regexScript, (match, a, component, b) => {
                if (component) {
                    this.componentJavascript = b;
                    return '';
                }

                return `<highlighter code="${encodeURIComponent(b)}" type="${encodeURIComponent(a)}"></highlighter>`
            });
        }

        while (content.match(regexCodeBlock)) {
            content = content.replace(regexCodeBlock, (match, name, isAngular, code) => {
                if (isAngular) {
                    this.componentJavascript = code;
                    return '';
                }

                return `${name === 'html' ? code : ''}<highlighter code="${encodeURIComponent(code)}" type="${encodeURIComponent(name)}"></highlighter>`
            });
        }

        // console.log(content);
        return content;
    }

    private addComponent(template: string) {
        if (this.component) {
            this.component.destroy();
        }

        let properties = {};

        if (this.componentJavascript) {
            const js = this.componentJavascript.replace(/^[\n\s]+|[\n\s]+$/g, "");
            properties = new Function(`${js};`)();

        }

        @Component({template})
        class TemplateComponent {
            constructor() {
                for (const i in properties) {
                    this[i] = properties[i];
                }
            }
        }

        @NgModule({
            declarations: [TemplateComponent],
            imports: [
                PageModule,
                forwardRef(() => AppModule),
                forwardRef(() => AppRoutingModule),
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                DuiCheckboxModule,
                DuiButtonModule,
                DuiInputModule,
                DuiFormComponent,
                DuiRadioboxModule,
                DuiSelectModule,
                DuiWindowModule,
                DuiIconModule,
                DuiListModule,
                DuiTableModule,
            ]
        })
        class TemplateModule {
        }

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);

        const factory = mod.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );

        this.component = this.container.createComponent(factory);
    }
}
