var updatingProducts = false;
var allChecked = false;
var selectedImage = 'default.jpg';
var buttonHtml = "<form id='imageForm'><input type='file' style='display:none' id='productImageChoice' onchange='selectImage();'></form>";
var checked = [];
var products = {};
var images = [];
var categories = [];

$(document).ready(function(){
	$('#productMod').click(productMod);
	$('#addProduct').click(addProduct);
	$('#addNewItem').click(addNewItem);
	$('#updateProducts').click(updateProducts);
	$('#removeProducts').click(removeSelected);
	$('#addCategory').click(addCategory);
	$('#addNewCategory').click(addNewCategory);
	$('#removeCategory').click(removeCategory);

	ipcRenderer.send('getProducts');
	ipcRenderer.send('getImages');
	ipcRenderer.send('getCategories');
});

function updateCategories(selectMenu, defaultSelection){
	$('#'+selectMenu).html('');
	var defaultOption = '';
	for(var category in categories){
		defaultOption = '';
		if(category == defaultSelection) defaultOption = 'selected';
		$('#'+selectMenu).append('<option value="'+categories[category]+'"'+defaultOption+'>'+categories[category]+'</option>');
	}
}

function productMod(){
	if(!$('#products').is(':visible')){
		$('#products').css('display', '');
		$('#layout').css('display', 'none');
	}
	else{
		$('#products').css('display', 'none');
	}
}

function addProduct(){
	if(!$('#addProductMenu').is(':visible')){
		$('#addProductMenu').css('display', '');
		$('#addCategoryMenu').css('display', 'none');
		$('#productTable').css('display', 'none');
		$('#tableSearch').css('display', 'none');
	}
	else{
		$('#addProductMenu').css('display', 'none');
		$('#productTable').css('display', '');
		$('#tableSearch').css('display', '');
	}
}

function addCategory(){
	if(!$('#addCategoryMenu').is(':visible')){
		$('#addProductMenu').css('display', 'none');
		$('#addCategoryMenu').css('display', '');
		$('#productTable').css('display', 'none');
		$('#tableSearch').css('display', 'none');
	}
	else{
		$('#addCategoryMenu').css('display', 'none');
		$('#productTable').css('display', '');
		$('#tableSearch').css('display', '');
	}
}

function addNewCategory(){
	var category = $('#categoryName').val().toLowerCase();
	$('#categoryName').val('');

	if(categories.indexOf(category) < 0 && category != ''){
		ipcRenderer.send('newCategory', category);
		$('#categoryAddSuccess').css('display', '');
		clearDisplay('#categoryAddSuccess');
	}
	else{
		$('#categoryAddFail').css('display', '');
		clearDisplay('#categoryAddFail');
	}
}

function removeCategory(){
	var category = $('#categoryName').val().toLowerCase();
	$('#categoryName').val('');

	if(categories.indexOf(category) >= 0){
		ipcRenderer.send('removeCategory', category);
		$('#categoryRemoveSuccess').css('display', '');
		clearDisplay('#categoryRemoveSuccess');
	}
	else{
		$('#categoryRemoveFail').css('display', '');
		clearDisplay('#categoryRemoveFail');
	}
}

function addNewItem(){
	var newProduct = {};
	var valid = true;

	if($('#productName').val()){
		newProduct['name'] = $('#productName').val();
	}
	else valid = false;
	if($('#productCategory').val()){
		newProduct['type'] = $('#productCategory').val().toLowerCase();
	}
	else valid = false;
	if($('#productStatus').val()){
		newProduct['status'] = $('#productStatus').val().toLowerCase();
	}
	else valid = false;
	if(selectedImage != ''){
		newProduct['image'] = selectedImage;
	}
	else newProduct['image'] = 'default.jpg';

	if(valid){
		$('#productName').val('');
		$('#productCategory').val('');
		$('#productStatus').val('default');
		$('#imageForm')[0].reset();
		$('#productImage').html('Select Image'+buttonHtml);

		$('#itemAddSuccess').css('display', '');
		clearDisplay('#itemAddSuccess');

		ipcRenderer.send('newItem', newProduct);
	}
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
					'<td><select class="form-control" id="'+current+'Type"></select></td>'+
					'<td><select id="'+current+'Status" class="form-control">'+
						'<option value="default">Default</option>'+
						'<option value="sale">Sale</option>'+
						'<option value="clearance">Clearance</option>'+
						'<option value="discontinued">Discontinued</option>'+
					'</select></td>'+
					'<td><label id="'+current+'Label" class="imageUpdate btn btn-file btn-default">'+products[current].image+'<input type="file" style="display:none" onchange="updateImage(\''+current+'\');" id="'+current+'Image"></input></label></td>'
				);
				$('#'+current+'Status').val(products[current].status);
				updateCategories(current+'Type', categories.indexOf(products[current].type));
			}
			updateSelected();
		}
	}
	else{
		for(var product in toUpdate){
			var current = checked[toUpdate[product]];
			if(current){

				finalImage = $('#'+current+'Label').html().split('<')[0];

				products[current] = {
					'name': $('#'+current+'Name').val(),
					'type': $('#'+current+'Type').val(),
					'status': $('#'+current+'Status').val(),
					'image': finalImage,
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
		if(element[product].value){
			toRemove.push(checked.indexOf(element[product].value));
			element[product].checked = false;
		}
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

function selectImage(){

	var file = 'default.jpg';

	if($('#productImageChoice')[0]['files'][0]){
		var filePath = $('#productImageChoice')[0]['files'][0]['path'];
		var fileName = filePath.split('/')[filePath.split('/').length-1];
		var fileTypes = ['jpg', 'jpeg', 'png'];

		if(fileTypes.indexOf(fileName.split('.')[1].toLowerCase()) >= 0){
			ipcRenderer.send('newImage', [filePath, fileName]);
			file = fileName;
		}
	}

	$('#productImage').html(file+buttonHtml);
	$('#imageForm')[0].reset();
	selectedImage = file;
}

function updateImage(product){
	var inner = '<input type="file" style="display:none" onchange="updateImage(\''+product+'\');" id="'+product+'Image"></input>';
	if($('#'+product+'Image')[0]['files'][0]['path']){
		var filePath = $('#'+product+'Image')[0]['files'][0]['path'];
		var fileName = filePath.split('/')[filePath.split('/').length-1];
		var fileTypes = ['jpg', 'jpeg', 'png'];

		if(fileTypes.indexOf(fileName.split('.')[1].toLowerCase()) >= 0){
			ipcRenderer.send('newImage', [filePath, fileName]);
			$('#'+product+'Label').html(fileName+inner);
		}
	}
}

function clearDisplay(element){
	$(element).delay(1000);
	$(element).slideUp();
}

ipcRenderer.on('productList', function(event, args){
	$('#productTableHeader').html('');

	for(var key in args){
		var alreadySelected = '';
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

ipcRenderer.on('getImages', function(event, args){
	images = args;
});

ipcRenderer.on('getCategories', function(event, args){
	categories = args;
	updateCategories('productCategory', 0);
});