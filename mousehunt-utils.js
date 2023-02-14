// ==UserScript==
// @name         🐭️ MouseHunt Utils
// @author       bradp
// @version      1.1.1
// @description  MouseHunt Utils is a library of functions that can be used to make other MouseHunt userscripts easily.
// @license      MIT
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://brrad.com/mouse.png
// @grant        none
// ==/UserScript==

/**
 * Add styles to the page.
 *
 * @param {string} styles The styles to add.
 */
const addStyles = (styles) => {
	// Check to see if the existing element exists.
	const existingStyles = document.getElementById('mh-mouseplace-custom-styles');

	// If so, append our new styles to the existing element.
	if (existingStyles) {
		existingStyles.innerHTML += styles;
		return;
	}

	// Otherwise, create a new element and append it to the head.
	const style = document.createElement('style');
	style.id = 'mh-mouseplace-custom-styles';
	style.innerHTML = styles;
	document.head.appendChild(style);
};

/**
 * Do something when ajax requests are completed.
 *
 * @param {Function} callback    The callback to call when an ajax request is completed.
 * @param {string}   url         The url to match. If not provided, all ajax requests will be matched.
 * @param {boolean}  skipSuccess Skip the success check.
 */
const onAjaxRequest = (callback, url = null, skipSuccess = false) => {
	const req = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function () {
		this.addEventListener('load', function () {
			if (this.responseText) {
				let response = {};
				try {
					response = JSON.parse(this.responseText);
				} catch (e) {
					return;
				}

				if (response.success || skipSuccess) {
					if (! url) {
						callback(response);
						return;
					}

					if (this.responseURL.indexOf(url) !== -1) {
						callback(response);
					}
				}
			}
		});
		req.apply(this, arguments);
	};
};

/**
 * Run the callbacks depending on visibility.
 *
 * @param {Object} settings   Settings object.
 * @param {Node}   parentNode The parent node.
 * @param {Object} callbacks  The callbacks to run.
 *
 * @return {Object} The settings.
 */
const runCallbacks = (settings, parentNode, callbacks) => {
	// Loop through the keys on our settings object.
	Object.keys(settings).forEach((key) => {
		// If the parentNode that's passed in contains the selector for the key.
		if (parentNode.classList.contains(settings[ key ].selector)) {
			// Set as visible.
			settings[ key ].isVisible = true;

			// If there is a show callback, run it.
			if (callbacks[ key ] && callbacks[ key ].show) {
				callbacks[ key ].show();
			}
		} else if (settings[ key ].isVisible) {
			// Mark as not visible.
			settings[ key ].isVisible = false;

			// If there is a hide callback, run it.
			if (callbacks[ key ] && callbacks[ key ].hide) {
				callbacks[ key ].hide();
			}
		}
	});

	return settings;
};

/**
 * Do something when the overlay is shown or hidden.
 *
 * @param {Object}   callbacks
 * @param {Function} callbacks.show   The callback to call when the overlay is shown.
 * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
 * @param {Function} callbacks.change The callback to call when the overlay is changed.
 */
const onOverlayChange = (callbacks) => {
	// Track the different overlay states.
	let overlayData = {
		map: {
			isVisible: false,
			selector: 'treasureMapPopup'
		},
		item: {
			isVisible: false,
			selector: 'itemViewPopup'
		},
		mouse: {
			isVisible: false,
			selector: 'mouseViewPopup'
		},
		image: {
			isVisible: false,
			selector: 'largerImage'
		},
		convertible: {
			isVisible: false,
			selector: 'convertibleOpenViewPopup'
		},
		adventureBook: {
			isVisible: false,
			selector: 'adventureBookPopup'
		},
		marketplace: {
			isVisible: false,
			selector: 'marketplaceViewPopup'
		},
		gifts: {
			isVisible: false,
			selector: 'giftSelectorViewPopup'
		},
		support: {
			isVisible: false,
			selector: 'supportPageContactUsForm'
		},
		premiumShop: {
			isVisible: false,
			selector: 'MHCheckout'
		}
	};

	// Observe the overlayPopup element for changes.
	const observer = new MutationObserver(() => {
		if (callbacks.change) {
			callbacks.change();
		}

		// Grab the overlayPopup element and make sure it has classes on it.
		const overlayType = document.getElementById('overlayPopup');
		if (overlayType && overlayType.classList.length <= 0) {
			return;
		}

		// Grab the overlayBg and check if it is visible or not.
		const overlayBg = document.getElementById('overlayBg');
		if (overlayBg && overlayBg.classList.length > 0) {
			// If there's a show callback, run it.
			if (callbacks.show) {
				callbacks.show();
			}
		} else if (callbacks.hide) {
			// If there's a hide callback, run it.
			callbacks.hide();
		}

		// Run all the specific callbacks.
		overlayData = runCallbacks(overlayData, overlayType, callbacks);
	});

	// Observe the overlayPopup element for changes.
	const observeTarget = document.getElementById('overlayPopup');
	if (observeTarget) {
		observer.observe(observeTarget, {
			attributes: true,
			attributeFilter: ['class']
		});
	}
};

