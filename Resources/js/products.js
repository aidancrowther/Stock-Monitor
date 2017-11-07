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
		$('#tableSearch').css('display', 'none');
	}
	else{
		$('#addProductMenu').css('display', 'none');
		addProductMenu = false;
		$('#productTable').css('display', '');
		$('#tableSearch').css('display', '');
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

	if(!updatingProducts) $('#updateProducts').html('Apply Changes');
	else $('#updateProducts').html('Update Selected');

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
					'<td><select id="'+current+'Status" class="form-control">'+
						'<option value="default">Default</option>'+
						'<option value="sale">Sale</option>'+
						'<option value="clearance">Clearance</option>'+
						'<option value="discontinued">Discontinued</option>'+
					'</select></td>'+
					'<td><button class="btn btn-default">Change Image</button></td>'
				);
				$('#'+current+'Status').val(products[current].status);
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
		updateSelected();
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

function findProduct(){
	var input = $('#tableSearchBox').val();
	var table = document.getElementById("productTableHeader");
	var tr = table.getElementsByTagName("tr");

	for(var i=0; i<tr.length; i++){
		var rowMatch = false;
		td = tr[i].getElementsByTagName("td");
		for(var j=1; j<td.length; j++){
			if(td[j].innerHTML.indexOf(input) >= 0) rowMatch = true;
		}
		if(rowMatch) tr[i].style.display = '';
		else tr[i].style.display = 'none';
	}
}

ipcRenderer.on('productList', function(event, args){
	$('#productTableHeader').html('');

	for(var key in args){
		var alreadySelected = '';
		if(checked.indexOf(key) >= 0) alreadySelected = ' checked';
		var item = '<tr id="'+key.replace(/ /g, '_')+'">'+
			'<td><input onclick="updateSelected();" type="checkbox" name="selected" value='+key.replace(/ /g, '_')+alreadySelected+'></td>'+
			'<td>'+args[key].name+'</td>'+
			'<td>'+args[key].type+'</td>'+
			'<td>'+args[key].status+'</td>'+
			'<td>'+args[key].image+'</td>'+
			'</tr>';
		$('#productTableHeader').append(item);
	}

	products = args;
});