const { ipcRenderer, remote, shell } = require('electron');

var settingsModal = false;
var products = {};
var images = [];
var categories = [];
var subCategories = [];

$(document).keydown(function(e){
	if(e.keyCode==27){loadMenu();}
});

function loadMenu(){
	if(!settingsModal){
		$('#settingsModal').modal('show');
		settingsModal = true;
	}
	else{
		$('#settingsModal').modal('hide');
		settingsModal = false;
	}
}

function updateCategories(selectMenu, defaultSelection, chosenCategory){
	$('#'+selectMenu).html('');
	var defaultOption = '';
	for(var category in chosenCategory){
		defaultOption = '';
		if(category == defaultSelection) defaultOption = 'selected';
		$('#'+selectMenu).append('<option value="'+chosenCategory[category]+'"'+defaultOption+'>'+chosenCategory[category]+'</option>');
	}
}

ipcRenderer.on('getImages', function(event, args){
	images = args;
});

ipcRenderer.on('getCategories', function(event, args){
	categories = args;
	updateCategories('productCategory', 0, categories);
	updateCategories('layoutMain', 0, categories);
});

ipcRenderer.on('getSubCategories', function(event, args){
	subCategories = args;
	updateCategories('productSubCategory', 0, subCategories);
	updateCategories('layoutSub', -1, subCategories);
});

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
			'</tr>';
		$('#productTableHeader').append(item);
	}

	products = args;
});