/**
 * Do something when the page or tab changes.
 *
 * @param {Object}   callbacks
 * @param {Function} callbacks.show   The callback to call when the overlay is shown.
 * @param {Function} callbacks.hide   The callback to call when the overlay is hidden.
 * @param {Function} callbacks.change The callback to call when the overlay is changed.
 */
const onPageChange = (callbacks) => {
	// Track our page tab states.
	let tabData = {
		blueprint: {
			isVisible: null,
			selector: 'showBlueprint'
		},
		tem: {
			isVisible: false,
			selector: 'showTrapEffectiveness'
		},
		trap: {
			isVisible: false,
			selector: 'editTrap'
		},
		camp: {
			isVisible: false,
			selector: 'PageCamp'
		},
		travel: {
			isVisible: false,
			selector: 'PageTravel'
		},
		inventory: {
			isVisible: false,
			selector: 'PageInventory'
		},
		shop: {
			isVisible: false,
			selector: 'PageShops'
		},
		mice: {
			isVisible: false,
			selector: 'PageAdversaries'
		},
		friends: {
			isVisible: false,
			selector: 'PageFriends'
		},
		sendSupplies: {
			isVisible: false,
			selector: 'PageSupplyTransfer'
		},
		team: {
			isVisible: false,
			selector: 'PageTeam'
		},
		tournament: {
			isVisible: false,
			selector: 'PageTournament'
		},
		news: {
			isVisible: false,
			selector: 'PageNews'
		},
		scoreboards: {
			isVisible: false,
			selector: 'PageScoreboards'
		},
		discord: {
			isVisible: false,
			selector: 'PageJoinDiscord'
		}
	};

	// Observe the mousehuntContainer element for changes.
	const observer = new MutationObserver(() => {
		// If there's a change callback, run it.
		if (callbacks.change) {
			callbacks.change();
		}

		// Grab the container element and make sure it has classes on it.
		const mhContainer = document.getElementById('mousehuntContainer');
		if (mhContainer && mhContainer.classList.length > 0) {
			// Run the callbacks.
			tabData = runCallbacks(tabData, mhContainer, callbacks);
		}
	});

	// Observe the mousehuntContainer element for changes.
	const observeTarget = document.getElementById('mousehuntContainer');
	if (observeTarget) {
		observer.observe(observeTarget, {
			attributes: true,
			attributeFilter: ['class']
		});
	}
};

/**
 * Do something when the trap tab is changed.
 *
 * @param {Object} callbacks
 */
const onTrapChange = (callbacks) => {
	// Track our trap states.
	let trapData = {
		bait: {
			isVisible: false,
			selector: 'bait'
		},
		base: {
			isVisible: false,
			selector: 'base'
		},
		weapon: {
			isVisible: false,
			selector: 'weapon'
		},
		charm: {
			isVisible: false,
			selector: 'trinket'
		},
		skin: {
			isVisible: false,
			selector: 'skin'
		}
	};

	// Observe the trapTabContainer element for changes.
	const observer = new MutationObserver(() => {
		// Fire the change callback.
		if (callbacks.change) {
			callbacks.change();
		}

		// If we're not viewing a blueprint tab, bail.
		const mhContainer = document.getElementById('mousehuntContainer');
		if (mhContainer.classList.length <= 0 || ! mhContainer.classList.contains('showBlueprint')) {
			return;
		}

		// If we don't have the container, bail.
		const trapContainerParent = document.querySelector('.campPage-trap-blueprintContainer');
		if (! trapContainerParent || ! trapContainerParent.children || ! trapContainerParent.children.length > 0) {
			return;
		}

		// If we're not in the itembrowser, bail.
		const trapContainer = trapContainerParent.children[ 0 ];
		if (! trapContainer || trapContainer.classList.length <= 0 || ! trapContainer.classList.contains('campPage-trap-itemBrowser')) {
			return;
		}

		// Run the callbacks.
		trapData = runCallbacks(trapData, trapContainer, callbacks);
	});

	// Grab the campPage-trap-blueprintContainer element and make sure it has children on it.
	const observeTargetParent = document.querySelector('.campPage-trap-blueprintContainer');
	if (! observeTargetParent || ! observeTargetParent.children || ! observeTargetParent.children.length > 0) {
		return;
	}

	// Observe the first child of the campPage-trap-blueprintContainer element for changes.
	const observeTarget = observeTargetParent.children[ 0 ];
	if (observeTarget) {
		observer.observe(observeTarget, {
			attributes: true,
			attributeFilter: ['class']
		});
	}
};

