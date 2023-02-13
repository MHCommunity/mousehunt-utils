# 🐭️ MouseHunt - MH Utils

A helper library for MouseHunt userscripts.

## Usage

Add the following to your userscript in the header:

```js
@require https://cdn.jsdelivr.net/gh/mouseplace/mh-utils/1.0.0/mh-utils.js
```

## Available functions

### `addStyles`

```js
addStyles(css)

addStyles('.something { display: none; }');
```

### `doRequest`

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

### `getCurrentPage`

```js
getCurrentPage()
```

### `addSubmenuItem`

```js
addSubmenuItem({
  menu: 'kingdom',
  label: 'mouse.rip',
  icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
  href: 'https://mouse.rip',
  external: true,
});
```

## Settings

### `addSetting`

```js
addSetting('Setting Name', 'setting_key', true, 'Setting description.');
```

### `getSetting`

```js
let mySetting = getSetting('setting_key');
```

## Triggers

### `onAjaxRequest`

```js
onAjaxRequest(callback, url, skipSuccess)

onAjaxRequest((req) => {
  // Do something with the response.
}, 'managers/ajax/users/userInventory.php');

// Doing something on all requests.
onAjaxRequest((req) => { console.log(req) })
```

### `onPageChange`

```js
onPageChange({
  change: () => { console.log('Current page: ' + getCurrentPage()); },
  travel: {
    show: () => { console.log('travel is visible'); },
    hide: () => { console.log('travel is hidden'); }
  },
});
```

### `onOverlayChange`

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

### `onTrapChange`

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

## Popups

### `createPopup`

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

### `createImagePopup`

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

### `createMapPopup`

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
