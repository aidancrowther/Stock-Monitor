$(document).ready(function(){
	$('#layoutMod').click(layoutMod);
	$('#addLayout').click(addLayout);
	$('#submitLayoutBtn').click(submitNewLayout);

	ipcRenderer.send('getLayouts');
});

function layoutMod(){
	if(!$('#layout').is(':visible')){
		$('#layout').css('display', '');
		$('#products').css('display', 'none');
	}
	else{
		$('#layout').css('display', 'none');
	}
}

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
}

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

function updateSelectedLayouts(){
	var element = $('input[name="selectedLayout"]');
	checkedLayouts = [];

	for(var layout in element){
		if(element[layout].checked) checkedLayouts.push(element[layout].value);
	}
}

function selectAllLayout(){
	var element = $('input[name="selectedLayout"]');

	for(var layout in element){
		if(element[layout].name == 'selectedLayout') element[layout].checked = $('[name="selectAllLayoutBtn"]').is(':checked');
	}

	updateSelectedLayouts();
}

function updateLayouts(){

	$('#layoutTableHeader').html('');

	for(var layout in layouts){
		var alreadySelected = '';
		var item = '<tr id="'+layout.replace(/ /g, '_')+'">'+
			'<td><input onclick="updateSelectedLayouts();" type="checkbox" name="selectedLayout" value='+layout.replace(/ /g, '_')+alreadySelected+'></td>'+
			'<td>'+layouts[layout].main+'</td>'+
			'<td>'+layouts[layout].sub+'</td>'+
			'</tr>';
		$('#layoutTableHeader').append(item);
	}
}