var updatingProducts = false;
var descriptionModal = false;
var descriptionUnderUpdate = '';
var selectedImage = 'default.jpg';
var buttonHtml = "<form id='imageForm'><input type='file' style='display:none' id='productImageChoice' onchange='selectImage();'></form>";
var checked = [];

//Attach button functions
$(document).ready(function(){
	$('#productMod').click(productMod);
	$('#addProduct').click(addProduct);
	$('#addNewItem').click(addNewItem);
	$('#updateProducts').click(() => {
		updatingProducts = !updatingProducts;
		updateProducts();
	});
	$('#removeProducts').click(removeSelected);
	$('#addCategory').click(addCategory);
	$('#updateCategory').click(updateCategory);
	$('#updateSubCategory').click(updateSubCategory);
	$('#closeDescription').click(function() {showDescription(false);});
	$('#saveDescription').click(function() {showDescription(true);});
	$('#descriptionModal').on('show.bs.modal', function () {
 		$('#descriptionModal').css("margin-top", $(window).height() / 2 - $('.modal-content').height() / 2);
	});
	$('#saveUpdate').on("click", () => {closeUpdateModal(true)});
	$('#cancelUpdate').on("click", () => {closeUpdateModal(false)});
});

//Open/close the product menu
function productMod(){
	if(!$('#products').is(':visible')){
		$('#products').css('display', '');
		$('#layout').css('display', 'none');
		$('#display').css('display', 'none');
	}
	else{
		$('#products').css('display', 'none');
	}
}

//Open/close the product adding menu
function addProduct(){
	if(!$('#addProductMenu').is(':visible')){

		$('#removeProducts').attr('disabled', 'disabled');
		$('#updateProducts').attr('disabled', 'disabled');
		$('#addCategory').attr('disabled', 'disabled');

		$('#addProductMenu').css('display', '');
		$('#addCategoryMenu').css('display', 'none');
		$('#productTable').css('display', 'none');
		$('#tableSearch').css('display', 'none');
	}
	else{

		$('#removeProducts').removeAttr('disabled');
		$('#updateProducts').removeAttr('disabled');
		$('#addCategory').removeAttr('disabled');

		$('#addProductMenu').css('display', 'none');
		$('#productTable').css('display', '');
		$('#tableSearch').css('display', '');
	}
}

//Open/close the category adding menu
function addCategory(){
	if(!$('#addCategoryMenu').is(':visible')){

		$('#removeProducts').attr('disabled', 'disabled');
		$('#updateProducts').attr('disabled', 'disabled');
		$('#addProduct').attr('disabled', 'disabled');

		$('#addProductMenu').css('display', 'none');
		$('#addCategoryMenu').css('display', '');
		$('#productTable').css('display', 'none');
		$('#tableSearch').css('display', 'none');
	}
	else{

		$('#removeProducts').removeAttr('disabled');
		$('#updateProducts').removeAttr('disabled');
		$('#addProduct').removeAttr('disabled');

		$('#addCategoryMenu').css('display', 'none');
		$('#productTable').css('display', '');
		$('#tableSearch').css('display', '');
	}
}

//Add/remove a new category
function updateCategory(){
	var category = $('#categoryName').val().toLowerCase().replace(/[^0-9a-z]/gi, '');
	var checkCategory = category.replace(/ /g, '');
	$('#categoryName').val('');

	if(categories.indexOf(category) < 0 && category != '' && checkCategory != ''){
		ipcRenderer.send('newCategory', category);
		$('#categoryAddSuccess').css('display', '');
		clearDisplay('#categoryAddSuccess');
	}
	else if(categories.indexOf(category) >= 0){
		ipcRenderer.send('removeCategory', category);
		$('#categoryRemoveSuccess').css('display', '');
		clearDisplay('#categoryRemoveSuccess');
	}
	else{
		$('#categoryUpdateFail').css('display', '');
		clearDisplay('#categoryUpdateFail');
	}
}