/**
 * Get the current page slug.
 *
 * @return {string} The page slug.
 */
const getCurrentPage = () => {
	// Grab the container element and make sure it has classes on it.
	const container = document.getElementById('mousehuntContainer');
	if (! container || container.classList.length <= 0) {
		return null;
	}

	// Use the page class as a slug.
	return container.classList[ 0 ].replace('Page', '').toLowerCase();
};

/**
 * Get the saved settings.
 *
 * @param {string}  key          The key to get.
 * @param {boolean} defaultValue The default value.
 *
 * @return {Object} The saved settings.
 */
const getSetting = (key = null, defaultValue = null) => {
	// Grab the local storage data.
	const settings = JSON.parse(localStorage.getItem('mh-mouseplace-settings')) || {};

	// If we didn't get a key passed in, we want all the settings.
	if (! key) {
		return settings;
	}

	// If the setting doesn't exist, return the default value.
	if (Object.prototype.hasOwnProperty.call(settings, key)) {
		return settings[ key ];
	}

	return defaultValue;
};

/**
 * Save a setting.
 *
 * @param {string}  key   The setting key.
 * @param {boolean} value The setting value.
 *
 */
const saveSetting = (key, value) => {
	// Grab all the settings, set the new one, and save them.
	const settings = getSetting();
	settings[ key ] = value;

	localStorage.setItem('mh-mouseplace-settings', JSON.stringify(settings));
};

/**
 * Save a setting and toggle the class in the settings UI.
 *
 * @param {Node}    node  The setting node to animate.
 * @param {string}  key   The setting key.
 * @param {boolean} value The setting value.
 */
const saveSettingAndToggleClass = (node, key, value) => {
	// Toggle the state of the checkbox.
	node.classList.toggle('active');

	// Save the setting.
	saveSetting(key, value);

	// Add the completed class & remove it in a second.
	node.parentNode.classList.add('completed');
	setTimeout(() => {
		node.parentNode.classList.remove('completed');
	}, 1000);
};

/**
 * Add a setting to the preferences page.
 *
 * @param {string}  name         The setting name.
 * @param {string}  key          The setting key.
 * @param {boolean} defaultValue The default value.
 * @param {string}  description  The setting description.
 */
