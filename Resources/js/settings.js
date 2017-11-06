const { ipcRenderer, remote } = require('electron');

var settingsModal = false;

$(document).keydown(function(e){
	if(e.keyCode==27){loadMenu();}
});

function loadMenu(){
	if(!settingsModal){
		$('#settingsModal').modal('show');
		settingsModal = true;
	}
	else{
		$('#settingsModal').modal('hide');
		settingsModal = false;
	}
}