//Add/remove sub-category
function updateSubCategory(){
	var subCategory = $('#subCategoryName').val().toLowerCase().replace(/[^0-9a-z]/gi, '');
	var checkSubCategory = subCategory.replace(/ /g, '');
	$('#subCategoryName').val('');

	if(subCategories.indexOf(subCategory) < 0 && subCategory != '' && checkSubCategory != ''){
		ipcRenderer.send('newSubCategory', subCategory);
		$('#subCategoryAddSuccess').css('display', '');
		clearDisplay('#subCategoryAddSuccess');
	}
	else if(subCategories.indexOf(subCategory) >= 0){
		ipcRenderer.send('removeSubCategory', subCategory);
		$('#csubCtegoryRemoveSuccess').css('display', '');
		clearDisplay('#subCategoryRemoveSuccess');
	}
	else{
		$('#subCategoryUpdateFail').css('display', '');
		clearDisplay('#subCategoryUpdateFail');
	}
}

//Add a new item using given details
function addNewItem(){
	var newProduct = {};
	var valid = true;

	if($('#productName').val()){
		var checkContent = $('#productName').val().replace(/[^\w\s]/gi, '');
		if(checkContent != '') newProduct['name'] = $('#productName').val().replace(/[^\w\s]/gi, '');
		else valid = false;
	}
	else valid = false;
	if($('#productCategory').val()){
		newProduct['type'] = $('#productCategory').val().toLowerCase();
	}
	else valid = false;
	if($('#productSubCategory').val()){
		newProduct['subType'] = $('#productSubCategory').val().toLowerCase();
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
	if($('#productDescription').val()){
		newProduct['description'] = $('#productDescription').val();
	}
	else valid = false;

	//If all inputs are valid, add the item
	if(valid){
		$('#productName').val('');
		$('#productCategory').val(categories[0]);
		$('#productSubCategory').val(subCategories[0]);
		$('#productStatus').val('default');
		$('#imageForm')[0].reset();
		$('#productImage').html('Select Image'+buttonHtml);
		$('#productDescription').val('');

		$('#itemAddSuccess').css('display', '');
		clearDisplay('#itemAddSuccess');

		ipcRenderer.send('newItem', newProduct);
	}
	else{
		$('#itemAddFailure').css('display', '');
		clearDisplay('#itemAddFailure');
	}
}

//Select all products for manipulation
function selectAll(){
	var element = $('input[name="selected"]');

	for(var product in element){
		if(element[product].name == 'selected') element[product].checked = $('[name="selectAllBtn"]').is(':checked');
	}

	updateSelected();
}

//Update the list of currently selected products
function updateSelected(){
	var element = $('input[name="selected"]');
	checked = [];

	for(var product in element){
		if(element[product].checked) checked.push(element[product].value);
	}
}

//Change all selected products to modifying mode
function updateProducts(){
	var element = $('input[name="selected"]');
	var toUpdate = [];

	//Toggle button appearance
	if(updatingProducts){
		$('#updateProducts').html('Apply Changes');
		$('#updateProducts').toggleClass('btn-default btn-success');
	}
	else{
		$('#updateProducts').html('Update Selected');
		$('#updateProducts').toggleClass('btn-default btn-success');
	}

	//Disable/enable select all checkbox
	$('input[name="selectAllBtn"]')[0].disabled = !updatingProducts;

	//Disable/enable all product checkboxes
	for(var product in element){
		element[product].disabled = !updatingProducts;
		if(element[product].value) toUpdate.push(checked.indexOf(element[product].value));
	}

	//If we are beginning the process of updating products
	if(updatingProducts){

		//Disable buttons other than the apply button
		$('#removeProducts').attr('disabled', 'disabled');
		$('#addProduct').attr('disabled', 'disabled');
		$('#addCategory').attr('disabled', 'disabled');

		//For all selected products
		for(var product in toUpdate){
			var current = checked[toUpdate[product]];
			//Convert them to show options for updating
			if(current){
				$('#'+checked[toUpdate[product]]).html(
					'<td><input onclick="updateSelected();" type="checkbox" name="selected" value='+current+' disabled checked></td>'+
					'<td><input class="form-control" id="'+current+'Name" value="'+products[current].name+'"></td>'+
					'<td><select class="form-control" id="'+current+'Type"></select></td>'+
					'<td><select class="form-control" id="'+current+'SubType"></select></td>'+
					'<td><select id="'+current+'Status" class="form-control">'+
						'<option value="default">Default</option>'+
						'<option value="sale">Sale</option>'+
						'<option value="clearance">Clearance</option>'+
						'<option value="discontinued">Discontinued</option>'+
					'</select></td>'+
					'<td><label id="'+current+'Label" class="updateButton btn btn-file btn-default">'+products[current].image+'<input type="file" style="display:none" onchange="updateImage(\''+current+'\');" id="'+current+'Image"></input></label></td>'+
					'<td><label id="'+current+'DescriptionLabel" class="updateButton btn btn-file btn-default">Description<input type="button" style="display:none" onclick="showDescription(\''+current+'\');" id="'+current+'Description"></input></label></td>'				);
				$('#'+current+'Status').val(products[current].status);
				updateCategories(current+'Type', categories.indexOf(products[current].type), categories);
				updateCategories(current+'SubType', subCategories.indexOf(products[current].subType), subCategories);
			}
			updateSelected();
		}
	}
	//Otherwise, re-enable everything, and push all updates
	else{

		$('[name="selectAllBtn"]').prop('checked', false);
		$('#removeProducts').removeAttr('disabled');
		$('#addProduct').removeAttr('disabled');
		$('#addCategory').removeAttr('disabled');

		for(var product in toUpdate){
			var current = checked[toUpdate[product]];
			if(current){

				finalImage = $('#'+current+'Label').html().split('<')[0];

				products[current] = {
					'name': $('#'+current+'Name').val(),
					'type': $('#'+current+'Type').val(),
					'subType': $('#'+current+'SubType').val(),
					'status': $('#'+current+'Status').val(),
					'image': finalImage,
					'description': products[current]['description']
				};
			}
			if(current){
				ipcRenderer.send('removeItems', [current]);
				ipcRenderer.send('newItem', products[current]);
			}
		}
		updateSelected();
	}
}

//Remove all selected products
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

	$('[name="selectAllBtn"]').prop('checked', false);
	ipcRenderer.send('removeItems', list);
	ipcRenderer.send('getProducts');
}