const addSetting = (name, key, defaultValue, description) => {
	// If we're not currently on the preferences page, bail.
	if ('preferences' !== getCurrentPage()) {
		return;
	}

	// Make sure we have the container for our settings.
	const container = document.querySelector('.mousehuntHud-page-tabContent.game_settings');
	if (! container) {
		return;
	}

	// If we don't have our custom settings section, then create it.
	const sectionExists = document.querySelector('#mh-mouseplace-settings');
	if (! sectionExists) {
		// Make the element, add the ID and class.
		const title = document.createElement('div');
		title.id = 'mh-mouseplace-settings';
		title.classList.add('gameSettingTitle');

		// Set the title of our section.
		title.textContent = 'Userscript Settings';

		// Append it.
		container.appendChild(title);

		// Add a separator.
		const seperator = document.createElement('div');
		seperator.classList.add('separator');

		// Append the separator.
		container.appendChild(seperator);
	}

	// If we already have a setting visible for our key, bail.
	const settingExists = document.getElementById(`mh-mouseplace-setting-${ key }`);
	if (settingExists) {
		return;
	}

	// Create the markup for the setting row.
	const settings = document.createElement('div');
	settings.classList.add('settingRowTable');
	settings.id = `mh-mouseplace-setting-${ key }`;

	const settingRow = document.createElement('div');
	settingRow.classList.add('settingRow');

	const settingRowLabel = document.createElement('div');
	settingRowLabel.classList.add('settingRow-label');

	const settingName = document.createElement('div');
	settingName.classList.add('name');
	settingName.innerHTML = name;

	const defaultSettingText = document.createElement('div');
	defaultSettingText.classList.add('defaultSettingText');
	defaultSettingText.textContent = defaultValue ? 'Enabled' : 'Disabled';

	const settingDescription = document.createElement('div');
	settingDescription.classList.add('description');
	settingDescription.innerHTML = description;

	settingRowLabel.appendChild(settingName);
	settingRowLabel.appendChild(defaultSettingText);
	settingRowLabel.appendChild(settingDescription);

	const settingRowAction = document.createElement('div');
	settingRowAction.classList.add('settingRow-action');

	const settingRowInput = document.createElement('div');
	settingRowInput.classList.add('settingRow-action-inputContainer');

	const settingRowInputCheckbox = document.createElement('div');
	settingRowInputCheckbox.classList.add('mousehuntSettingSlider');

	// Depending on the current state of the setting, add the active class.
	const currentSetting = getSetting(key);
	let isActive = false;
	if (currentSetting) {
		settingRowInputCheckbox.classList.add('active');
		isActive = true;
	} else if (null === currentSetting && defaultValue) {
		settingRowInputCheckbox.classList.add('active');
		isActive = true;
	}

	// Event listener for when the setting is clicked.
	settingRowInputCheckbox.onclick = (event) => {
		saveSettingAndToggleClass(event.target, key, ! isActive);
	};

	// Add the input to the settings row.
	settingRowInput.appendChild(settingRowInputCheckbox);
	settingRowAction.appendChild(settingRowInput);

	// Add the label and action to the settings row.
	settingRow.appendChild(settingRowLabel);
	settingRow.appendChild(settingRowAction);

	// Add the settings row to the settings container.
	settings.appendChild(settingRow);
	container.appendChild(settings);
};

/**
 * POST a request to the server and return the response.
 *
 * @param {string} url      The url to post to, not including the base url.
 * @param {Object} formData The form data to post.
 *
 * @return {Promise} The response.
 */
const doRequest = async (url, formData) => {
	// If we don't have the needed params, bail.
	if ('undefined' === typeof lastReadJournalEntryId || 'undefined' === typeof user) {
		return;
	}

	// If our needed params are empty, bail.
	if (! lastReadJournalEntryId || ! user || ! user.unique_hash) { // eslint-disable-line no-undef
		return;
	}

	// Build the form for the request.
	const form = new FormData();
	form.append('sn', 'Hitgrab');
	form.append('hg_is_ajax', 1);
	form.append('last_read_journal_entry_id', lastReadJournalEntryId ? lastReadJournalEntryId : 0); // eslint-disable-line no-undef
	form.append('uh', user.unique_hash ? user.unique_hash : ''); // eslint-disable-line no-undef

	// Add in the passed in form data.
	for (const key in formData) {
		form.append(key, formData[ key ]);
	}

	// Convert the form to a URL encoded string for the body.
	const requestBody = new URLSearchParams(form).toString();

	// Send the request.
	const response = await fetch(
		callbackurl ? callbackurl + url : 'https://www.mousehuntgame.com/' + url, // eslint-disable-line no-undef
		{
			method: 'POST',
			body: requestBody,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);

	// Wait for the response and return it.
	const data = await response.json();
	return data;
};

/**
 *  Add a submenu item to a menu.
 *
 * @param {Object} options The options for the submenu item.
 */
const addSubmenuItem = (options) => {
	// Default to sensible values.
	const settings = Object.assign({}, {
		menu: 'kingdom',
		label: '',
		icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
		href: '',
		callback: null,
		external: false,
	}, options);

	// Grab the menu item we want to add the submenu to.
	const menuTarget = document.querySelector(`.mousehuntHud-menu .${ settings.menu }`);
	if (! menuTarget) {
		return;
	}

	// If the menu already has a submenu, just add the item to it.
	if (! menuTarget.classList.contains('hasChildren')) {
		menuTarget.classList.add('hasChildren');
	}

	let submenu = menuTarget.querySelector('ul');
	if (! submenu) {
		submenu = document.createElement('ul');
		menuTarget.appendChild(submenu);
	}

	// Create the item.
	const item = document.createElement('li');
	item.classList.add('custom-submenu-item');
	const cleanLabel = settings.label.toLowerCase().replace(/[^a-z0-9]/g, '-');

	const exists = document.querySelector(`#custom-submenu-item-${ cleanLabel }`);
	if (exists) {
		return;
	}

	item.id = `custom-submenu-item-${ cleanLabel }`;

	// Create the link.
	const link = document.createElement('a');
	link.href = settings.href || '#';

	if (settings.callback) {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			settings.callback();
		});
	}

	// Create the icon.
	const icon = document.createElement('div');
	icon.classList.add('icon');
	icon.styles = `background-image: url(${ settings.icon });`;

	// Create the label.
	const name = document.createElement('div');
	name.classList.add('name');
	name.innerText = settings.label;

	// Add the icon and label to the link.
	link.appendChild(icon);
	link.appendChild(name);

	// If it's an external link, also add the icon for it.
	if (settings.external) {
		const externalLinkIcon = document.createElement('div');
		externalLinkIcon.classList.add('external_icon');
		link.appendChild(externalLinkIcon);

		// Set the target to _blank so it opens in a new tab.
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
	}

	// Add the link to the item.
	item.appendChild(link);

	// Add the item to the submenu.
	submenu.appendChild(item);
};

