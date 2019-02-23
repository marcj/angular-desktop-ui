import 'reflect-metadata';
import {app, BrowserWindow, ipcMain, Menu, screen, systemPreferences, Tray} from 'electron';
import * as path from 'path';

let win: BrowserWindow | null;

// app.commandLine.appendSwitch('ignore-gpu-blacklist');

// process.stdout.write('Hi\n');
// console.log(process.execPath);

app.dock.hide();
// app.disableHardwareAcceleration();

const assetsPath = path.join(__dirname, '../assets');

async function createWindow() {
    if (win) {
        return;
    }

    app.dock.show();

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        center: true,
        width: 750,
        // backgroundColor: '#66CD00AA',
        // transparent: true,
        height: 700,
        vibrancy: 'appearance-based',
        webPreferences: {
            nodeIntegration: false,
        },
        titleBarStyle: 'hidden',
        icon: path.join(assetsPath, 'icons/64x64.png')
    });

    // we do this in server bootstrap, not in electron
    // const homeConfig = await getHomeConfig();
    // if (!homeConfig.getLocalAccount()) {
    //     //when we have no local account yet in ~/.deepkit/config, we create one
    //     homeConfig.setLocalToken(uuid().replace(/-/g, ''), os.userInfo().username);
    //     await setHomeConfig(homeConfig);
    // }
    // win.hide();

    win.webContents.on('context-menu', (e, props) => {
        const InputMenu = Menu.buildFromTemplate([{
            label: 'Undo',
            role: 'undo',
        }, {
            label: 'Redo',
            role: 'redo',
        }, {
            type: 'separator',
        }, {
            label: 'Cut',
            role: 'cut',
        }, {
            label: 'Copy',
            role: 'copy',
        }, {
            label: 'Paste',
            role: 'paste',
        }, {
            type: 'separator',
        }, {
            label: 'Select all',
            role: 'selectall',
        },
        ]);
        const {inputFieldType} = props;
        if (inputFieldType === 'plainText') {
            InputMenu.popup({window: win});
        }
    });

    win.loadURL('http://localhost:4200');

    //when building
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'app/index.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
    // }

    win.webContents.openDevTools();

    const setOSTheme = () => {
        const mode = systemPreferences.isDarkMode() ? 'dark' : 'light';
        const code = `
            document.body.classList.remove('dark');
            document.body.classList.remove('light');
            document.body.classList.add('${mode}');
        `;

        const vibrancy = mode === 'dark' ? 'ultra-dark' : 'appearance-based';

        win.setVibrancy(vibrancy);
        console.log('setVibrancy', vibrancy);

        // win.setVibrancy('appearance-based');
        win.webContents.executeJavaScript(code);
    };

    if (process.platform === 'darwin') {
        systemPreferences.subscribeNotification(
            'AppleInterfaceThemeChangedNotification',
            setOSTheme,
        );

    }

    // Emitted when the window is closed.
    win.webContents.on('did-finish-load', () => {
        win.webContents.executeJavaScript(`document.body.classList.add('electron')`);
        setOSTheme();
    });

    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        app.dock.hide();
    });
}

// This will register the TypeScript compiler
// require('ts-node').register();

let tray: Tray;

try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', async () => {
        await createWindow();

        tray = new Tray(path.join(assetsPath, 'tray/16x16.png'));

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Open', type: 'normal', click: async () => {
                    await createWindow();
                }
            },
            {type: 'separator'},
            {
                label: 'Close', type: 'normal', click: () => {
                    app.quit();
                }
            },
        ]);
        tray.setToolTip('DeepKit.');
        tray.setContextMenu(contextMenu);

        tray.setTitle(`0`);
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
} catch (e) {
    // Catch Error
    // throw e;
}
