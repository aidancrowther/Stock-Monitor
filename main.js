const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const ROOT = app.getAppPath()+'/Resources/Data/';

var images = fs.readdirSync(ROOT+'/Images/');
var categories = [];
var products = {};

if(!fs.existsSync(ROOT)) fs.mkdirSync(ROOT);
if(!fs.existsSync(ROOT+'Images/')) fs.mkdirSync(ROOT+'Images/');
if(!fs.existsSync(ROOT+'products.json')) fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
if(!fs.existsSync(ROOT+'categories.json')) fs.writeFileSync(ROOT+'categories.json', JSON.stringify(categories));

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
	var name = newItem.name.replace(/ /g, '_');
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

ipcMain.on('newImage', function(event, args){
	if(images.indexOf(args[0]) <= 0) images.push(args[1]);
	if(!fs.existsSync(ROOT+'Images/'+args[1])) copySync(args[0], ROOT+'Images/'+args[1]);
	win.webContents.send('getImages', images);
});

ipcMain.on('getImages', function(){
	images = fs.readdirSync(ROOT+'/Images/');
	win.webContents.send('getImages', images);
});

ipcMain.on('newCategory', function(event, args){
	if(categories.indexOf(args) <= 0){
		categories.push(args);
		updateCategories();
	}
});

ipcMain.on('removeCategory', function(event, args){
	if(categories.indexOf(args) >= 0){
		categories.splice(categories.indexOf(args), 1);
		updateCategories()
	}
});

ipcMain.on('getCategories', function(event, args){
	categories = JSON.parse(fs.readFileSync(ROOT+'categories.json'));
	win.webContents.send('getCategories', categories);
})

function updateCategories(){
	fs.writeFileSync(ROOT+'categories.json', JSON.stringify(categories));
	categories = JSON.parse(fs.readFileSync(ROOT+'categories.json'));
	win.webContents.send('getCategories', categories);
}

function copySync(src, dest){
	if (!fs.existsSync(src)) console.log('Source doesn\'t exist');

	var inStr = fs.createReadStream(src);
	var outStr = fs.createWriteStream(dest);

	inStr.pipe(outStr);
}