const addMouseripLink = () => {
	addSubmenuItem({
		menu: 'kingdom',
		label: 'mouse.rip',
		icon: 'https://www.mousehuntgame.com/images/ui/hud/menu/prize_shoppe.png',
		href: 'https://mouse.rip',
		external: true,
	});
};

/**
 * Build a popup.
 *
 * Templates:
 *   ajax: no close button in lower right, 'prefix' instead of title. 'suffix' for close button area.
 *   default: {*title*} {*content*}
 *   error: in red, with error icon{*title*} {*content*}
 *   largerImage: full width image {*title*} {*image*}
 *   largerImageWithClass: smaller than larger image, with caption {*title*} {*image*} {*imageCaption*} {*imageClass*} (goes on the img tag)
 *   loading: Just says loading
 *   multipleItems: {*title*} {*content*} {*items*}
 *   singleItemLeft: {*title*} {*content*} {*items*}
 *   singleItemRight: {*title*} {*content*} {*items*}
 *
 * @param {Object} options The popup options.
 */
const createPopup = (options) => {
	// If we don't have jsDialog, bail.
	if ('undefined' === typeof jsDialog || ! jsDialog) { // eslint-disable-line no-undef
		return;
	}

	// Default to sensible values.
	const settings = Object.assign({}, {
		title: '',
		content: '',
		hasCloseButton: true,
		template: 'default',
		show: true,
	}, options);

	// Initiate the popup.
	const popup = new jsDialog(); // eslint-disable-line no-undef
	popup.setIsModal(! settings.hasCloseButton);

	// Set the template & add in the content.
	popup.setTemplate(settings.template);
	popup.addToken('{*title*}', settings.title);
	popup.addToken('{*content*}', settings.content);

	// If we want to show the popup, show it.
	if (settings.show) {
		popup.show();
	}

	return popup;
};

/**
 * Create a popup with an image.
 *
 * @param {Object} options Popup options.
 */
const createImagePopup = (options) => {
	// Default to sensible values.
	const settings = Object.assign({}, {
		title: '',
		image: '',
		show: true,
	}, options);

	// Create the popup.
	const popup = createPopup({
		title: settings.title,
		template: 'largerImage',
		show: false,
	});

	// Add the image to the popup.
	popup.addToken('{*image*}', settings.image);

	// If we want to show the popup, show it.
	if (settings.show) {
		popup.show();
	}

	return popup;
};

/**
 * Show a map-popup.
 *
 * @param {Object} options The popup options.
 */
const createMapPopup = (options) => {
	// Check to make sure we can call the hg views.
	if (! (hg && hg.views && hg.views.TreasureMapDialogView)) { // eslint-disable-line no-undef
		return;
	}

	// Default to sensible values.
	const settings = Object.assign({}, {
		title: '',
		content: '',
		closeClass: 'acknowledge',
		closeText: 'ok',
		show: true,
	}, options);

	// Initiate the popup.
	const dialog = new hg.views.TreasureMapDialogView(); // eslint-disable-line no-undef

	// Set all the content and options.
	dialog.setTitle(options.title);
	dialog.setContent(options.content);
	dialog.setCssClass(options.closeClass);
	dialog.setContinueAction(options.closeText);

	// If we want to show & we can show, show it.
	if (settings.show && hg.controllers && hg.controllers.TreasureMapDialogController) { // eslint-disable-line no-undef
		hg.controllers.TreasureMapController.show(); // eslint-disable-line no-undef
		hg.controllers.TreasureMapController.showDialog(dialog); // eslint-disable-line no-undef
	}

	return dialog;
};

