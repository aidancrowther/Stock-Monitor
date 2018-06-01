var openDisplays = [];

function drawLayouts(){

	if(displays.length){
		for(var display in displays){
			drawLayout(layouts, products);
		}
	}
}

function drawLayout(layouts, products){
	var display = $('#productDisplay')
		display.html("");

		for(var layout in layouts){
			var subCats = layouts[layout].sub;
			display.append('<div class="panel panel-default layoutMain" id="'+layouts[layout].main+'"><h2>'+layouts[layout].main+'</h2></div>')
			for(var sub in subCats){
				$('#'+layouts[layout].main).append('<div class="panel panel-default" id="'+subCats[sub]+'-'+layouts[layout].main+'"><div class="panel-heading"><p>'+subCats[sub]+'</p></div></div>')
				for(var product in products){
					var current = products[product].name.replace(/ /gi, '_');
					if(products[product].type == layouts[layout].main && subCats[sub] == products[product].subType){
						$('#'+subCats[sub]+'-'+layouts[layout].main).append('<div class="product" id="display'+current+'"></div>');
						$('#display'+current).append('<img src="../Data/Images/'+products[product].image+'">');
						$('#display'+current).append('<h4>'+products[product].name+'</h4>');
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
		}
}