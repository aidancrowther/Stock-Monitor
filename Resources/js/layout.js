var checkedLayouts = [];
var updatingLayouts = false;

//Attach button functions
$(document).ready(function(){
	$('#layoutMod').click(layoutMod);
	$('#addLayout').click(addLayout);
	$('#submitLayoutBtn').click(submitNewLayout);
	$('#removeLayouts').click(removeSelectedLayouts);
	$('#updateLayouts').click(changeSelectedLayouts);
});

//Open/close the layout modification menu
function layoutMod(){
	if(!$('#layout').is(':visible')){
		$('#layout').css('display', '');
		$('#products').css('display', 'none');
	}
	else{
		$('#layout').css('display', 'none');
	}
}

//Open/close the layout addition menu
function addLayout(){
	if(!$('#addLayoutMenu').is(':visible')){

		$('#removeLayouts').attr('disabled', 'disabled');
		$('#updateLayouts').attr('disabled', 'disabled');

		$('#addLayoutMenu').css('display', '');
		$('#layoutTable').css('display', 'none');
		$('#layoutTableSearch').css('display', 'none');
	}
	else{

		$('#removeLayouts').removeAttr('disabled');
		$('#updateLayouts').removeAttr('disabled');

		$('#addLayoutMenu').css('display', 'none');
		$('#layoutTable').css('display', '');
		$('#layoutTableSearch').css('display', '');
	}
}

//Add the new layout to the list of layouts
function submitNewLayout(){
	var newLayout = {};
	var valid = true;

	if($('#layoutMain').val()){
		newLayout['main'] = $('#layoutMain').val();
	}
	else valid = false;
	if($('#layoutSub').val().length){
		newLayout['sub'] = $('#layoutSub').val();
	}
	else valid = false;

	if(valid){
		$('#layoutMain').val(categories[0]);
		$('#layoutSub').val('');

		$('#layoutAddSuccess').css('display', '');
		clearDisplay('#layoutAddSuccess');

		ipcRenderer.send('addLayout', newLayout);
	}
	else{
		$('#layoutAddFailure').css('display', '');
		clearDisplay('#layoutAddFailure');
	}
	drawLayouts();
}

//Search for a layout in the list of layouts
function findLayout(){
	var input = $('#layoutTableSearchBox').val();
	var table = document.getElementById("layoutTableHeader");
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

//Update list of selected layouts
function updateSelectedLayouts(){
	var element = $('input[name="selectedLayout"]');
	checkedLayouts = [];

	for(var layout in element){
		if(element[layout].checked) checkedLayouts.push(element[layout].value);
	}
}

//Update all selected layouts
function changeSelectedLayouts(){
	var element = $('input[name="selectedLayout"]');
	var toUpdate = [];

	//get all layouts to update
	for(var layout in element){
		element[layout].disabled = !updatingLayouts;
		if(element[layout].value) toUpdate.push(checkedLayouts.indexOf(element[layout].value));
	}

	//disable select all button
	$('input[name="selectAllLayoutBtn"]')[0].disabled = !updatingLayouts;

	//disable all other buttons and allow user input for updates
	if(!updatingLayouts){
		updatingLayouts = !updatingLayouts;

		$('#removeLayouts').attr('disabled', 'disabled');
		$('#addLayout').attr('disabled', 'disabled');
		$('#updateLayouts').html('Apply Changes');
		$('#updateLayouts').toggleClass('btn-default btn-success');

		for(var layout in toUpdate){
			var current = checkedLayouts[toUpdate[layout]];
			if(current){
				$('#'+current+'Layout').html(
					'<td><input onclick="updateSelectedLayouts();" type="checkbox" name="selectedLayout" value='+current+' disabled checked></td>'+
					'<td>'+layouts[current].main+'</td>'+
					'<td><select multiple class="form-control" id="'+current+'LayoutSub" size="3"></select></td>'
				)
				updateCategories(current+'LayoutSub', categories.indexOf(layouts[current].sub[0]), subCategories);
			}
		}
	}
	//Re-enable all buttons, and submit updated layout
	else{
		updatingLayouts = !updatingLayouts;

		$('#removeLayouts').removeAttr('disabled');
		$('#addLayout').removeAttr('disabled');
		$('#updateLayouts').html('Update Selected');
		$('#updateLayouts').toggleClass('btn-default btn-success');

		for(var layout in toUpdate){
			var current = checkedLayouts[toUpdate[layout]];
			if(current){
				if($('#'+current+'LayoutSub').val().length > 0) layouts[current].sub = $('#'+current+'LayoutSub').val();
				ipcRenderer.send('removeLayouts', [current]);
				ipcRenderer.send('addLayout', layouts[current]);
			}
		}

		$('[name="selectAllLayoutBtn"]').prop('checked', false);

		updateSelectedLayouts();
		ipcRenderer.send('getLayouts');
	}
}

//Select all layouts in the list of layouts
function selectAllLayout(){
	var element = $('input[name="selectedLayout"]');

	for(var layout in element){
		if(element[layout].name == 'selectedLayout') element[layout].checked = $('[name="selectAllLayoutBtn"]').is(':checked');
	}

	updateSelectedLayouts();
}

//Remove all selected layouts
function removeSelectedLayouts(){
	var element = $('input[name="selectedLayout"]');
	var toRemove = [];
	var list = [];

	for(var layout in element){
		if(element[layout].value){
			toRemove.push(checkedLayouts.indexOf(element[layout].value));
			element[layout].checkedLayouts = false;
		}
	}

	for(var layout in toRemove){
		var current = checkedLayouts[toRemove[layout]];
		if(current) list.push(current);
	}

	$('[name="selectAllLayoutBtn"]').prop('checked', false);
	ipcRenderer.send('removeLayouts', list);
	ipcRenderer.send('getLayouts');
}

//Update list of layouts
function updateLayouts(){

	$('#layoutTableHeader').html('');

	for(var layout in layouts){
		var alreadySelected = '';
		var item = '<tr id="'+layout.replace(/ /g, '_')+'Layout">'+
			'<td><input onclick="updateSelectedLayouts();" type="checkbox" name="selectedLayout" value='+layout.replace(/ /g, '_')+alreadySelected+'></td>'+
			'<td>'+layouts[layout].main+'</td>'+
			'<td>'+layouts[layout].sub+'</td>'+
			'</tr>';
		$('#layoutTableHeader').append(item);
	}
}