/**
 * Make an element draggable. Saves the position to local storage.
 *
 * @param {string} dragTarget The selector for the element that should be dragged.
 * @param {string} dragHandle The selector for the element that should be used to drag the element.
 * @param {number} defaultX   The default X position.
 * @param {number} defaultY   The default Y position.
 * @param {string} storageKey The key to use for local storage.
 */
const makeElementDraggable = (dragTarget, dragHandle, defaultX = null, defaultY = null, storageKey = null) => {
	const modal = document.querySelector(dragTarget);
	if (! modal) {
		return;
	}

	const handle = document.querySelector(dragHandle);
	if (! handle) {
		return;
	}

	/**
	 * Make sure the coordinates are within the bounds of the window.
	 *
	 * @param {string} type  The type of coordinate to check.
	 * @param {number} value The value of the coordinate.
	 *
	 * @return {number} The value of the coordinate, or the max/min value if it's out of bounds.
	 */
	const keepWithinLimits = (type, value) => {
		if ('top' === type) {
			return value < -20 ? -20 : value;
		}

		if (value < (handle.offsetWidth * -1) + 20) {
			return (handle.offsetWidth * -1) + 20;
		}

		if (value > document.body.clientWidth - 20) {
			return document.body.clientWidth - 20;
		}

		return value;
	};

	/**
	 * When the mouse is clicked, add the class and event listeners.
	 *
	 * @param {Object} e The event object.
	 */
	const onMouseDown = (e) => {
		e.preventDefault();

		// Get the current mouse position.
		x1 = e.clientX;
		y1 = e.clientY;

		// Add the class to the element.
		modal.classList.add('mh-is-dragging');

		// Add the onDrag and finishDrag events.
		document.onmousemove = onDrag;
		document.onmouseup = finishDrag;
	};

	/**
	 * When the drag is finished, remove the dragging class and event listeners, and save the position.
	 */
	const finishDrag = () => {
		document.onmouseup = null;
		document.onmousemove = null;

		// Remove the class from the element.
		modal.classList.remove('mh-is-dragging');

		if (storageKey) {
			localStorage.setItem(storageKey, JSON.stringify({ x: modal.offsetLeft, y: modal.offsetTop }));
		}
	};

	/**
	 * When the mouse is moved, update the element's position.
	 *
	 * @param {Object} e The event object.
	 */
	const onDrag = (e) => {
		e.preventDefault();

		// Calculate the new cursor position.
		x2 = x1 - e.clientX;
		y2 = y1 - e.clientY;

		x1 = e.clientX;
		y1 = e.clientY;

		const newLeft = keepWithinLimits('left', modal.offsetLeft - x2);
		const newTop = keepWithinLimits('top', modal.offsetTop - y2);

		// Set the element's new position.
		modal.style.left = `${ newLeft }px`;
		modal.style.top = `${ newTop }px`;
	};

	// Set the default position.
	let startX = defaultX || 0;
	let startY = defaultY || 0;

	// If the storageKey was passed in, get the position from local storage.
	if (storageKey) {
		const storedPosition = localStorage.getItem(storageKey);
		if (storedPosition) {
			const position = JSON.parse(storedPosition);

			// Make sure the position is within the bounds of the window.
			startX = keepWithinLimits('left', position.x);
			startY = keepWithinLimits('top', position.y);
		}
	}

	// Set the element's position.
	modal.style.left = `${ startX }px`;
	modal.style.top = `${ startY }px`;

	// Set up our variables to track the mouse position.
	let x1 = 0,
		y1 = 0,
		x2 = 0,
		y2 = 0;

	// Add the event listener to the handle.
	handle.onmousedown = onMouseDown;
};

/**
 * Log to the console.
 *
 * @param {string|Object} message The message to log.
 */
const clog = (message) => {
	// If a string is passed in, log it in line with our prefix.
	if ('string' === typeof message) {
		console.log(`%c[MousePlace] %c${ message }`, 'color: #ff0000; font-weight: bold;', 'color: #000000;'); // eslint-disable-line no-console
	} else {
		// Otherwise, log it separately.
		console.log('%c[MousePlace]', 'color: #ff0000; font-weight: bold;', 'color: #000000;'); // eslint-disable-line no-console
		console.log(message); // eslint-disable-line no-console
	}
};
