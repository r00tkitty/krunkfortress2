const { app, BrowserWindow } = require('electron');
const path = require('path');
const { screen } = require('electron');


function createSplashWindow() {
  const {width, height} = screen.getPrimaryDisplay().size;

  const window = new BrowserWindow({
  
    frame: false,
    width: width * 0.2,
    height: height * (2 / 9),
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')

    }
  });

  window.loadURL('C:/Users/g20mi/Desktop/Projects/Games/Mods/Krunker/Client/TF2-client/app/splash/splash.html');
  console.log(height);
console.log(width);
}

function createLogoWindow() {
  const {screenWidth, screenHeight} = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
  
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  window.loadURL('C:/Users/g20mi/Desktop/Projects/Games/Mods/Krunker/Client/TF2-client/app/introvid/splash.html');
}

function createGameWindow() {
  const {screenWidth, screenHeight} = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    
    fullscreen: true,
    frame: false,
    webPreferences: {
      
      preload: path.join(__dirname, 'preload.js')
    }
  });
  

  window.loadURL('https://krunker.io/');
}

// app.on('ready', createGameWindow);
app.on('ready', createSplashWindow);
