	function add_topics_to_mini_inbox() {
	
	
	
	    jQuery("#mini_inbox_list").html('');
	    var item_count = 0;
	    if (getKeys(Buleys.queues.new_items) > 0) {
	        $.each(Buleys.queues.new_items, function (topic_id, count) {
	            if (item_count <= Buleys.settings.mini_inbox_topic_count) {
	
	
	                add_topic_to_mini_inbox(topic_id, count);
	                item_count++;
	
	            } else {
	
	            }
	        });
	    } else {
	        jQuery("#mini_inbox_list").html('<li>No new items</li>');
	    }
	
	
	
	}
	
	
	function add_topic_to_mini_inbox(topic_id, count) {
	
	    new_topics_transaction();
	
	
	    var item_request = Buleys.objectStore.get(topic_id);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	            var split_string = topic_id.split("_", 1);
	
	            var type_to_get = split_string[0];
	            var company_to_get = topic_id.replace((split_string[0] + "_"), "");
	
	            jQuery("#mini_inbox_list").append("<li><a href='/" + type_to_get + "/" + company_to_get + "' class='topic_name'>" + topic_id + "</a> (" + count + ")</li>");
	
	        } else {
	
	            if (typeof item_request.result.name != 'undefined') {
	                jQuery("#mini_inbox_list").append("<li><a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a> (" + count + ")</li>");
	            }
	/*
					if(typeof item_request.result.subsector != 'undefined') {
						jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
					}
	
					if(typeof item_request.result.sector != 'undefined') {
						jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
					}
					*/
	
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	}
	