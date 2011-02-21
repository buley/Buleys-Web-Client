	function flash_console(message) {
	
	    send_to_console(message);
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 1,
	
	
	    }, 500);
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 0,
	
	
	    }, 500);
	
	
	}
	
	function send_text_to_console(text_to_send) {
	
	    jQuery("#console").html('').append("<p>" + text_to_send + "</p>");
	
	
	
	
	}
	
		
	function send_to_console(text_to_send) {
	
	    send_text_to_console(text_to_send);
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 1,
	
	
	    }, 500);
	
	}
	
	
	function fade_console_message() {
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 0,
	    }, 500);
	
	}

	



