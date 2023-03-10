const setUtil = require("../utils/settingsUtils");
const Store = require('electron-store');
const userPrefs = new Store();

class settingsLoader {
    static loadSettings() {
        setUtil.createForm()
        
        setUtil.createCategory("clientSettings", "Client Settings");
        setUtil.createCategory("visualSettings", "Visual Settings");
        setUtil.createCategory("rpcSettings", "Discord Rich Presence Client");
        setUtil.createCategory("fixSettings", "Fix Settings");
        setUtil.createCategory("keySettings", "Client Keybinds");
        setUtil.createCategory("flagSettings", "Advanced: Chromium Flags");

        function openLinkAccount(){
            const integrateUtils = require('../utils/integrateUtils');
            integrateUtils.openLinkMenu();
        }
        setUtil.createButton("linkAccount", "Link Your Discord Account", "Click to link your account to Discord in order to receive benefits such as badges", `<span class="material-icons" style="color:#FFF;font-size:32px;padding-right:8px;position:relative;top:2px">discord</span> Link Discord`, openLinkAccount, "clientSettings", false);
        setUtil.createCheckbox("uncapFps", "Uncap FPS", "Removes Frame Rate Limit from Client", "clientSettings", false, 1);
        setUtil.createCheckbox("skipUpdate", "Skip Check For Updates", "The client will not try to update itself when launching", "clientSettings", false, 1);
        setUtil.createCheckbox("skipSplash", "Disable Splash Screen", "Disables the client startup splash screen", "clientSettings", false, 1);
        setUtil.createCheckbox("startFullscreen", "Start in Fullscreen", "Launches the client in fullscreen by default", "clientSettings", false, 1);
        setUtil.createCheckbox("borderlessWindow", "Borderless Window", "Fullscreen replaced by borderless window", "clientSettings", false, 1);
        setUtil.createCheckbox("resourceSwapper", "Resource Swapper", "Loads Krunker Assets from a Local Folder (Documents/GatoclientResourceSwapper/Mod)", "clientSettings", false, 1);
        var dropdownOptions = [["default", "Default"], ["gl", "OpenGL"], ["d3d11", "Direct3D 11"], ["d3d9", "Direct3D 9"], ["d3d11on12", "Direct3D 11 on 12"], ["vulkan", "Vulkan"]];
        setUtil.createDropdown("angle-backend", "ANGLE Backend", "Changes your ANGLE backend to run off of one of the following APIs", dropdownOptions, "clientSettings", false, 1);
        setUtil.createCheckbox("clientExit", "Client Exit Button", "Adds the Exit Client Button to the Menu", "clientSettings", false, 2);
        setUtil.createCheckbox("autoUpdate", "Automatically Update", "Automatically update the client", "clientSettings", false, 1);
        setUtil.createCheckbox("badges", "Enable Client Badges & Killcards", "Shows badges and killcards representative of the user", "clientSettings", false, 2);
        setUtil.createCheckbox("enableAddons", "Enable Addons", "Turns on Addons, which can be downloaded from Krunker Social Page", "clientSettings", false, 2);
        setUtil.createCheckbox("enableHubTabs", "Enable Hub Tabs", "Turns on Tabbed View in the Krunker Hub", "clientSettings", false, 1);

        function openAddonsList(){
            let addonLoader = require('./addonLoader');
            let addonPath = userPrefs.get("addonPath");
            addonLoader.loadAddonList(addonPath);
        }
        //setUtil.createButton("addonsList", "Modify Addon Settings", "Opens up the Addon Configurator", "Open Addon Configurator", openAddonsList, "addonSettings", false);

        setUtil.createCheckbox("menuTimer", "Display Menu Timer", "Adds the current Match's Time beneath the PLAY GAME text", "visualSettings", false, 2);
        setUtil.createCheckbox("hideAds", "Hide Ads", "Hides ads from the client with css. WILL NOT BLOCK ADS.", "visualSettings", false, 2);
        setUtil.createCheckbox("hideEsports", "Hide Esports Button", "Hides esports button from the side menu with css.", "visualSettings", false, 2);
        setUtil.createCheckbox("hideCustomize", "Revert Customize to Mods", "When enabled, the customize button will stay as Mods", "visualSettings", false, 2);
        setUtil.createCheckbox("disableBundles","Disable Bundles", "Disables the Bundles from Appearing on Game Launch", "visualSettings", false, 2);
        setUtil.createCheckbox("disableFreeKR","Disable Free KR Popup", "Disables the Free KR popup from Appearing in Game", "visualSettings", false, 2);
        setUtil.createCheckbox("settingDescriptions", "Show Setting Descriptions", "Shows Settings' Descriptions below instead of as a hover", "visualSettings", false, 2);
        setUtil.createTextInput("loadingBackground", "Loading Screen Background", "Changes loading screen background image", "Enter Image URL", "visualSettings", false, 2);
        dropdownOptions = [["default", "Default"], ["holocircle", "Holo-Circle"], ["none", "No Spinner"]];
        setUtil.createDropdown("loadingIcon", "Loading Screen Spinner", "Changes the Default Cube animation", dropdownOptions, "visualSettings", false, 2);

        setUtil.createCheckbox("rpc", "Enable Rich Presence", "Displays your game's details as your Discord Activity", "rpcSettings", false,1);
        setUtil.createTextInput("rpcClientID", "Advanced: Custom RPC ID", "DO NOT TOUCH IF YOU DONT KNOW HOW IT WORKS! Allows you to change the client id for RPC", "Leave blank for Default", "rpcSettings", false, 1);
        setUtil.createTextInput("rpcClientImage", "Advanced: Custom RPC Image", "DO NOT TOUCH IF YOU DONT KNOW HOW IT WORKS! Lets you pick the image for the custom client id", "Leave blank for Default", "rpcSettings", false, 1);
        setUtil.createTextInput("rpcButtonName", "RPC Button Name", "Changes the second button on the RPC to whatever you want", "Enter Button Name", "rpcSettings", false, 1);
        setUtil.createTextInput("rpcButtonLink", "RPC Button Link", "Changes the link that the second button redirects you to", "Enter Button Link", "rpcSettings", false, 1);

        setUtil.createCheckbox("hidePhonePop","Hide KPD Phone", "Fixes an issue with krunker that causes the Game window to be pushed up by the KPD phone", "fixSettings", false, 2)
        setUtil.createCheckbox("fixCache","Fix Cache + Missing Settings", "Fixes an issue where your settings delete themselves", "fixSettings", false, 1)

        setUtil.createCheckbox("flag-remove-useless", "Remove Useless Features", "Removes useless features from Chromium", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-helpful", "Helpful Flags", "Adds flags that help Chromium function properly", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-limit-increase", "Increase Render Limits", "Increases the limits on CPU usage and rendering", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-low-latency", "Low Latency Flags", "Flags supposedly intended to lower latency", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-experimental", "Experimental Flags", "These are miscellaneous flags, I don't know if they'll help or hurt", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-gpu-rasterization", "Enable GPU Rasterization", "Attempts to share the workload between the CPU and GPU", "flagSettings", false, 1);
        setUtil.createCheckbox("flag-in-process-gpu", "In Process GPU", "Tries to make Chromium use hardware enabled graphics on its thread", "flagSettings", false, 1);
        setUtil.createTextInput("userAgent", "User Agent", "Defines the user agent used to connect to Krunker", "Best to leave blank", "flagSettings", false, 1);

        setUtil.createKeybindInput("refreshKey", "Refresh Lobby", "The key that will refresh your current lobby", "keySettings", false, 1);
        setUtil.createKeybindInput("newLobbyKey", "New Lobby", "The key that will put you in a new lobby", "keySettings", false, 1);
        setUtil.createKeybindInput("fullscreenKey", "Fullscreen Key", "The key that will enter and exit fullscreen mode", "keySettings", false, 1);
        setUtil.createKeybindInput("resetKey", "Relaunch Client", "The key that will quit out of the client and relaunch it", "keySettings", false, 1);

        setUtil.hookSaving();
    }
}
module.exports = settingsLoader