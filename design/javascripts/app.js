
jQuery(document).ready(function ($) {
	
	// Append RGB value after Hex value
	$("ul.palette li").each(function () {
  		var rgb = $(this).css("background-color");
  		$(this).append("<p>" + rgb + "</p>");
	});

    // Add copy to clipboard feature if Flash installedand above/equal to version 10
	if(FlashDetect.installed && (FlashDetect.major >= 10)){
	
		//activateClickToCopy();
		
	}
	
});


function activateClickToCopy() {
	
	// Use zclip to add SWFs to each palette li for the copying feature
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
	
	// reveal the clipboard instruction/feedback notice
	$(".clipboard").show();
	
}

