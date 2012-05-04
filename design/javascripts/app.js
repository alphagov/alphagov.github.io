
jQuery(document).ready(function ($) {
	
	// append RGB value in a <p> inside <li>
	$("ul.palette li").each(function () {
  		var rgb = $(this).css("background-color");
  		$(this).append("<p>" + rgb + "</p>");
	});

    //copy hex to clipboard on click (desktop machines only, requires flash)
    $('li').each(function(index) {
    	$(this).zclip({
	        path:'../javascripts/ZeroClipboard.swf',
	        copy:$(this).children().filter("p:first").text(),
	        
	        beforeCopy:function(){
            	$(this).css('opacity','0.5');
	        },
	        
	        afterCopy:function(){
	            $(this).css('opacity','1');
	            $(".clipboard").text("Copied— " + $(this).children().filter("p:first").text());
	        }
        
	    });

	});
});
