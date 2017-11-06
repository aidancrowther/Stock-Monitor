var productSettingMenu = false;
var addProductMenu = false;
var updatingProducts = false;
var allChecked = false;
var checked = [];
var products = {};

$(document).ready(function(){
	$('#productMod').click(productMod);
	$('#addProduct').click(addProduct);
	$('#addNewItem').click(addNewItem);
	$('#updateProducts').click(updateProducts);
	$('#removeProducts').click(removeSelected);

	ipcRenderer.send('getProducts');
});

function productMod(){
	if(!productSettingMenu){
		$('#products').css('display', '');
		productSettingMenu = true;
	}
	else{
		$('#products').css('display', 'none');
		productSettingMenu = false;
	}
}

function addProduct(){
	if(!addProductMenu){
		$('#addProductMenu').css('display', '');
		addProductMenu = true;
		$('#productTable').css('display', 'none');
	}
	else{
		$('#addProductMenu').css('display', 'none');
		addProductMenu = false;
		$('#productTable').css('display', '');
	}
}

function addNewItem(){
	var newProduct = {};
	var valid = true;

	if($('#productName').val()) newProduct['name'] = $('#productName').val();
	else valid = false;
	if($('#productCategory').val()) newProduct['type'] = $('#productCategory').val().toLowerCase();
	else valid = false;
	if($('#productStatus').val()) newProduct['status'] = $('#productStatus').val().toLowerCase();
	else valid = false;
	if($('#productImage').val()) newProduct['image'] = $('#productImage').val();
	else newProduct['image'] = 'default';

	if(valid) ipcRenderer.send('newItem', newProduct);
	else alert('Please fill out all required fields');
}

function selectAll(){
	var element = $('input[name="selected"]');

	for(var product in element){
		if(element[product].name == 'selected') element[product].checked = !allChecked;
	}

	updateSelected();

	allChecked = !allChecked;
}

function updateSelected(){
	var element = $('input[name="selected"]');
	checked = [];

	for(var product in element){
		if(element[product].checked) checked.push(element[product].value);
	}
}

function updateProducts(){
	var element = $('input[name="selected"]');
	var toUpdate = [];

	for(var product in element){
		element[product].disabled = !updatingProducts;
	}

	$('input[name="selectAllBtn"]')[0].disabled = !updatingProducts;

	for(var product in element){
		if(element[product].value) toUpdate.push(checked.indexOf(element[product].value));
	}

	if(!updatingProducts){
		for(var product in toUpdate){
			var current = checked[toUpdate[product]];
			if(current){
				$('#'+checked[toUpdate[product]]).html(
					'<td><input onclick="updateSelected();" type="checkbox" name="selected" value='+current+' disabled checked></td>'+
					'<td><input class="form-control" id="'+current+'Name" value="'+products[current].name+'"></td>'+
					'<td><input class="form-control" id="'+current+'Type" value="'+products[current].type+'"></td>'+
					'<td><input class="form-control" id="'+current+'Status" value="'+products[current].status+'"></td>'+
					'<td><button class="btn btn-default">Change Image</button></td>'
				);
			}
			updateSelected();
		}
	}
	else{
		for(var product in toUpdate){
			var current = checked[toUpdate[product]];
			if(current){
				products[current] = {
					'name': $('#'+current+'Name').val(),
					'type': $('#'+current+'Type').val(),
					'status': $('#'+current+'Status').val(),
					'image': 'default'
				};
			}
			if(current){
				ipcRenderer.send('removeItems', [current]);
				ipcRenderer.send('newItem', products[current]);
			}
		}
	}

	updatingProducts = !updatingProducts;
}

function removeSelected(){
	var element = $('input[name="selected"]');
	var toRemove = [];
	var list = [];

	for(var product in element){
		if(element[product].value) toRemove.push(checked.indexOf(element[product].value));
	}

	for(var product in toRemove){
		var current = checked[toRemove[product]];
		if(current) list.push(current);
	}

	ipcRenderer.send('removeItems', list);
	ipcRenderer.send('getProducts');
}

ipcRenderer.on('productList', function(event, args){
	$('#productTableHeader').html('');

	for(var key in args){
		var item = '<tr id="'+key.replace(' ', '_')+'">'+
			'<td><input onclick="updateSelected();" type="checkbox" name="selected" value='+key.replace(' ', '_')+'></td>'+
			'<td>'+args[key].name+'</td>'+
			'<td>'+args[key].type+'</td>'+
			'<td>'+args[key].status+'</td>'+
			'<td>'+args[key].image+'</td>'+
			'</tr>';
		$('#productTableHeader').append(item);
	}

	products = args;
});