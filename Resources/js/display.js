var checkedDisplays = [];
var updatingDisplays = false;

$(document).ready(function(){
	$('#displayMod').click(displayMod);
	$('#addDisplay').click(addDisplay);
	$('#submitDisplayBtn').click(submitNewDisplay);
	$('#removeDisplay').click(removeSelectedDisplay);
	$('#updateDisplay').click(changeSelectedDisplay);
	$('#showDisplays').click(() => {ipcRenderer.send('getDisplays')} );
});

//Open/close the display modification menu
function displayMod(){
	if(!$('#display').is(':visible')){
		$('#display').css('display', '');
		$('#products').css('display', 'none');
		$('#layout').css('display', 'none');
	}
	else{
		$('#display').css('display', 'none');
	}
}

//Open/close the display addition menu
function addDisplay(){
	if(!$('#addDisplayMenu').is(':visible')){

		$('#removeDisplay').attr('disabled', 'disabled');
		$('#updateDisplay').attr('disabled', 'disabled');
		$('#showDisplays').attr('disabled', 'disabled');

		$('#addDisplayMenu').css('display', '');
		$('#displayTable').css('display', 'none');
		$('#displayTableSearch').css('display', 'none');
	}
	else{

		$('#removeDisplay').removeAttr('disabled');
		$('#updateDisplay').removeAttr('disabled');
		$('#showDisplays').removeAttr('disabled');

		$('#addDisplayMenu').css('display', 'none');
		$('#displayTable').css('display', '');
		$('#displayTableSearch').css('display', '');
	}
}

//Add the new display to the list of displays
function submitNewDisplay(){
	var newDisplay = {};
	newDisplay['scrollTime'] = [];
	var valid = true;

	if($('#displayCategory').val().length){
		if(displays.length) newDisplay['id'] = displays[displays.length-1].id+1;
		else newDisplay['id'] = 0;
		newDisplay['categories'] = $('#displayCategory').val();
	}
	else valid = false;
	if($('#displayScrollSpeed').val() == "") newDisplay['scrollTime'].push(0);
	else newDisplay['scrollTime'].push(parseInt($('#displayScrollSpeed').val()));
	if($('#displayDelay').val() == "") newDisplay['scrollTime'].push(0);
	else newDisplay['scrollTime'].push(parseInt($('#displayDelay').val()));

	if(valid){
		$('#displayCategory').val('');
		$('#displayScrollSpeed').val('');
		$('#displayDelay').val('');

		$('#displayAddSuccess').css('display', '');
		clearDisplay('#displayAddSuccess');

		ipcRenderer.send('addDisplay', newDisplay);
	}
	else{
		$('#displayAddFailure').css('display', '');
		clearDisplay('#displayAddFailure');
	}
}

//Update list of selected displays
function updateSelectedDisplays(){
	var element = $('input[name="selectedDisplay"]');
	checkedDisplays = [];

	for(var display in element){
		if(element[display].checked) checkedDisplays.push(element[display].value);
	}
}

//Update all selected displays
function changeSelectedDisplay(){
	var element = $('input[name="selectedDisplay"]');
	var toUpdate = [];

	//get all displays to update
	for(var display in element){
		element[display].disabled = !updatingDisplays;
		if(element[display].value) toUpdate.push(checkedDisplays.indexOf(element[display].value));
	}

	//disable select all button
	$('input[name="selectAllDisplayBtn"]')[0].disabled = !updatingDisplays;

	//disable all other buttons and allow user input for updates
	if(!updatingDisplays){
		updatingDisplays = !updatingDisplays;

		$('#removeDisplay').attr('disabled', 'disabled');
		$('#addDisplay').attr('disabled', 'disabled');
		$('#showDisplays').attr('disabled', 'disabled');
		$('#updateDisplay').html('Apply Changes');
		$('#updateDisplay').toggleClass('btn-default btn-success');

		for(var display in toUpdate){
			var current = checkedDisplays[toUpdate[display]];
			console.log(toUpdate[display]);
			if(current){
				$('#'+current+'Display').html(
					'<td><input onclick="updateSelectedDisplays();" type="checkbox" name="selectedDisplay" value='+current+' disabled checked></td>'+
					'<td><select multiple class="form-control" id="'+current+'DisplayCat" size="3"></select></td>'+
					'<td><input class="form-control" id="'+current+'Speed" type="number" value="'+displays[current].scrollTime[0]+'"></td>'+
					'<td><input class="form-control" id="'+current+'Delay" type="number" value="'+displays[current].scrollTime[1]+'"></td>'
				)
				updateCategories(current+'DisplayCat', categories.indexOf(displays[current].categories[0]), categories);
			}
		}
	}
	//Re-enable all buttons, and submit updated display
	else{
		updatingDisplays = !updatingDisplays;

		$('#removeDisplay').removeAttr('disabled');
		$('#addDisplay').removeAttr('disabled');
		$('#showDisplays').removeAttr('disabled');
		$('#updateDisplay').html('Update Selected');
		$('#updateDisplay').toggleClass('btn-default btn-success');

		for(var display in toUpdate){
			var current = checkedDisplays[toUpdate[display]];
			if(current){
				ipcRenderer.send('removeDisplay', displays[current]);
				if($('#'+current+'DisplayCat').val().length > 0) displays[current].categories = $('#'+current+'DisplayCat').val();
				if($('#'+current+'Speed').val() == "") displays[current].scrollTime[0] = 0;
				else displays[current].scrollTime[0] = $('#'+current+'Speed').val();
				if($('#'+current+'Delay').val() == "") displays[current].scrollTime[1] = 0;
				else displays[current].scrollTime[1] = $('#'+current+'Delay').val();
				ipcRenderer.send('addDisplay', displays[current]);
			}
		}

		$('[name="selectAllDisplayBtn"]').prop('checked', false);

		updateSelectedDisplays();
	}
}

//Select all displays in the list of displays
function selectAllDisplay(){
	var element = $('input[name="selectedDisplay"]');

	for(var display in element){
		if(element[display].name == 'selectedDisplay') element[display].checked = $('[name="selectAllDisplayBtn"]').is(':checked');
	}

	updateSelectedDisplays();
}

//Remove all selected displays
function removeSelectedDisplay(){
	var element = $('input[name="selectedDisplay"]');
	var toRemove = [];
	var list = [];

	for(var display in element){
		if(element[display].value){
			toRemove.push(checkedDisplays.indexOf(element[display].value));
			element[display].checkedDisplays = false;
		}
	}

	for(var display in toRemove){
		var current = checkedDisplays[toRemove[display]];
		if(current) list.push(current);
	}

	$('[name="selectAllDisplayBtn"]').prop('checked', false);
	for(var item in list) ipcRenderer.send('removeDisplay', displays[list[item]]);
}

//Update list of displays
function updateDisplays(){

	$('#displayTableHeader').html('');

	for(var display in displays){
		var alreadySelected = '';
		var item = '<tr id="'+display.replace(/ /g, '_')+'Display">'+
			'<td><input onclick="updateSelectedDisplays();" type="checkbox" name="selectedDisplay" value='+display.replace(/ /g, '_')+alreadySelected+'></td>'+
			'<td>'+displays[display].categories+'</td>'+
			'<td>'+displays[display].scrollTime[0]+'</td>'+
			'<td>'+displays[display].scrollTime[1]+'</td>'+
			'</tr>';
		$('#displayTableHeader').append(item);
	}
}