const { ipcRenderer, remote, shell } = require('electron');

var settingsModal = false;
var settingsModalEnabled = true;
var products = {};
var layouts = {};
var displays = [];
var images = [];
var categories = [];
var subCategories = [];

$(document).ready(function(){

	ipcRenderer.send('getProducts');
	ipcRenderer.send('getImages');
	ipcRenderer.send('getCategories');
	ipcRenderer.send('getSubCategories');
	ipcRenderer.send('getLayouts');
	ipcRenderer.send('getDisplays');

});

//Open the menu when the escape key is pressed
$(document).keydown(function(e){
	if(e.keyCode==27){loadMenu();}
});

//Load/Hide the menu based on its current status
function loadMenu(){
	if(settingsModalEnabled){
		if(!settingsModal){
			$('#settingsModal').modal('show');
			settingsModal = true;
		}
		else{
			$('#settingsModal').modal('hide');
			settingsModal = false;
		}
	}
}

//Update the categories in a given menu, defaulting to a predetermined option
function updateCategories(selectMenu, defaultSelection, chosenCategory){
	$('#'+selectMenu).html('');
	var defaultOption = '';
	for(var category in chosenCategory){
		defaultOption = '';
		if(category == defaultSelection) defaultOption = 'selected';
		$('#'+selectMenu).append('<option value="'+chosenCategory[category]+'"'+defaultOption+'>'+chosenCategory[category]+'</option>');
	}
}

//Close a dialog box
function clearDisplay(element){
	$(element).delay(3000);
	$(element).slideUp();
}

//Update list of images upon receiving them
ipcRenderer.on('getImages', function(event, args){
	images = args;
});

//Update list of categories upon receiving them
ipcRenderer.on('getCategories', function(event, args){
	categories = args;
	updateCategories('productCategory', 0, categories);
	updateCategories('layoutMain', 0, categories);
	updateCategories('displayCategory', -1, categories);
});

//Update list of sub-categories upon receiving them
ipcRenderer.on('getSubCategories', function(event, args){
	subCategories = args;
	updateCategories('productSubCategory', 0, subCategories);
	updateCategories('layoutSub', -1, subCategories);
});

//Update list of products, and add each product to the product table
ipcRenderer.on('productList', function(event, args){
	$('#productTableHeader').html('');

	for(var key in args){
		var alreadySelected = '';
		var item = '<tr id="'+key.replace(/ /g, '_')+'">'+
			'<td><input onclick="updateSelected();" type="checkbox" name="selected" value='+key.replace(/ /g, '_')+alreadySelected+'></td>'+
			'<td>'+args[key].name+'</td>'+
			'<td>'+args[key].type+'</td>'+
			'<td>'+args[key].subType+'</td>'+
			'<td>'+args[key].status+'</td>'+
			'<td>'+args[key].image+'</td>'+
			'<td><label id="'+key+'DescriptionLabel" class="updateButton btn btn-file btn-default">Description<input type="button" style="display:none" onclick="showDescription(\''+key+'\');" id="'+key+'Description"></input></label></td>'+
			'</tr>';
			$('#productTableHeader').append(item);
	}

	products = args;
	drawLayouts();
});

//update the list of layouts
ipcRenderer.on('getLayouts', function(event, args){
	layouts = args;
	updateLayouts();
	drawLayouts();
});

ipcRenderer.on('getDisplays', function(event, args){
	displays = args;
	updateDisplays();
	drawLayouts();
});