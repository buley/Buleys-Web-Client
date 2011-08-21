
	function is_in_cursor_mode(  ) {
	jQuery(document).trigger('is_in_cursor_mode');

	    if (jQuery('.cursor').length > 0) {
	        return true;
	    } else {
	        return false;
	    }
	}
	
