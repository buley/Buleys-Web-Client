	
	function new_subscriptions_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["subscriptions"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("subscriptions");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("subscriptions", {
	                "keyPath": "key"
	            }, true);
	
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
	    };
	}

	
	function add_subscription_to_subscriptions_database(the_type, the_key) {
	
	
	    new_subscriptions_transaction();
	
	    var data = {
	        "key": the_type + "_" + the_key,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
		function get_page_subscription_status(the_type, the_key) {
	
	    new_subscriptions_transaction();
	
	
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	            jQuery("#page_meta").append("<a href='#' class='subscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail.png'/></a>");
	        } else {
	
	            jQuery("#page_meta").append("<a href='#' class='unsubscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail-send.png'/></a>");
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	function remove_subscription(the_type, the_key) {
	
	
	    new_subscriptions_transaction();
	
	    var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	function add_subscription_if_doesnt_exist(the_type, the_key) {
	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	        new_subscriptions_transaction();
	
	        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	        item_request.onsuccess = function (event) {
	
	
	
	            if (typeof item_request.result == 'undefined') {
	
	                add_subscription_to_subscriptions_database(the_type, the_key);
	            } else {
	
	            }
	        };
	
	        item_request.onerror = function (e) {
	
	
	        };
	    }
	
	}


	function get_subscriptions() {
	
	    new_subscriptions_transaction();
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStore.index("id");
	
	        var cursorRequest = Buleys.index.getAll();
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	
	                });
	            }
	
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	