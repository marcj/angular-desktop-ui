import 'reflect-metadata';
import {app, BrowserWindow, ipcMain, Menu, screen, systemPreferences, Tray} from 'electron';
import * as path from 'path';

let win: BrowserWindow | null;

// app.commandLine.appendSwitch('ignore-gpu-blacklist');

app.dock.hide();
// app.disableHardwareAcceleration();

const assetsPath = path.join(__dirname, '../assets');

async function createWindow() {
    if (win) {
        return;
    }

    app.dock.show();

    // Create the browser window.
    win = new BrowserWindow({
        center: true,
        width: 750,
        height: 750,
        vibrancy: 'window',
        webPreferences: {
            allowRunningInsecureContent: false,
            preload: __dirname + '/../../node_modules/@marcj/angular-desktop-ui/preload.js',
            sandbox: true,
        },
        titleBarStyle: 'hidden',
        icon: path.join(assetsPath, 'icons/64x64.png')
    });

    win.webContents.openDevTools({mode: 'undocked'});
    win.loadURL('http://localhost:4200');

    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        app.dock.hide();
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    await createWindow();
});

// app.on('test', () => {
//   console.log('test', arguments);
// });

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // if (process.platform !== 'darwin') {
    //     app.quit();
    // }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
