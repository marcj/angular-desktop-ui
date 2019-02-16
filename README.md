# Angular Desktop UI

This is a collection for native desktop like user interface components in Angular 7, 
especially useful for Electron apps.

It starts with MacOS support. 
 
It will support light and dark mode.

## Work in progress

This work is in progress and is always streamed via twitch.tv: https://www.twitch.tv/marc__js


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
