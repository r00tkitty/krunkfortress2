const fs = require('fs');
const {
	ipcRenderer
} = require('electron');
const path = require('path');
const settingsLoader = require('../loaders/settingsLoader');
const nfetch = require('node-fetch');
require('v8-compile-cache');

const Store = require('electron-store');
const userPrefs = new Store();

// Allows game exit
document.addEventListener("keydown", (event) => {
	if (event.code == "Escape") {
		document.exitPointerLock();
	}
})

// Settings Stuff
let lastActiveTab = 0;
document.addEventListener("DOMContentLoaded", (event) => {
	// Notif Stuff
	notificationUtils.createNotifBox();

	// Badge Cache
	if (userPrefs.get("clientSettings.badges") == true) {
		const badgeUtils = require("../utils/badgeUtils");
		if (userPrefs.get("updateBadgeCache")) {
			badgeUtils.updateBadgeCache(true);
			userPrefs.set("updateBadgeCache", false);
		} else {
			badgeUtils.updateBadgeCache(false)
		}
	}

	// Fix for knife menu not closing after selecting a knife
	window.equip = false;

	// Fix for server browser input
	let showWindow = window.showWindow;
	window.showWindow = function () {
		if (arguments[0] == 2 && document.getElementById('serverSearch')) return
		return showWindow.apply(this, arguments);
	};

	// Disable bundles
	if (userPrefs.get("clientSettings.disableBundles", false) == true) {
		Object.defineProperty(window, "onBundleRes", { get: () => () => { }, set() { } });
	}
	// Disable Free KR
	if (userPrefs.get("clientSettings.disableFreeKR", false) == true) {
		Object.defineProperty(window, "freeKRAuto", { get: () => () => { }, set() { } });
		Object.defineProperty(window, "freeKRPopup", { get: () => () => { }, set() { } });
	}

	// These ads are by far the laggiest so I have to remove them
	document.querySelectorAll("#endAMerger").forEach((element) => {
		element.innerHTML = '';
	});

	// Exit Client Buttons
	if (userPrefs.get("clientSettings.clientExit") == true) {
		let clientExitButton = document.getElementById("clientExit");
		clientExitButton.id = "gatoClientExit";
		clientExitButton.addEventListener('click', () => {
			document.getElementById("confirmBtn").addEventListener('click', () => {
				ipcRenderer.send("exitClient");
			});
		});
	}

	// Side Menu Items
	const menuItemList = document.getElementById("menuItemContainer").children;
	for (let i = 0; i < menuItemList.length; i++) {
		if (menuItemList[i].getAttribute("onclick").includes("showWindow(49)") && userPrefs.get("clientSettings.hideEsports", false)) { // Ranked Button
			menuItemList[i].style.display = "none";
		}
		if (menuItemList[i].getAttribute("onclick").includes(`logBtnFRVR("settings")`) || menuItemList[i].getAttribute("onclick").includes(`showWindow(1)`)) { // Ranked Button
			menuItemList[i].addEventListener('click', () => {
				updateSettingsTabs(lastActiveTab, true, true);
			});
		}
	}

	// Load Required CSS
	const cssFolder = path.join(__dirname, '../assets');
	cssLoader.toggleCSS(fs.readFileSync(path.join(cssFolder, 'default.css'), 'utf8'), "default", true);
	cssLoader.toggleCSS(fs.readFileSync(path.join(cssFolder, 'addonMenu.css'), 'utf8'), "addonMenu", true);
	if (userPrefs.get("clientSettings.menuTimer") == true) {
		cssLoader.toggleCSS(fs.readFileSync(path.join(cssFolder, 'menuTimer.css'), 'utf8'), "menuTimer", true)
	}
	if (userPrefs.get("clientSettings.hidePhonePop") == true) {
		cssLoader.toggleCSS(`#phonePop{display:none;}`, "hidePhonePop", true)
	}
	if (userPrefs.get("clientSettings.hideAds") == true) {
		cssLoader.toggleCSS(fs.readFileSync(path.join(cssFolder, 'hideAds.css'), 'utf8'), "hideAds", true)
	}
	if (userPrefs.get("clientSettings.loadingBackground").length > 0 && userPrefs.get("clientSettings.loadingBackground") != undefined) {
		cssLoader.toggleCSS(`#initLoader{background-image: url(${userPrefs.get("clientSettings.loadingBackground")})!important;background-size:cover;}`, "loadingBackground", true)
	}
	if (userPrefs.get("clientSettings.loadingIcon") !== "default" && userPrefs.get("clientSettings.loadingIcon") != undefined) {
		cssLoader.toggleCSS(fs.readFileSync(path.join(cssFolder, `spinner-${userPrefs.get("clientSettings.loadingIcon")}.css`), 'utf8'), "loadingIcon", true)
	}


	// Register On Game Load Event
	var observer = new MutationObserver(function () {
		onGameLoad()
		observer.disconnect();
	});
	let loadingBg = document.getElementById("loadingBg")
	observer.observe(loadingBg, {
		attributes: true
	});

});