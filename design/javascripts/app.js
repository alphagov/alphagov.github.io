
jQuery(document).ready(function ($) {
	
	// Append RGB value after Hex value
	
	$("ul.palette li").each(function () {
  		var rgb = $(this).css("background-color");
  		$(this).append("<p>" + rgb + "</p>");
	});
		
});


function activateClickToCopy() {
	
	// CLICK TO COPY HEX VALUE TO CLIPBOARD (REQUIRES FLASH 10 AND UP)
	
	// Use zclip to add SWFs to each palette li for the copying feature
	// This function is called from ../javascripts/flash.block.detect.swf
	// so we only get clipboard copy when people have flash version 10 and up and its not blocked
	
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

