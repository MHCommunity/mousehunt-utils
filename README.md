# 🐭️ MouseHunt - MouseHunt Utils

A helper library for MouseHunt userscripts.

![GitHub](https://img.shields.io/github/license/mouseplace/mousehunt-utils)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/mouseplace/mousehunt-utils?label=version)

**Current Version:** 1.7.3

# Usage

Add the following to your userscript in the header.

```js
// @require https://cdn.jsdelivr.net/npm/mousehunt-utils@1.7.3/mousehunt-utils.js
```

Your userscript should have a header like this:

```js
// ==UserScript==
// @name         My Userscript
// @description  This is my userscript.
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.7.3/mousehunt-utils.js
// @match        https://www.mousehuntgame.com/*
// ==/UserScript==
```

Once you've added the `@require` line, you can use the functions in the library with no extra setup!

# Available functions

## [Triggers](#triggers)

- [`onAjaxRequest`](#onajaxrequest) Do something when a request is made.
- [`onEvent`](#onevent) Do something when an event is triggered.
- [`onPageChange`](#onpagechange) Do something when the page changes.
- [`onOverlayChange`](#onoverlaychange) Do something when a popup or overlay changes.
- [`onTrapChange`](#ontrapchange) Do something when a trap component changes, such as the charm or cheese.
- [`onTravel`](#ontravel) Do something when the user travels to a new location.

## [Data](#data)

- [`doRequest`](#dorequest) Make a request to a MouseHunt endpoint.

## [Page and User Data](#page-and-user-data)

- [`getCurrentLocation`](#getcurrentlocation) Get the current location.
- [`getCurrentPage`](#getcurrentpage) Get the current page.
- [`getCurrentTab`](#getcurrenttab) Get the current tab.
- [`getCurrentSubtab`](#getcurrentsubtab) Get the current subtab.
- [`isOverlayVisible`](#isoverlayvisible) Check if a popup or overlay is visible.
- [`getCurrentOverlay`](#getcurrentoverlay) Get the current popup or overlay.
- [`isLoggedIn`](#isloggedin) Check if the user is logged in.
- [`isLegacyHUD`](#islegacyhud) Check if the user is using the legacy HUD.
- [`userHasItem`](#userhasitem) Check if the user has an item.
- [`getUserItems`](#getuseritems) Get the details of an array of items.
- [`getUserSetupDetails`](#getusersetupdetails) Get the details of the user's setup.

## [Popups](#popups)

- [`createPopup`](#createpopup) Create a basic popup.
- [`createChoicePopup`](#createchoicepopup) Create a popup with two choices.
- [`createImagePopup`](#createimagepopup) Create a popup with an image, similar to the mouse image popup.
- [`createLarryPopup`](#createlarrypopup) Create a popup with the Larry Office background.
- [`createPaperPopup`](#createpaperpopup) Create a popup with a paper background.
- [`createMapPopup`](#createmappopup) Create a popup inside the treasure map popup.
- [`createWelcomePopup`](#createwelcomepopup) Create a popup that shows once.
- [`showHornMessage`](#showhornmessage) Show a message in the horn popup.

## [Settings](#settings)

- [`addSetting`](#addsetting) Add a setting to the Game Settings page.
- [`addSettingsTab`](#addsettingstab) Add a tab to the Game Settings page.
- [`getSetting`](#getsetting) Get the value of a setting.
- [`saveSetting`](#savesetting) Save a setting.
- [`createFavoriteButton`](#createfavoritebutton) Create a favorite button.

## [Miscellaneous](#miscellaneous)

- [`addStyles`](#addstyles) Add CSS styles to the page.
- [`addSubmenuItem`](#addsubmenuitem) Add a submenu item to the menu.
- [`addItemToGameInfoBar`](#additemtogameinfobar) Add an item to the Game Info Bar.
- [`makeElement`](#makeelement) Create an element.
- [`makeElementDraggable`](#makeelementdraggable) Make an element draggable, automatically saving and restoring the position.
- [`wait`](#wait) Wait for a number of milliseconds.

## [Debugging](#debugging)

- [`clog`](#clog) Log a message to the console.
- [`debug`](#debug) Log a message to the console if debugging is enabled.
- [`enableDebugMode`](#enabledebugmode) Enable debugging.

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

## `onEvent`

Do something when an event is triggered - a wrapper around the HG event registry.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `event` | `string` | Yes | The name of the event to listen for. |
| `callback` | `function` | Yes | The function to call when the event is triggered. |

### Examples

```js
onEvent('travel_complete', () => {
  // Do something when the user travels.
});
```

```js
onEvent('ajax_response', () => {
  console.log('Fired when an ajax request is made.');
});
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

### Examples

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

### Examples

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

### Examples

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

## `onTravel`

Do something when the user travels to a new location.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `location` | `string` | Yes | The location to travel to. |
| `options` | `object` | No | The options for the trigger. |
| `options.shouldAddReminder` | `boolean` | No | Whether to add a reminder for the location. |
| `options.title` | `string` | No | The title of the reminder. |
| `options.text` | `string` | No | The text of the reminder. |
| `options.button` | `string` | No | The text of the button on the reminder. |
| `options.action` | `function` | No | The function to call when the button is clicked. |
| `options.callback` | `function` | No | The function to call when the travel is complete. |

### Examples

```js
onTravel('table_of_contents', {
  shouldAddReminder: true,
  title: 'Make sure you enable CC!',
  text: 'If you don\'t enable CC, your writing will be slower.',
  button: 'Dismiss',
});
```

```js
onTravel('rift_valour', {
  shouldAddReminder: true,
  title: 'Valour Rift'
  text: 'You should go to Floating Islands instead.',
  button: 'Travel',
  action: () => { app.pages.TravelPage.travel('floating_islands'); },
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

### Examples

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

## Page and User Data

## `getCurrentLocation`

Returns the current location.

## `getCurrentPage`

Returns the current page.

## `getCurrentTab`

Returns the current tab.

## `getCurrentSubtab`

Returns the current subtab, falling back to the current tab if there is no subtab.

## `isOverlayVisible`

Returns whether there is currently a popup / overlay visible.

## `getCurrentOverlay`

Returns the current visible popup / overlay.

## `isLoggedIn`

Returns whether the user is logged in.

## `isLegacyHUD`

Returns whether the user is using the legacy HUD.

## `userHasItem`

Returns whether the user has a specific item.

```js
userHasItem(itemType);
```

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `itemType` | `string` | Yes | The type of item to check for. |

### Examples

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

### Examples

```js
const items = await getUserItems(['super_brie_cheese']);
console.log(items); // { super_brie_cheese: { ... } }
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
| `options.className` | `string` | No | The class name to add to the popup. |

### Examples

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

## `createChoicePopup`

Creates a popup with two choices.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.choices` | `array` | Yes | The choices for the popup. |
| `options.choices.id` | `string` | Yes | The id of the choice. |
| `options.choices.name` | `string` | Yes | The name of the choice. |
| `options.choices.image` | `string` | Yes | The image of the choice. |
| `options.choices.meta` | `string` | Yes | The subheading of the choice. |
| `options.choices.text` | `string` | Yes | The text of the choice. |
| `options.choices.button` | `string` | Yes | The text of the button. |
| `options.choices.action` | `function` | Yes | The callback function for the choice. |

### Examples

```js
createChoicePopup({
  title: 'Choose your favorite Mouse',
  choices: [
    {
      id: 'treasurer_mouse',
      name: 'Treasurer',
      image: 'https://www.mousehuntgame.com/images/mice/medium/bb55034f6691eb5e3423927e507b5ec9.jpg?cv=2',
      meta: 'Mouse',
      text: 'This is a mouse',
      button: 'Select',
      callback: () => {
        console.log('treasurer selected');
      }
    },
    {
      id: 'high_roller_mouse',
      name: 'High Roller',
      image: 'https://www.mousehuntgame.com/images/mice/medium/3f71c32f9d8da2b2727fc8fd288f7974.jpg?cv=2',
      meta: 'Mouse',
      text: 'This is a mouse',
      button: 'Select',
      callback: () => {
        console.log('high roller selected');
      }
    },
  ],
});
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

### Examples

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

## `createLarryPopup`

Create a popup with the Larry's office style.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `content` | `string` | Yes | The content of the popup. |

### Examples

```js
const exampleLarryPopupTarget = document.querySelector('.mousehuntHud-userStat-row.gold');
if (exampleLarryPopupTarget) {
  exampleLarryPopupTarget.addEventListener('click', () => {
    createLarryPopup('This is an example Larry popup.');
  });
}
```

## `createPaperPopup`

Create a popup with the paper style.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | Yes | The options for the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.content` | `object` | No | The content of the popup. |
| `options.content.title` | `string` | No | The title of the content. |
| `options.content.text` | `string` | No | The text of the content. |
| `options.content.image` | `string` | No | The image of the content. |
| `options.content.button` | `object` | No | The button of the content. |
| `options.content.button.text` | `string` | No | The text of the button. |
| `options.content.button.href` | `string` | No | The href of the button. |
| `options.show` | `boolean` | No | Whether the popup should be shown immediately. |

### Examples

```js
const examplePaperPopupTarget = document.querySelector('.mousehuntHud-userStat-row.gold');
if (examplePaperPopupTarget) {
  examplePaperPopupTarget.addEventListener('click', () => {
    createPaperPopup({
      title: 'Example Paper Popup',
      content: {
        title: 'Example Paper Popup',
        text: 'This is an example paper popup.',
        image: 'https://example.com/example.png',
        button: {
          text: 'Example Button',
          href: 'https://example.com',
        },
      },
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

### Examples

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

## `createWelcomePopup`

Creates a popup that shows once.

### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `options` | `object` | Yes | The options for the popup. |
| `options.id` | `string` | Yes | The ID of the popup. |
| `options.title` | `string` | No | The title of the popup. |
| `options.content` | `string` | No | The content of the popup. |
| `options.columns` | `array` | No | The columns of the popup. |
| `options.columns.title` | `string` | No | The title of the column. |
| `options.columns.content` | `string` | No | The content of the column. |

### Examples

```js
const exampleWelcomePopupTarget = document.querySelector('.mousehuntHud-userStat-row.gold');
if (exampleWelcomePopupTarget) {
  exampleWelcomePopupTarget.addEventListener('click', () => {
    createWelcomePopup({
      id: 'example-welcome-popup',
      title: 'Example Welcome Popup',
      content: 'This is an example welcome popup.',
      columns: [
        {
          title: 'Example Column 1',
          content: 'This is an example column 1.',
        },
        {
          title: 'Example Column 2',
          content: 'This is an example column 2.',
        },
      ],
    });
  });
}
```

## `showHornMessage`

Show a message in the horn popup.

### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `options` | `object` | Yes | The options for the message. |
| `options.title` | `string` | No | The title of the message. |
| `options.text` | `string` | No | The text of the message. |
| `options.button` | `object` | No | The button text for the message. |
| `options.action` | `function` | No | The action to perform when the button is clicked. |

### Examples

```js
showHornMessage({
  title: 'Example Message',
  text: 'This is an example message.',
  button: 'Example Button',
  action: () => {
    console.log('Example action');
  },
});
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
| `tab` | `string` | No | The tab to add the setting to. Must be added with `addSettingTab()` first. |

### Examples

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

## `addSettingsTab`

Adds a tab to the Game Settings page to show a custom settings page.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `identifier` | `string` | Yes | The identifier of the tab. |
| `name` | `string` | Yes | The name of the tab. |

### Examples

```js
addSettingsTab('my-tab', 'My Tab');
```

```js
const settingSection = {
  id: 'my-section',
  name: 'My fancy section',
};

const tab = addSettingsTab('my-tab', 'My Fancy Tab');

addSetting(
  'This is my fancy setting',
  'my-fancy-setting-key',
  false,
  'This is my fancy setting that goes in the fancy section.',
  settingSection,
  tab
);
```

## `getSetting`

Gets the value of a setting.

### Examples

```js
const mySetting = getSetting('setting_key');
if (mySetting) {
  // Do something.
} else {
  // Do something else.
}
```

## `saveSetting`

Saves a setting.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `key` | `string` | Yes | The key of the setting. |
| `value` | `boolean` | Yes | The value of the setting. |
| `identifier` | `string` | No | The identifier of the setting group. |

### Examples

```js
saveSetting('setting_key', true);
```

## `createFavoriteButton`

Creates a favorite button that can be toggled on and off.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `options` | `object` | Yes | The options for the favorite button. |
| `options.id` | `string` | Yes | The ID of the favorite button. |
| `options.target` | `Node` | Yes | The element to append the favorite button to. |
| `options.size` | `string` | No | The size of the favorite button, defaults to `small`. |
| `options.defaultState` | `boolean` | No | The default state of the favorite button, defaults to `false`. |

### Examples

```js
const infobar = document.querySelector('.mousehuntHud-gameInfo');

createFavoriteButton({
  id: 'testing_favorite',
  target: infobar,
  size: 'small',
  defaultState: false,
});
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

### Examples

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

### Examples

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

### Examples

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

### Examples

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

### Examples

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

## `wait`

Wait for a number of seconds before resolving a promise.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `ms` | `number` | Yes | The number of milliseconds to wait. |

### Examples

```js
wait(1000).then(() => {
  console.log('1 second has passed');
});
```

## Debugging

## `clog`

Log a message to the console.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `message` | `string|object` | Yes | The message to log to the console. |

### Examples

```js
clog('Hello World');
```

```js
clog('hello', 'world');
```

## `debug`

Log a message to the console if debugging is enabled.

### Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| `message` | `string|object` | Yes | The message to log to the console. |

### Examples

```js
const myVar = getSomeVar();
debug(myVar);
```

## `enableDebugMode`

Adds an option in the preferences to enable debugging, must be called before using `debug`.















onDialogShow(() => {
    console.log(window.mhutils.lastDialog)
  }, 'map');
