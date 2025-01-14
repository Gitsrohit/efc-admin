import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
const preloadPath = path.resolve(__dirname, 'preload.js');

// app.whenReady().then(() => {
//   session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
//     callback({
//       responseHeaders: {
//         ...details.responseHeaders,
//         'Content-Security-Policy': [
//           "default-src 'self'; connect-src 'self' https://efc-app-sprp.onrender.com;",
//         ],
//       },
//     });
//   });
// });

// const createWindow = () => {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: preloadPath,
//       preload: preloadPath,
//       contextIsolation: true, // Isolates context for security
//       enableRemoteModule: false, // Disables remote module
//       nodeIntegration: false,
//     },
//     autoHideMenuBar: true,
//   });


// };
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'efc-admin/.webpack/renderer/main_window/preload.js'), // Correct path
      contextIsolation: true, // Recommended for security
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: false, 
    },
    autoHideMenuBar: true,
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};





// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
  createWindow();
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    let headers = details.responseHeaders;
    headers['Content-Security-Policy'] = ["default-src 'self'; connect-src 'self' https://efc-app-sprp.onrender.com;"];
    callback({
      responseHeaders: headers,
    });
  });
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    console.log('Request:', details);
    callback({});
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

