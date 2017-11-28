function drawLayouts(){

	var display = $('#display-1')

	for(var layout in layouts){
		display.append('<div class="panel panel-default" id="'+layouts[layout].main+'"><div class="panel-heading"><p>'+layouts[layout].main+'</p></div></div>')
		for(var product in products){
			if(products[product].type == layouts[layout].main && layouts[layout].sub.indexOf(products[product].subType) >= 0){
				$('#'+layouts[layout].main).append('<div class="product" id="'+products[product].name+'">'+products[product].name+'</div>');
				$('#'+products[product].name).css('background-image', 'url(../Data/Images/'+products[product].image+')');
			}
		}
	}
};