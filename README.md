# 🐭️ MouseHunt - MouseHunt Utils

A helper library for MouseHunt userscripts.

**Note:** This library is still in development and the documentation is _very_ incomplete!

**Current Version:** 1.3.0

# Usage

Add the following to your userscript in the header, replacing `1.3.0` with the latest version.

```js
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.3.0/mousehunt-utils.js
```

Your userscript should have a header like this:

```js
// ==UserScript==
// @name         Your Userscript
// @description  This is my userscript.
// @require      // @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.3.0/mousehunt-utils.js
// @match        https://www.mousehuntgame.com/*
// ==/UserScript==
```

Once you've added the `@require` line, you can use the functions in the library with no extra setup!

# Available functions

## [Triggers](#triggers)

- [`onAjaxRequest`](#onajaxrequest) Do something when a request is made.
- [`onPageChange`](#onpagechange) Do something when the page changes.
- [`onOverlayChange`](#onoverlaychange) Do something when a popup or overlay changes.
- [`onTrapChange`](#ontrapchange) Do something when a trap component changes, such as the charm or cheese.

## [Data](#data)

- [`doRequest`](#dorequest) Make a request to a MouseHunt endpoint.

## [Page Data](#data)

- [`getCurrentPage`](#getcurrentpage) Get the current page.
- [`isOverlayVisible`](#isoverlayvisible) Check if a popup or overlay is visible.
- [`getCurrentOverlay`](#getcurrentoverlay) Get the current popup or overlay.

## [User Data](#user-data)

- [`isLegacyHUD`](#islegacyhud) Check if the user is using the legacy HUD.
- [`userHasItem`](#userhasitem) Check if the user has an item.
- [`getUserItems`](#getuseritems) Get the details of an array of items.
- [`getUserSetupDetails`](#getusersetupdetails) Get the details of the user's setup.

## [Popups](#popups)

- [`createPopup`](#createpopup) Create a basic popup.
- [`createImagePopup`](#createimagepopup) Create a popup with an image, similar to the mouse image popup.
- [`createMapPopup`](#createmappopup) Create a popup inside the treasure map popup.

## [Settings](#settings)

- [`addSetting`](#addsetting) Add a setting to the Game Settings page.
- [`getSetting`](#getsetting) Get the value of a setting.

## [Miscellaneous](#miscellaneous)

- [`addStyles`](#addstyles) Add CSS styles to the page.
- [`addSubmenuItem`](#addsubmenuitem) Add a submenu item to the menu.
- [`addItemToGameInfoBar`](#additemtogameinfobar) Add an item to the Game Info Bar.
- [`makeElement`](#makeelement) Create an element.
- [`makeElementDraggable`](#makeelementdraggable) Make an element draggable, automatically saving and restoring the position.

## Triggers

## `onAjaxRequest`

Do something when a request is made, either on every request or on a specific endpoint.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `callback` | `function` | Yes | The function to call when the request is made. |
| `url` | `string` | No | The URL to call the function on. If not specified, the function will be called on every request. |
| `skipSuccess` | `boolean` | No | If true, the function will not be called on successful requests. |

### Examples

```js
onAjaxRequest(() => {
  // Do something when the userInventory endpoint is called.
}, 'managers/ajax/users/userInventory.php');

// Doing something on all requests.
onAjaxRequest((req) => { console.log(req) })
```

## `onPageChange`

Do something when the page changes, either on any page or when leaving or entering a specific page.

### Parameters

All parameters are optional, but you probably want to specify at least one of `change`, `show`, or `hide`.

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the trigger. |
| `options.change` | `function` | No | The function to call when the page changes. |
| `options.<page>` | `object` | No | The options for a specific page. |
| `options.<page>.show` | `function` | No | The function to call when a specifc page is shown. |
| `options.<page>.hide` | `function` | No | The function to call when a specifc page is hidden. |

### Available pages

Any of these can be used as the `<page>` parameter.

- `camp`
- `travel`
- `inventory`
- `shop`
- `mice`
- `friends`
- `sendSupplies`
- `team`
- `tournament`
- `news`
- `scoreboards`
- `discord`

### Example

```js
onPageChange({
  change: () => { console.log('Current page: ' + getCurrentPage()); },
  travel: {
    show: () => { console.log('travel is visible'); },
    hide: () => { console.log('travel is hidden'); }
  },
});
```

## `onOverlayChange`

Do something when a popup / overlay changes, either on any popup or when a specific popup is shown or hidden.

### Parameters

All parameters are optional, but you probably want to specify at least one of `change`, `show`, or `hide`.

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the trigger. |
| `options.change` | `function` | No | The function to call when the page changes. |
| `options.<overlay>` | `object` | No | The options for a specific overlay. |
| `options.<overlay>.show` | `function` | No | The function to call when a specifc overlay is shown. |
| `options.<overlay>.hide` | `function` | No | The function to call when a specifc overlay is hidden. |

### Available Popups / Overlays

Any of these can be used as the `<overlay>` parameter.

- `map`
- `item`
- `mouse`
- `image`
- `convertible`
- `adventureBook`
- `marketplace`
- `gifts`
- `support`
- `premiumShop`

### Example

```js
onOverlayChange({
  change: () => { console.log('overlayPopup changed'); },
  show: () => { console.log('overlayPopup is visible'); },
  hide: () => { console.log('overlayPopup is hidden'); },
  map: {
    show: () => { console.log('treasureMapPopup is visible'); },
    hide: () => { console.log('treasureMapPopup is hidden'); },
  },
});
```

## `onTrapChange`

Do something when a trap component changes, such as the charm or cheese.

### Parameters

All parameters are optional, but you probably want to specify at least one of `change`, `show`, or `hide`.

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the trigger. |
| `options.change` | `function` | No | The function to call when the trap changes. |
| `options.show` | `function` | No | The function to call when the trap is shown. |
| `options.hide` | `function` | No | The function to call when the trap is hidden. |
| `options.<component>` | `object` | No | The options for a specific component. |
| `options.<component>.change` | `function` | No | The function to call when a specifc component changes. |
| `options.<component>.show` | `function` | No | The function to call when a specifc component is shown. |
| `options.<component>.hide` | `function` | No | The function to call when a specifc component is hidden. |

### Available Components

- `bait`
- `base`
- `weapon`
- `charm`
- `skin`

### Example

```js
onTrapChange({
  change: () => { console.log('trap changed'); },
  show: () => { console.log('trap is visible'); },
  hide: () => { console.log('trap is hidden'); },
  bait: {
    show: () => { console.log('bait is visible'); },
    hide: () => { console.log('bait is hidden'); }
  },
});
```

## Data

## `doRequest`

Make a request to a MouseHunt endpoint.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `url` | `string` | Yes | The URL to make the request to. |
| `data` | `object` | No | The data to send with the request. |

### Example

```js
doRequest(
  'managers/ajax/pages/page.php',
  {
    page_class: 'HunterProfile',
    'page_arguments[tab]': 'mice',
    'page_arguments[sub_tab]': 'location',
  }
).then((data) => {
  // Do something with the data.
});
```

```js
const itemData = await doRequest('managers/ajax/users/userInventory.php', {
  action: 'get_items',
  'item_types[]': 'cheddar_cheese'
});

console.log(itemData); // { cheddar_cheese: { ... } }
```

## Page Data

## `getCurrentPage`

Returns the current page.

```js
getCurrentPage()
```

## `isOverlayVisible`

Returns whether there is currently a popup / overlay visible.

```js
isOverlayVisible(); // returns true or false
```

## `getCurrentOverlay`

Returns the current visible popup / overlay.

```js
getCurrentOverlay();
```

## User Data

## `isLegacyHUD`

Returns whether the user is using the legacy HUD.

```js
isLegacyHUD(); // returns true or false
```

## `userHasItem`

Returns whether the user has a specific item.

```js
userHasItem(itemType);
```

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `itemType` | `string` | Yes | The type of item to check for. |

### Example

```js
if (! userHasItem('super_brie_cheese')) {
  console.log("Oh no! You're out of SB!");
}
```

## `getUserItems`

Get the data for an array of items.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `itemTypes` | `array` | Yes | The types of items to get data for. |

### Example

```js
const items = await getUserItems(['super_brie_cheese', 'cheddar_cheese']);
console.log(items); // { super_brie_cheese: { ... }, cheddar_cheese: { ... } }
```

## `getUserSetupDetails`

Gets the details of the user's setup, including the current power, luck, etc from each component and aura.

```js
getUserSetupDetails()
```

<details>
<summary>Example return value</summary>
<pre>
{
    "type": "Arcane",
    "stats": {
        "power": 6963,
        "powerBonus": 0.51,
        "luck": 58,
        "attractionBonus": 0.26,
        "cheeseEfect": "No Effect"
    },
    "bait": {
        "id": 3188,
        "name": "Speedy Coggy Colby",
        "quantity": 454,
        "power": 0,
        "powerBonus": 0,
        "luck": 0,
        "attractionBonus": 0
    },
    "base": {
        "id": 3364,
        "name": "Seasonal Gift of the Day Base",
        "power": 100,
        "powerBonus": 0,
        "luck": 10,
        "attractionBonus": 0.15
    },
    "charm": {
        "id": 2780,
        "name": "Factory Repair Charm",
        "quantity": 872,
        "power": 11,
        "powerBonus": 11,
        "luck": 5,
        "attractionBonus": 0.11
    },
    "weapon": {
        "id": 3304,
        "name": "Boiling Cauldron Trap",
        "power": 4500,
        "powerBonus": 15,
        "luck": 20,
        "attractionBonus": 0
    },
    "aura": {
        "lgs": {
            "active": true,
            "power": 0,
            "powerBonus": 0,
            "luck": 7,
            "type": "lgs"
        },
        "lightning": {
            "active": true,
            "power": 0,
            "powerBonus": 0.25,
            "luck": 0,
            "type": "lightning"
        },
        "chrome": {
            "active": true,
            "power": 0,
            "powerBonus": 0,
            "luck": 5,
            "type": "chrome"
        },
        "slayer": {
            "active": true,
            "power": 0,
            "powerBonus": 0,
            "luck": 5,
            "type": "slayer"
        },
        "festive": {
            "active": true,
            "power": 0,
            "powerBonus": 0,
            "luck": 5,
            "type": "festive"
        },
        "luckycodex": {
            "active": true,
            "power": 0,
            "powerBonus": 0,
            "luck": 1,
            "type": "luckycodex"
        },
        "riftstalker": {
            "active": false,
            "power": 0,
            "powerBonus": 0,
            "luck": 0
        }
    },
    "location": {
        "name": "SUPER|brie+ Factory",
        "id": 60,
        "slug": "super_brie_factory"
    },
    "cheeseEffect": "No Effect"
}
</pre>
</details>

## Popups

## `createPopup`

Creates a popup with the given title and content. Make sure to add an event listener to the target element to show the popup.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.content` | `string` | No | The content of the popup. |
| `options.hasCloseButton` | `boolean` | No | Whether the popup should have a close button. |
| `options.template` | `string` | No | The template to use for the popup. |
| `options.show` | `boolean` | No | Whether the popup should be shown immediately. |

### Example

```js
const examplePopupTarget = document.querySelector('.mousehuntHud-gameInfo');
if (examplePopupTarget) {
  examplePopupTarget.addEventListener('click', () => {
    createPopup({
      title: 'Example Popup',
      content: 'This is an example popup.',
    });
  });
}
```

## `createImagePopup`

Creates a popup with the given title and content.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | Yes | The options for the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.image` | `string` | No | The image to show in the popup. |
| `options.show` | `boolean` | No | Whether the popup should be shown immediately. |

### Example

```js
const exampleImagePopupTarget = document.querySelector('.mousehuntHud-userStat-row.points');
if (exampleImagePopupTarget) {
  exampleImagePopupTarget.addEventListener('click', () => {
    createImagePopup({
      title: 'Example Image Popup',
      image: 'https://example.com/example.png',
    });
  });
}
```

## `createMapPopup`

Creates a popup that shows while in the map popup.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | Yes | The options for the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.content` | `string` | No | The content of the popup. |
| `options.closeClass` | `string` | No | The class to add to the close button. |
| `options.closeText` | `string` | No | The text to show on the close button. |
| `options.show` | `boolean` | No | Whether the popup should be shown immediately. |

### Example

```js
const exampleMapPopupTarget = document.querySelector('.mousehuntHud-userStat-row.gold');
if (exampleMapPopupTarget) {
  exampleMapPopupTarget.addEventListener('click', () => {
    createMapPopup({
      title: 'Example Map Popup',
      content: 'This is an example map popup.',
    });
  });
}
```

## Settings

## `addSetting`

Adds a boolean setting to the Game Settings page under 'Userscript Settings'.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `name` | `string` | Yes | The name of the setting. |
| `key` | `string` | Yes | The key of the setting. |
| `defaultValue` | `boolean` | No | The default value of the setting, defaults to `true` if not provided. |
| `description` | `string` | No | The description of the setting. |
| `section` | `object` | No | The section to add the setting to. |
| `section.id` | `string` | No | The ID of the section to add the setting to. |
| `section.name` | `string` | No | The name of the section to add the setting to. |

### Example

```js
addSetting('Enable Turbo Mode', 'turbo-mode-enabled', true, 'Enables turbo mode.');
```

```js
addSetting(
  'My Setting',
  'my-fancy-setting-key',
  false,
  'This is my fancy setting that even has a special section.',
  {
    id: 'my-fancy-section',
    name: 'My Fancy Section',
  }
);

addSetting(
  'My Other Setting',
  'my-other-fancy-setting-key',
  false,
  'This is my other fancy setting that goes in the same section.',
  {
    id: 'my-fancy-section',
    name: 'My Fancy Section',
  }
);
```

## `getSetting`

Gets the value of a setting.

```js
const mySetting = getSetting('setting_key');
if (mySetting) {
  // Do something.
} else {
  // Do something else.
}
```

## Miscellaneous

## `addStyles`

Add CSS styles to the page.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `styles` | `string` | Yes | The CSS styles to add. |
| `id` | `string` | No | The ID of the style element. |
| `displayOnce` | `boolean` | No | If enabled, the styles will only be added if that id has not been used before. |

#### Example

```js
addStyles(`
  .my-class {
    color: red;
  }

  .huntersHornView {
    display: none;
  }
`);
```

## `addSubmenuItem`

Add a submenu item to the menu.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the submenu item. |
| `options.menu` | `string` | No | The menu to add the submenu item to, defaults to Kingdom. |
| `options.label` | `string` | No | The label of the submenu item. |
| `options.icon` | `string` | No | The icon of the submenu item, defaults to the stars icon. |
| `options.href` | `string` | No | The link for the submenu item. |
| `options.class` | `string` | No | The class of the submenu item. |
| `options.callback` | `function` | No | The callback function to run when the submenu item is clicked. |
| `options.external` | `boolean` | No | Whether the submenu item should show the external link icon, defaults to `false`. |

#### Example

```js
addSubmenuItem({
  menu: 'kingdom',
  label: 'mouse.rip',
  icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
  href: 'https://mouse.rip',
  external: true,
});
```

## `addItemToGameInfoBar`

Adds a link to the top 'Hunters Online' bar.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the submenu item. |
| `options.label` | `string` | No | The label of the submenu item. |
| `options.icon` | `string` | No | The icon of the submenu item, defaults to the stars icon. |
| `options.href` | `string` | No | The link for the submenu item. |
| `options.class` | `string` | No | The class of the submenu item. |
| `options.callback` | `function` | No | The callback function to run when the submenu item is clicked. |
| `options.external` | `boolean` | No | Whether the submenu item should show the external link icon, defaults to `false`. |

#### Example

```js
addItemToGameInfoBar({
  label: 'mouse.rip',
  icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
  href: 'https://mouse.rip',
  external: true,
});
```

```js
addItemToGameInfoBar({
  label: 'Spring Egg Hunt Helper',
  icon: 'https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/887162c61d0e01985ffc12e41c03d952.png?cv=2',
  class: 'mh-egg-helper-top-menu',
  callback: bookPopup
});
```

## `makeElement`

Create an element with a given class and text, optionally appending it to another element.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `type` | `string` | Yes | The type of element to create. |
| `className` | `string` | No | The class name to add to the element. |
| `text` | `string` | No | The text to add to the element. |
| `appendTo` | `Node` | No | The element to append the new element to. |

#### Example

```js
const myElement = makeElement('div', 'my-class', 'My Text');
```

```js
makeElement('a', 'some-class', 'This is a link', document.body);
```

## `makeElementDraggable`

Make an element draggable, with the ability to automatical saving and restoring the position.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `dragTarget` | `string` | Yes | The selector for the element to make draggable. |
| `dragHandle` | `string` | Yes | The selector for the element to use as the drag handle. |
| `defaultX` | `number` | No | The default X position of the element, defaults to `0`. |
| `defaultY` | `number` | No | The default Y position of the element, defaults to `0`. |
| `storageKey` | `string` | No | The key to use for storing the position in localStorage, defaults to `dragTarget`. |
| `savePosition` | `boolean` | No | Whether the position should be saved in localStorage, defaults to `true`. |

#### Example

```js
makeElementDraggable(
  '#mh-catch-stats',
  '.mh-catch-stats-header',
  25,
  25,
  'mh-catch-stats-position'
  true
);
```
