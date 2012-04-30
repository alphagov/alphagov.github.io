
jQuery(document).ready(function ($) {
	
	// append RGB value in a <p> inside <li>
	$("ul.palette li").each(function () {
  		var rgb = $(this).css("background-color");
  		$(this).append("<p>" + rgb + "</p>");
	});
  
});