//Search for a specified product in the product listing
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

//Select an image from the users computer, otherwise use default
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

//Update given products image
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

//Display description modal
function showDescription(input){

	if(!descriptionModal){
		$('#descriptionModal').modal('show');
		loadMenu();
		descriptionModal = true;
		settingsModalEnabled = false;
	}
	else{
		$('#descriptionModal').modal('hide');
		descriptionModal = false;
		settingsModalEnabled = true;
		loadMenu();
	}

	if(typeof(input) == 'boolean'){
		if(input){
			products[descriptionUnderUpdate]['description'] = $('#productDescriptionDialog').val();
			ipcRenderer.send('removeItems', [descriptionUnderUpdate]);
			ipcRenderer.send('newItem', products[descriptionUnderUpdate]);
		}

		descriptionUnderUpdate = '';
	}
	else{
		$('#productDescriptionDialog').val(products[input]['description']);
		descriptionUnderUpdate = input;
	}
}

// Close the update modal
function closeUpdateModal(save){
	if(save){

		let image = products[descriptionUnderUpdate].image;

		products[descriptionUnderUpdate] = {
			'name': $('#updateProductName').val(),
			'type': $('#updateProductCategory').val(),
			'subType': $('#updateProductSubCategory').val(),
			'status': $('#updateProductStatus').val(),
			'image': image,
			'description': $('#updateProductDescription').val()
		};

		ipcRenderer.send('removeItems', [descriptionUnderUpdate]);
		ipcRenderer.send('newItem', products[descriptionUnderUpdate]);

		$('#updateModal').modal('hide');
	} else {
		$('#updateModal').modal('hide');
	}

	descriptionUnderUpdate = '';
}

// Load the updater modal for the selected item
function loadUpdateModal(product){

	descriptionUnderUpdate = product;

	$('#updateProductName').val(products[product].name);
	$('#updateProductDescription').val(products[product].description);
	updateCategories('updateProductCategory', categories.indexOf(products[product].type), categories);
	updateCategories('updateProductSubCategory', subCategories.indexOf(products[product].subType), subCategories);
	updateCategories('updateProductStatus', statuses.indexOf(products[product].status), statuses);

	$('#updateModal').modal('show');
}