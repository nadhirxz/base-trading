const { app, BrowserWindow } = require('electron');

function createWindow() {
	const win = new BrowserWindow({
		show: false,
		width: 800,
		height: 600,
		icon: require('path').join(__dirname, 'icon.png'),
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.setMenuBarVisibility(false)
	win.maximize()
	win.on('closed', () => app.quit());
	win.loadFile('index.html');
	win.show();
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
