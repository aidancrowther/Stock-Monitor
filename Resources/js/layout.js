$(document).ready(function(){
	$('#layoutMod').click(layoutMod);
	$('#addLayout').click(addLayout);
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