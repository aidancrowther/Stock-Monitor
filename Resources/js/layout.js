$(document).ready(function(){
	$('#layoutMod').click(layoutMod);
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