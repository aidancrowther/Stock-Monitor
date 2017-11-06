const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const ROOT = app.getAppPath()+'/Resources/Data/';

var products = {};

if(!fs.existsSync(ROOT)) fs.mkdirSync(ROOT);
if(!fs.existsSync(ROOT+'products.json')) fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));

let win;

function createWindow(){

	win = new BrowserWindow({width:800, height:600});

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'Resources/html/main.html'), 
		protocol: 'file',
		slashes: true
	}));

	win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin'){app.quit();}
});

app.on('activate', () => {
	if(win === null){ createWindow(); }
});

ipcMain.on('newItem', function(event, args){
	newItem = args;
	var name = newItem.name.replace(' ', '_');
	products[name] = newItem;
	fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
	win.webContents.send('productList', products);
});

ipcMain.on('removeItems', function(event, args){
	for(var toRemove in args){
		if(products[args[toRemove]]) delete products[args[toRemove]];
	}
	fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
});

ipcMain.on('getProducts', function(){
	products = JSON.parse(fs.readFileSync(ROOT+'products.json'));
	win.webContents.send('productList', products);
});