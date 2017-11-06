var productSettingMenu = false;
var addProductMenu = false;
var products = {};

$(document).ready(function(){
	$('#productMod').click(productMod);
	$('#addProduct').click(addProduct);
	$('#addNewItem').click(addNewItem);

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

ipcRenderer.on('productList', function(event, args){
	$('#productTableHeader').html('');

	for(var key in args){
		var item = '<tr>'+
			'<td><input type="checkbox" name="selected" value='+key+'></td>'+
			'<td>'+args[key].name+'</td>'+
			'<td>'+args[key].type+'</td>'+
			'<td>'+args[key].status+'</td>'+
			'<td>'+args[key].image+'</td>'+
			'</tr>';
		$('#productTableHeader').append(item);
	}
});