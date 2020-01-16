<h1>Emoji</h1>

```typescript
import {DuiEmojiModule} from '@marcj/angular-desktop-ui';
```


```javascript
//@angular
return {
    emoji: ':slightly_smiling_face:',
    lastUses: [':slightly_smiling_face:', ':+1:', ':-1:']
}
```

```html
<p>
    <dui-emoji [size]="8" [name]="emoji"></dui-emoji>
    <dui-emoji [size]="16" [name]="emoji"></dui-emoji>
    <dui-emoji [size]="32" [name]="emoji"></dui-emoji>
    <dui-emoji [size]="16" [name]="emoji"></dui-emoji>
    <dui-emoji [size]="8" [name]="emoji"></dui-emoji><br/>
    Name: <span class="text-selection">{{emoji}}</span>
</p>

<dui-button-group padding="none">
    <dui-button duiEmojiDropdown [(emoji)]="emoji" [(lastEmojis)]="lastUses">Choose emoji</dui-button>
    <dui-button duiEmojiDropdown [(emoji)]="emoji" [(lastEmojis)]="lastUses" small><dui-emoji name="slightly_smiling_face"></dui-emoji></dui-button>
</dui-button-group>
```

<api-doc module="components/input/input.component" component="InputComponent"></api-doc>
