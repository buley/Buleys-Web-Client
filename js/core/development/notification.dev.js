		if (window.webkitNotifications) {
	
	} else {
	
	}
	
	
	function createNotificationInstance(options) {
	    if (options.notificationType == 'simple') {
	        return window.webkitNotifications.createNotification('fire.png', 'Notification Title', 'Notification content...');
	    } else if (options.notificationType == 'html') {
	        return window.webkitNotifications.createHTMLNotification('http://someurl.com');
	    }
	}
	
	function send_notification_to_desktop() {
	
	    if (window.webkitNotifications.checkPermission() == 0) {
	
	        notification_test = createNotificationInstance({
	            notificationType: 'html'
	        });
	        notification_test.ondisplay = function () {};
	        notification_test.onclose = function () {};
	        notification_test.show();
	    } else {
	        window.webkitNotifications.requestPermission();
	    }
	
	
	}
	
	function notify_user_of_new_items(number, thetype, thecompany) {
	
	    if ((Buleys.view.type === thetype && thecompany === Buleys.view.slug) || Buleys.view.type == "home" || typeof Buleys.view.type === "undefined") {
	        flash_console("<p>" + number + " new items added to " + thetype + " " + thecompany + " </p>");
	    }
	
	}
	

		function do_pending_crawl() {
	
	    var topic_slug = Buleys.queues.pending_crawls.splice(0, 1);
	
	    var split_string = topic_slug[0].split("_", 1);
	
	    var type_to_get = split_string[0];
	    var company_to_get = topic_slug[0].replace((split_string[0] + "_"), "");
	
	
	
	
	    var the_url;
	    the_url = "http://static.buleys.com/js/collections/" + type_to_get + "/" + company_to_get + ".js";
	
	    $.ajax({
	
	        url: the_url,
	        dataType: 'jsonp',
	        jsonpCallback: 'load_collection',
	        error: function () {
	            $("#index").html("<li class='item'>No results.</li>");
	        },
	        success: function (data) {
	
	
	            add_items(data.items, type_to_get, company_to_get);
	
	
	
	        }
	    });
	
	
	}
	
	
		
	function check_for_waiting_items() {
	
	
	
	    notify_user_of_new_items(Buleys.queues.new_items, type_to_get, company_to_get);
	
	}


