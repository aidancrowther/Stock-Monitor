function drawLayouts(){

	var display = $('#display-1')
	display.html("");

	for(var layout in layouts){
		display.append('<div class="panel panel-default" id="'+layouts[layout].main+'"><div class="panel-heading"><p>'+layouts[layout].main+'</p></div></div>')
		for(var product in products){
			var current = products[product].name.replace(/ /gi, '_');
			if(products[product].type == layouts[layout].main && layouts[layout].sub.indexOf(products[product].subType) >= 0){
				$('#'+layouts[layout].main).append('<div class="product" id="display'+current+'"></div>');
				$('#display'+current).append('<img src="../Data/Images/'+products[product].image+'">');
				$('#display'+current).append('<h3>'+products[product].name+'</h3>');
				$('#display'+current).append('<p>'+products[product].description.replace(/(?:\r\n|\r|\n)/g, '<br>')+'</p>');
				switch(products[product].status){
					case "default":
						$('#display'+current).css('background-color', 'yellow');
						break;

					case "sale":
						$('#display'+current).css('background-color', 'green');
						break;

					case "clearance":
						$('#display'+current).css('background-color', 'blue');
						break;

					case "discontinued":
						$('#display'+current).css('background-color', 'red');
						break;
				}
			}
		}
	}
};