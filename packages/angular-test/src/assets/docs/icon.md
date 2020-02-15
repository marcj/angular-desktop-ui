<h1>Icon</h1>

<p>
    This library comes with own set of icons you can use in dui-button, dui-input and dui-icon. All icons are available as SVGs and are compiled to
    a font file you should import in your angular config. See the getting started page to know how to install the font correctly.
</p>


```html
<dui-icon name="flag" [size]="8"></dui-icon>
<dui-icon name="flag"></dui-icon>
<dui-icon name="flag" [size]="24"></dui-icon>
<p>
    <dui-button icon="flag">My button</dui-button>
    <dui-button icon="flag" iconRight>My Butt</dui-button>
    <dui-button icon="check">Check</dui-button>
    <dui-button icon="star">Star</dui-button>
</p>
<p>
    <dui-button icon="arrow_down" tight>Dropdown</dui-button>
    <dui-button icon="arrow_down" tight iconRight>Dropdown</dui-button>
</p>
<p>
    <dui-button icon="flag" small></dui-button> Icon button
</p>
<p>
    <dui-input round placeholder="My input with icon" icon="flag"></dui-input>
</p>
```

<h3>Icons available</h3>

<icons-browser></icons-browser>

<h3>Add own icons</h3>

<p>
    To add additional icons to the set above you need to define each icon as SVG and put it all in one folder. The name of the svg file will
    be the name of your icon.
</p>

The structure should look like that

```
src/assets/icons
├── cluster.svg
├── dashboard.svg
├── dataset.svg
├── experiment_detail.svg
├── file.svg
├── logo.svg
├── plus.svg
├── projects.svg
└── settings.svg
```

To generate then your custom icon font set, you simply have to call 

```sh
node node_modules/@marcj/angular-desktop-ui/bin/create-font.js src/assets/icons
```

You'll see a list of all base icons (from this library) and all your newly added icons.
You can call this as often as you add new icons to your icon folder. Don't forget to git commit your svg files, so they don't get lost.

The <code>create-font.js</code> file generates in <code>src/assets/fonts/</code> your new font files which you should import in your css:

```css
 @font-face {
    font-family: 'Desktop UI icon Mono';
    src: url("./assets/fonts/ui-icons.svg") format('svg'), url("./assets/fonts/ui-icons.woff") format('woff'), url("./assets/fonts/ui-icons.ttf") format('ttf');
    font-weight: normal;
    font-style: normal;
}

.ui-icon {
    font-family: 'Desktop UI icon Mono' !important;
    font-weight: normal !important;
    font-style: normal !important;
    font-size: 17px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
}
```

<api-doc module="components/icon/icon.component" component="IconComponent"></api-doc>
