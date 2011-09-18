	function do_work(  ) {
	jQuery(document).trigger('do_work');

	    if (Buleys.queues.pending_crawls.length > 0) {
	        do_pending_crawl();
	    } else {
	        get_follows();
	    }
	
	
	    var length_of_new = 0;
	    length_of_new = getKeys(Buleys.queues.new_items);
	
	    if (length_of_new > 0) {
	
	        var topic_id = type + "_" + slug;
	
	        if (typeof Buleys.queues.new_items[topic_id] !== "undefined") {
	            delete Buleys.queues.new_items[topic_id];
	        }
	
	        var length_post_delete = getKeys(Buleys.queues.new_items);
	
	        if (length_post_delete > 0) {
	
	
	
	            if (typeof jQuery("#minimize_inbox") !== "undefined" && length_of_new > 0) {
	                jQuery("#get_inbox").removeClass('inbox_icon').addClass('empty_inbox_icon').parent().parent().removeClass('empty_inbox').addClass('waiting_inbox');
	            }
	
	        } else {
	
	            jQuery("#get_inbox img").removeClass('empty_inbox_icon').addClass('inbox_icon').parent().parent().addClass('empty_inbox').removeClass('waiting_inbox');
	
	
	        }
	
	        save_queues();
	        save_settings();
	
	    }
	
	
	
	
	    if (Buleys.mouse.mouse_y_snapshot === Buleys.mouse.mouse_y && Buleys.mouse.mouse_x_snapshot === Buleys.mouse.mouse_x) {
	        if (Buleys.settings.crawl_speed >= Buleys.settings.crawl_min) {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_increment;
	        } else {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_min;
	        }
	    } else {
	        if (Buleys.settings.crawl_speed <= Buleys.settings.crawl_max) {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_deincrement;
	        } else {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_max;
	        }
	
	        Buleys.mouse.mouse_y_snapshot = Buleys.mouse.mouse_y;
	        Buleys.mouse.mouse_x_snapshot = Buleys.mouse.mouse_x;
	    }
	    if (jQuery(".unseen").length > 0) {
	        window.document.title = window.document.title.replace(/[|\s]*?Buley's/, "");
	        window.document.title = window.document.title.replace(/\(.*?\)[|\s]*?/g, "") + " (" + jQuery(".unseen").length + ") | Buley's";
	    } else {
	        window.document.title = window.document.title.replace(/[\s]?\(.*?\)/g, "");
	    }
	    setTimeout('do_work()', Buleys.settings.crawl_speed);
	
	}
	
