const { app, BrowserWindow, protocol, dialog, shell, screen, ipcMain, session } = require('electron');
const { join } = require('path');
const Swapper = require("./loaders/swapper");
const localStorDir = path.join(app.getPath("userData"), "/Local Storage/");

const {
  autoUpdater
} = require('electron-updater');

require('v8-compile-cache');




////////////////////////////////////////////
const createGameWindow = () => {
  const win = new BrowserWindow({
    fullscreen: fullscreenActive,
    webPreferences: {
      preload: join(__dirname, './preload/preload.js')
    }
  })

  win.loadURL('https://krunker.io/')
}

app.whenReady().then(() => {
  createGameWindow()
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})