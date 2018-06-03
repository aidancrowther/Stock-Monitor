const { ipcRenderer, remote, shell } = require('electron');

ipcRenderer.on('drawWindow', function(event, args){
	drawLayout(args[0], args[1]);
});