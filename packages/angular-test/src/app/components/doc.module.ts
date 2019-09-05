import {
    AfterViewInit,
    ChangeDetectorRef,
    Compiler,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChildren,
    Injectable,
    Input,
    ModuleWithProviders,
    NgModule,
    OnChanges,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import * as hljs from 'highlight.js';
import {RegisteredDocComponents} from "../decorators";
import {DuiButtonModule, DuiWindowModule, DuiTableModule, DuiInputModule} from '@marcj/angular-desktop-ui';
import {stack} from "@marcj/estdlib";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {Converter} from 'showdown';

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
    @Input() code!: string;
    @Input() type!: string;

    highlighted?: string;

    ngOnChanges(changes: SimpleChanges): void {
        const type = decodeURIComponent(this.type);
        let code = decodeURIComponent(this.code);

        const language = type.lastIndexOf('/') > 0 ? type.substr(type.lastIndexOf('/') + 1) : type;

        code = code.replace(/^[\n]+|[\n\s]+$/g, "");

        //remove first intend
        const match = code.match(/^[\s]*/);
        if (match && match[0]) {
            const indent = match[0].length;
            const regEx = new RegExp('^ {' + indent + '}', 'gm');
            code = code.replace(regEx, '');
        }

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
                    <dui-button *ngIf="hasType('html')" (click)="showPage('html')" [active]="show === 'html'">HTML
                    </dui-button>
                    <dui-button *ngIf="hasType('typescript')" (click)="showPage('typescript')"
                                [active]="show === 'typescript'">TS
                    </dui-button>
                    <dui-button *ngIf="hasType('scss')" (click)="showPage('scss')" [active]="show === 'scss'">SCSS
                    </dui-button>
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


type ApiDocFlags = {
    isProtected?: true,
    isPrivate?: true,
    isExported?: true
};
type ApiDocGroups = { title: string, kind: number, children: number[] }[];
type ApiDocSources = { fileName: string, line: number, character: number }[];
type ApiDocType = { type: string, name: string, types?: ApiDocType[], typeArguments?: ApiDocType[] };


interface ApiDocItemDecorator {
    name: string;
    arguments: { [name: string]: any }
    type: { type: string, name: string }
}

type ApiDocDecorators = ApiDocItemDecorator[];


interface ApiDocItemClassChildConstructor {
    id: number;
    kind: 512;
    name: "constructor";
    kindString: "Constructor";
    flags: ApiDocFlags;
    signature: any[];
    sources: ApiDocSources;
    decorators: undefined;
}

interface ApiDocItemClassChildMethod {
    id: number;
    name: string
    kind: 2048;
    kindString: "Method";

    //todo really?
    comment?: { shortText: string };

    inheritedFrom?: {
        type: string;
        name: string;
        id: number;
    };

    signatures: {
        id: number,
        name: string,
        kind: number,
        kindString: string,
        flags: ApiDocFlags,
        type: ApiDocType
    }[];
    flags: ApiDocFlags;
    decorators?: ApiDocDecorators;

    sources: ApiDocSources;
    type?: ApiDocType;
    defaultValue: string;
}

interface ApiDocItemClassChildProperty {
    id: number;
    name: string
    kind: 1024;
    kindString: "Property";

    comment?: { shortText: string };

    flags: ApiDocFlags;
    decorators?: ApiDocDecorators;

    sources: ApiDocSources;
    type?: ApiDocType;
    defaultValue: string;
}

interface ApiDocItemChildClass {
    id: number;
    name: string;
    kind: 128;
    kindString: 'Class';

    comment?: { shortText: string, text?: string };

    flags: ApiDocFlags;
    decorators: ApiDocDecorators;
    children?: (ApiDocItemClassChildProperty | ApiDocItemClassChildConstructor | ApiDocItemClassChildMethod)[];

    groups: ApiDocGroups;
    sources: ApiDocSources;
}

interface ApiDocModule {
    id: number;
    name: string;
    kind: 1;
    kindString: "External module";
    flags: ApiDocFlags;
    originalName: string;
    children: (ApiDocItemChildClass)[];

    groups: ApiDocGroups;
    sources: ApiDocSources;
}

interface ApiDocPackage {
    id: number;
    name: string;
    kind: number;
    flags: ApiDocFlags;

    children: (ApiDocModule)[]
    groups: ApiDocGroups;
}

export function typeToString(type?: ApiDocType): string {
    if (!type) return '';

    if (type.types) {
        return '(' + type.types.map(v => typeToString(v)).join(' | ') + ')';
    }

    if (type.typeArguments) {
        return type.name + '<' + type.typeArguments.map(v => typeToString(v)).join(' | ') + '>';
    }

    return type.name;
}

@Injectable()
export class ApiDocProvider {
    protected docs?: any;

    constructor(private httpClient: HttpClient) {
    }

    @stack()
    async getDocs(): Promise<ApiDocPackage> {
        if (this.docs === undefined) {
            this.docs = await this.httpClient.get('assets/docs.json').toPromise();
        }

        return this.docs;
    }

    async findDocForComponent(module: string, component: string): Promise<ApiDocItemChildClass> {
        const docs = await this.getDocs();

        for (const child of docs.children) {
            if (JSON.parse(child.name) === module) {

                for (const compChild of child.children) {
                    if (compChild.name === component && compChild.kind === 128) {
                        return compChild;
                    }
                }

                console.debug('available components', child.children.map(v => v.name));
                throw new Error(`No component ${component} found in ${module}.`);
            }
        }

        console.debug('available modules', docs.children.map(v => v.name));
        throw new Error(`No module ${module} found.`);
    }
}


@Component({
    selector: 'api-doc',
    template: `
        <div class="title">
            <h2 style="float: left; margin: 0;">API <code>{{selector}}</code></h2>

            <dui-input *ngIf="tableData.length" icon="search" placeholder="Search" [(ngModel)]="filterQuery"
                       clearer></dui-input>
        </div>

        <p *ngIf="comment" [innerHTML]="comment">
        </p>

        <dui-table
                autoHeight
                *ngIf="tableData.length"
                [items]="tableData" 
                [selectable]="true"
                [filterQuery]="filterQuery"
                [filterFields]="['name', 'type', 'dataType', 'comment']"
                noFocusOutline
        >
            <dui-table-column name="name" header="Name" [width]="240">
                <ng-container *duiTableCell="let row">
                    <ng-container *ngIf="row.type === 'input'">
                        @Input()
                    </ng-container>

                    <ng-container *ngIf="row.type === 'output'">
                        @Output()
                    </ng-container>

                    {{row.name}}
                </ng-container>
            </dui-table-column>
            <dui-table-column name="dataType" header="Type" [width]="150"></dui-table-column>
            <dui-table-column name="comment" header="Description" width="100%"></dui-table-column>
        </dui-table>
    `,
    styleUrls: ['./api-doc.component.scss']
})
export class ApiDocComponent implements OnChanges {
    @Input() module!: string;
    @Input() component!: string;

    comment = '';

    selector = '';
    filterQuery = '';
    tableData: { name: string, type: 'input' | 'output' | 'method', dataType: string, comment: string }[] = [];

    constructor(
        private apiDocProvider: ApiDocProvider,
        private cd: ChangeDetectorRef,
    ) {

    }

    async ngOnChanges(changes: SimpleChanges) {
        const docs = await this.apiDocProvider.findDocForComponent(this.module, this.component);
        this.tableData = [];

        for (const decorator of docs.decorators) {
            if (decorator.name === "Component" || decorator.name === "Directive") {
                const match = decorator.arguments.obj.match(/['"]?selector['"]?\s?:\s?['"]+([^'"]+)['"]+/i);
                this.selector = match[1];
            }
        }

        if (docs.comment) {
            this.comment = docs.comment.shortText;
            if (docs.comment.text) {
                this.comment += '</br>' + docs.comment.text;
            }
            const converter = new Converter;
            this.comment = converter.makeHtml(this.comment);
        }

        if (docs.children) {
            for (const prop of docs.children) {
                if (prop.kindString === "Property" && prop.decorators) {
                    for (const decorator of prop.decorators) {
                        if (decorator.name === "Input") {
                            this.tableData.push({
                                name: prop.name,
                                type: 'input',
                                dataType: typeToString(prop.type),
                                comment: prop.comment ? prop.comment.shortText : ''
                            });
                        }

                        if (decorator.name === "Output") {
                            this.tableData.push({
                                name: prop.name,
                                type: 'output',
                                dataType: typeToString(prop.type),
                                comment: prop.comment ? prop.comment.shortText : ''
                            });
                        }
                    }
                }

                if (prop.kindString === "Method" && !prop.flags.isProtected && !prop.flags.isPrivate) {
                    if (prop.name.startsWith('ng')) continue;

                    this.tableData.push({
                        name: prop.name,
                        type: 'method',
                        dataType: typeToString(prop.signatures[0].type),
                        comment: prop.comment ? prop.comment.shortText : ''
                    });
                }
            }
        }

        this.cd.detectChanges();
    }
}


const regexScript = /<script\s+type="([^"]+)"\s?((?:component)?)>([\s\S]+?(?=<\/script>))<\/script>/;
const regexCodeBlock = /^```([a-zA-Z0-9]*)\n(\/\/@angular\n)?([\s\S]*?)\n```/gm;

@Component({
    template: `
        <div *ngIf="loading">Loading ...</div>
        <div #container></div>
    `
})
export class MarkdownDocComponent implements AfterViewInit {
    public loading = false;
    protected component?: ComponentRef<any>;
    protected componentJavascript = '';

    @ViewChild('container', {read: ViewContainerRef, static: false}) container!: ViewContainerRef;

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
                    (this as any)[i] = (properties as any)[i];
                }
            }
        }

        @NgModule({
            declarations: [TemplateComponent],
            imports: [DocModule, DocModule.parent.__annotations__[0].imports]
        })
        class TemplateModule {
        }

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);

        const factory = mod.componentFactories.find((comp) =>
            comp.componentType === TemplateComponent
        );

        if (factory) {
            this.component = this.container.createComponent(factory);
        }
    }
}


@NgModule({
    declarations: [
        Highlighter,
        CodeFrameComponent,
        ApiDocComponent,
        MarkdownDocComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        HttpClientModule,
        DuiButtonModule,
        DuiWindowModule,
        DuiTableModule,
        DuiInputModule,
    ],
    exports: [
        Highlighter,
        CodeFrameComponent,
        ApiDocComponent,
    ]
})
export class DocModule {
    public static parent: any;

    static forRoot(parent: any): ModuleWithProviders {
        DocModule.parent = parent;
        return {
            ngModule: DocModule,
            providers: [
                ApiDocProvider
            ]
        };
    }
}
