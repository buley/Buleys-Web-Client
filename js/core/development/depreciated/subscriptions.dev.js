	
	function new_subscriptions_transaction(  ) {
	jQuery(document).trigger('new_subscriptions_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["subscriptions"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	        };
	        Buleys.objectStore = transaction.objectStore("subscriptions");
	    } catch (e) {
	        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10 ) );
	        request.onsuccess = function ( e ) {

	            Buleys.objectStore = Buleys.db.createObjectStore("subscriptions", {
	                "keyPath": "key"
	            }, true);
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	        };
	        request.onerror = function ( e ) {

	        };
	    };
	}
	
	function add_subscription_to_subscriptions_database( the_type, the_key ) {
	jQuery(document).trigger('add_subscription_to_subscriptions_database');

	    new_subscriptions_transaction();
	    var data = {
	        "key": the_type + "_" + the_key,
	        "modified": new Date().getTime()
	    };
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	    };
	}
	
	function get_page_subscription_status( the_type, the_key ) {
	jQuery(document).trigger('get_page_subscription_status');

	    new_subscriptions_transaction();
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	    item_request.onsuccess = function ( event ) {

	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	            jQuery("#page_subscription_status").html("<div class='subscribe_topic empty_mail_icon'></div>");
	        } else {
	            jQuery("#page_subscription_status").html("<div class='unsubscribe_topic mail_icon'></div>");
	        }
	    };
	    item_request.onerror = function ( e ) {

	    };
	}
	
	function remove_subscription( the_type, the_key ) {
	jQuery(document).trigger('remove_subscription');

	
	
	    new_subscriptions_transaction();
	
	    var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}
	
	function add_subscription_if_doesnt_exist( the_type, the_key ) {
	jQuery(document).trigger('add_subscription_if_doesnt_exist');

	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	        new_subscriptions_transaction();
	
	        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	        item_request.onsuccess = function ( event ) {

	
	
	
	            if (typeof item_request.result == 'undefined') {
	
	                add_subscription_to_subscriptions_database(the_type, the_key);
	            } else {
	
	            }
	        };
	
	        item_request.onerror = function ( e ) {

	
	
	        };
	    }
	
	}


	function get_subscriptions(  ) {
	jQuery(document).trigger('get_subscriptions');

	
	    new_subscriptions_transaction();
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStoreCategories.index("id");
	
	        var cursorRequest = Buleys.index.openCursor();
	        cursorRequest.onsuccess = function ( event ) {

	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function ( k, item ) {

	
	                });
	            }
	
	        };
	        request.onerror = function ( event ) {

	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	

    $('.subscribe_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined' || the_key == "" ) {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }
        add_subscription_if_doesnt_exist(the_type, the_key);
        post_feedback('subscribe', "", the_key, the_type);

        $(this).removeClass('empty_mail_icon').addClass('mail_icon');
        $(this).removeClass('subscribe_topic');
        $(this).addClass('unsubscribe_topic');
    });

    $('.unsubscribe_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined' || the_key == "" ) {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }

        remove_subscription(the_type, the_key);
        post_feedback('unsubscribe', "", the_key, the_type);

        $(this).removeClass('mail_icon').addClass('empty_mail_icon');
        $(this).removeClass('unsubscribe_topic');
        $(this).addClass('subscribe_topic');
    });

	
