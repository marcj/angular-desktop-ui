# Angular Desktop UI

This is a collection for native desktop like user interface components in Angular 7, 
especially useful for Electron apps.

It starts with MacOS support. 
 
It will support light and dark mode.

## Work in progress

This work is in progress and is always streamed via twitch.tv: https://www.twitch.tv/marc__js


## Screens

![MacOS Light](https://raw.githubusercontent.com/marcj/angular-desktop-ui/master/docs/assets/macos-light.png)

![MacOS Dark](https://raw.githubusercontent.com/marcj/angular-desktop-ui/master/docs/assets/macos-dark.png)

```html
<dui-form>
    <dui-form-row label="Username">
        <input type="text" value="Value" />
    </dui-form-row>

    <dui-form-row label="Really?">
        <dui-checkbox>Checkbox A</dui-checkbox>
    </dui-form-row>

    <dui-form-row label="Which one">
        <dui-radiobox [(model)]="radioValue" value="a">Radio A</dui-radiobox><br/>
        <dui-radiobox [(model)]="radioValue" value="b">Radio B</dui-radiobox>
        <p>
            Chosen: {{radioValue}}
        </p>
    </dui-form-row>

    <dui-form-row label="Another one">
        <dui-select [(model)]="radioValue" placeholder="Please choose">
            <dui-option value="a">Option A</dui-option>
            <dui-option value="b">Option B</dui-option>
        </dui-select>
    </dui-form-row>

    <dui-form-row label="Empty">
        <dui-select style="width: 100px;" [(model)]="selectBox1" placeholder="Please choose">
            <dui-option value="x">Option X</dui-option>
            <dui-option value="y">Option Y</dui-option>
        </dui-select>
    </dui-form-row>
</dui-form>

<diu-button>Send</diu-button>
```

## Todo

| Draft | [disabled] | Component           | selector                   |
|:------|:-----------|:--------------------|:---------------------------|
| [X]   | [ ]        | Input text/password | <dui-input>                |
| [X]   | [ ]        | Button              | <dui-button>               |
| [ ]   | [ ]        | Tabbed Button       | <dui-tabbed-button>        |
| [X]   | [ ]        | Checkbox            | <dui-checkbox>             |
| [ ]   | [ ]        | Radiobox            | <dui-radiobox>             |
| [ ]   | [ ]        | Selectbox           | <dui-select>, <dui-option> |

 

## Installation

Install in your already existing Angular project.

```
npm install @marcj/angular-desktop-ui
```

### Add assets to your Angular assets.

```
# angular.json
# projects.architect.build.assets:

              {
                "glob": "**/*",
                "input": "./node_modules/@marcj/angular-desktop-ui/assets/fonts",
                "output": "assets/fonts"
              }
```

### Add to tsconfig.json

tsconfig.json

```
  "include": [
    "./src",
    "node_modules/@marcj/angular-desktop-ui/**/*.ts"
  ]
```
