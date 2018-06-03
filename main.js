const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const ROOT = app.getAppPath()+'/Resources/Data/';

if(!fs.existsSync(ROOT)) fs.mkdirSync(ROOT);
if(!fs.existsSync(ROOT+'Images/')) fs.mkdirSync(ROOT+'Images/');

var images = fs.readdirSync(ROOT+'/Images/');

var categories = [];
var subCategories = [];
var products = {};
var layouts = {};
var displays = [];

if(!fs.existsSync(ROOT+'layouts.json')) fs.writeFileSync(ROOT+'layouts.json', JSON.stringify(layouts));
if(!fs.existsSync(ROOT+'products.json')) fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
if(!fs.existsSync(ROOT+'categories.json')) fs.writeFileSync(ROOT+'categories.json', JSON.stringify(categories));
if(!fs.existsSync(ROOT+'subCategories.json')) fs.writeFileSync(ROOT+'subCategories.json', JSON.stringify(subCategories));
if(!fs.existsSync(ROOT+'displays.json')) fs.writeFileSync(ROOT+'displays.json', JSON.stringify(displays));
if(images.indexOf('default.jpg') == -1) copySync(ROOT+'../images/default.jpg', ROOT+'Images/default.jpg');

let win;

//Create main display window
function createWindow(){

	win = new BrowserWindow({width:800, height:600});

	//Load main.html
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'Resources/html/main.html'), 
		protocol: 'file',
		slashes: true
	}));

	//win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
		app.quit();
	});

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin'){app.quit();}
});

app.on('activate', () => {
	if(win === null){ createWindow(); }
});

//When a new item is sent, add it to the list of items and save it to a file
ipcMain.on('newItem', function(event, args){
	newItem = args;
	var name = newItem.name.replace(/ /g, '_');
	products[name] = newItem;
	fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
	win.webContents.send('productList', products);
});

//Remove the specified element from the list of items, and update the file
ipcMain.on('removeItems', function(event, args){
	for(var toRemove in args){
		if(products[args[toRemove]]) delete products[args[toRemove]];
	}
	fs.writeFileSync(ROOT+'products.json', JSON.stringify(products));
});

//Return a list of all products
ipcMain.on('getProducts', function(){
	if(!Object.keys(products).length) products = JSON.parse(fs.readFileSync(ROOT+'products.json'));
	win.webContents.send('productList', products);
});

//Add the listed image to the list of images
ipcMain.on('newImage', function(event, args){
	if(images.indexOf(args[0]) <= 0) images.push(args[1]);
	if(!fs.existsSync(ROOT+'Images/'+args[1])) copySync(args[0], ROOT+'Images/'+args[1]);
	win.webContents.send('getImages', images);
});

//Return the list of all images
ipcMain.on('getImages', function(){
	if(!images.length) images = fs.readdirSync(ROOT+'/Images/');
	win.webContents.send('getImages', images);
});

//Add the specified category to the list of categories
ipcMain.on('newCategory', function(event, args){
	if(categories.indexOf(args) < 0){
		categories.push(args);
		updateCategories();
	}
});

//Add the specified sub-category
ipcMain.on('newSubCategory', function(event, args){
	if(subCategories.indexOf(args) < 0){
		subCategories.push(args);
		updateSubCategories();
	}
});

//Remove the specified category
ipcMain.on('removeCategory', function(event, args){
	if(categories.indexOf(args) >= 0){
		categories.splice(categories.indexOf(args), 1);
		updateCategories()
	}
});

//Remove the specified subcategory
ipcMain.on('removeSubCategory', function(event, args){
	if(subCategories.indexOf(args) >= 0){
		subCategories.splice(subCategories.indexOf(args), 1);
		updateSubCategories()
	}
});

//Return the list of categories
ipcMain.on('getCategories', function(event, args){
	if(!categories.length) categories = JSON.parse(fs.readFileSync(ROOT+'categories.json'));
	win.webContents.send('getCategories', categories);
});

//Return a list of all sub-categories
ipcMain.on('getSubCategories', function(event, args){
	if(!subCategories.length) subCategories = JSON.parse(fs.readFileSync(ROOT+'subCategories.json'));
	win.webContents.send('getSubCategories', subCategories);
});

//Return a list of all layouts
ipcMain.on('getLayouts', function(event, args){
	if(!Object.keys(layouts).length) layouts = JSON.parse(fs.readFileSync(ROOT+'layouts.json'));
	win.webContents.send('getLayouts', layouts);
});

//Add the specified layout
ipcMain.on('addLayout', function(event, args){
	var newLayout = args;
	var name = args['main'].replace(/ /g, '_');
	layouts[name] = newLayout;
	fs.writeFileSync(ROOT+'layouts.json', JSON.stringify(layouts));
	win.webContents.send('getLayouts', layouts);
});

//Remove the specified layout
ipcMain.on('removeLayouts', function(event, args){
	for(var toRemove in args){
		if(layouts[args[toRemove]]) delete layouts[args[toRemove]];
	}
	fs.writeFileSync(ROOT+'layouts.json', JSON.stringify(layouts));
});

//Return a list of all displays
ipcMain.on('getDisplays', function(event, args){
	if(!Object.keys(displays).length) displays = JSON.parse(fs.readFileSync(ROOT+'displays.json'));
	win.webContents.send('getDisplays', displays);
});

//Add the specified display
ipcMain.on('addDisplay', function(event, args){
	if(displays.indexOf(args) < 0){
		displays.push(args);
		updateDisplays();
	}
});

//Remove the specified display
ipcMain.on('removeDisplay', function(event, args){
	if(indexOfObj(displays, args) >= 0){
		displays.splice(indexOfObj(displays, args), 1);
		updateDisplays();
	}
});

//update the list of categories
function updateCategories(){
	fs.writeFileSync(ROOT+'categories.json', JSON.stringify(categories));
	categories = JSON.parse(fs.readFileSync(ROOT+'categories.json'));
	win.webContents.send('getCategories', categories);
}

//update the list of sub-categories
function updateSubCategories(){
	fs.writeFileSync(ROOT+'subCategories.json', JSON.stringify(subCategories));
	subCategories = JSON.parse(fs.readFileSync(ROOT+'subCategories.json'));
	win.webContents.send('getSubCategories', subCategories);
}

function updateDisplays(){
	fs.writeFileSync(ROOT+'displays.json', JSON.stringify(displays));
	displays = JSON.parse(fs.readFileSync(ROOT+'displays.json'));
	win.webContents.send('updateDisplays', displays);
}

//synchronously copy a file
function copySync(src, dest){
	if (!fs.existsSync(src)) console.log('Source doesn\'t exist');

	var inStr = fs.createReadStream(src);
	var outStr = fs.createWriteStream(dest);

	inStr.pipe(outStr);
}

function indexOfObj(arr, o) {    
	var match = true;
    for (var i = 0; i < arr.length; i++) {
    	if(arr[i]['id'] == o['id']) return i;
    }
    return -1;
}