"use strict";

let fs = require("fs");
let path = require("path");

// Modified to support Jumpscare changing, As well as Google API

/**
 * Swapping Handler
 *
 * @class Swapper
 */
class Swapper {
	/**
	 * Creates an instance of Swapper.
	 *
	 * @param {import("electron").BrowserWindow} win
	 * @param {string} swapperMode
	 * @param {string} swapDir
	 * @memberof Swapper
	 */
	constructor(win, swapperMode, swapDir){
		this.win = win;
		this.swapperMode = swapperMode;
		this.swapDir = swapDir;
		this.urls = [];
	}

	/**
	 * Advanced Swapper
	 *
	 * @private
	 * @param {import("electron").BrowserWindow} win
	 * @param {string} [prefix=""]
	 * @memberof Swapper
	 */
	#recursiveSwapNormal = (win, prefix = "") => {
		try {
			fs.readdirSync(path.join(this.swapDir, prefix), { withFileTypes: true }).forEach(dirent => {
				if (dirent.isDirectory()) this.#recursiveSwapNormal(win, `${prefix}/${dirent.name}`);
				else {
					let pathname = `${prefix}/${dirent.name}`;
					this.urls.push(
						...(/^\/(models|textures|sound|scares|videos)($|\/)/.test(pathname)
							? [
								`*://assets.krunker.io${pathname}`,
								`*://assets.krunker.io${pathname}?*`,
								`*://storage.googleapis.com/assets.krunker.io${pathname}`,
								`*://storage.googleapis.com/assets.krunker.io${pathname}?*`
							] : [
								`*://krunker.io${pathname}`,
								`*://krunker.io${pathname}?*`,
								`*://comp.krunker.io${pathname}`,
								`*://comp.krunker.io${pathname}?*`,
								`*://storage.googleapis.com/krunker.io${pathname}`,
								`*://storage.googleapis.com/krunker.io${pathname}?*`,
								`*://storage.googleapis.com/comp.krunker.io${pathname}`,
								`*://storage.googleapis.com/comp.krunker.io${pathname}?*`
							]
						)
					);
				}
			});
		}
		catch (err){
			console.error("Failed to swap resources in normal mode", err, prefix);
		}
	}

	/**
	 * Advanced Swapper
	 *
	 * @private
	 * @param {import("electron").BrowserWindow} win
	 * @param {string} [prefix=""]
	 * @param {string} [hostname=""]
	 * @memberof Swapper
	 */
	#recursiveSwapHostname = (win, prefix = "", hostname = "") => {
		try {
			fs.readdirSync(path.join(this.swapDir, prefix), { withFileTypes: true }).forEach(dirent => {
				if (dirent.isDirectory()){
					this.#recursiveSwapHostname(
						win,
						hostname ? `${prefix}/${dirent.name}` : prefix + dirent.name,
						hostname || dirent.name
					);
				}
				else if (hostname) this.urls.push(`*://${prefix}/${dirent.name}`, `*://${prefix}/${dirent.name}?*`);
			});
		}
		catch (err){
			console.error("Failed to swap resources in advanced mode", err, prefix, hostname);
		}
	}

	/**
	 * Initialize the Swapping process
	 *
	 * @memberof Swapper
	 */
	init(){
		switch (this.swapperMode){
			case "normal": {
				this.#recursiveSwapNormal(this.win);
				this.urls.length && this.win.webContents.session.webRequest.onBeforeRequest({
					urls: this.urls
				}, (details, callback) => {
					let { hostname, pathname } = new URL(details.url);
					var finalPathName = pathname;
					if(hostname == "storage.googleapis.com"){
						var pathArray = pathname.split('/');
						var nobodylikesthisurlshitkrunker = pathArray.shift();
						nobodylikesthisurlshitkrunker = pathArray.shift();
						finalPathName = "";
						for (var i = 0; i < pathArray.length; i++) {
							finalPathName += "/";
							finalPathName += pathArray[i];
						}
					}
					callback({redirectURL: "tf-swap:/" + path.join(this.swapDir, finalPathName)});
				});
				break;
			}
			case "advanced": {
				this.#recursiveSwapHostname(this.win);
				this.urls.length && this.win.webContents.session.webRequest.onBeforeRequest({ urls: this.urls }, (details, callback) => {
					let { hostname, pathname } = new URL(details.url);
					callback({ redirectURL: "tf-swap:/" + path.join(this.swapDir, hostname, pathname) });
				});
				break;
			}
			default: return;
		}
	}
}

module.exports = Swapper;
