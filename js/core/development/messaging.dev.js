
	function post_feedback( event_type, item_url, context_string, context_type_string ) {
	jQuery(document).trigger('post_feedback');

	    var data_to_send;
	    data_to_send = {
	        "event": event_type,
	        "item": item_url,
	        "context": context_string,
	        "type": context_type_string
	    };
	    $.post("http://api.buleys.com/feedback/", data_to_send, function (  ) {

	
	    }, dataType = "json");
	}
