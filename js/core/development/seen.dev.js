	
	function new_seen_transaction(  ) {
	jQuery(document).trigger('new_seen_transaction');

	    try {
		var transaction = Buleys.db.transaction(["seen"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
		transaction.oncomplete = function ( e ) {

	
		    delete Buleys.objectStore;
		};
		transaction.onabort = function ( e ) {

	
		};
		Buleys.objectStore = transaction.objectStore("seen");
	
	    } catch (e) {
	
	
	
	
		var request = Buleys.db.setVersion(parseInt(Buleys.version, 10) );
		request.onsuccess = function ( e ) {

	
		    Buleys.objectStore = Buleys.db.createObjectStore("seen", {
			"keyPath": "link"
		    }, true);
	
		    Buleys.objectStore.createIndex("topic_slug", "topic_slug", {
			unique: false
		    });
		    Buleys.objectStore.createIndex("topic_type", "topic_type", {
			unique: false
		    });
		    Buleys.objectStore.createIndex("modified", "modified", {
			unique: false
		    });
	
	
	
		};
		request.onerror = function ( e ) {

	
		};
	
	    };
	}


	function get_seen( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

		jQuery(document).trigger('get_seen');

		if (typeof make_inverse == "undefined") {
			make_inverse = false;
		}

		var begin_date = 0;
		if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
			begin_date = 0
		} else {
			begin_date = parseInt(begin_timeframe);
		}

		var end_date = 0;
		if (typeof end_timeframe == "undefined" || end_timeframe == null) {
			end_date = new Date().getTime();
		} else {
			end_date = parseInt(end_timeframe);
		}

		new_categories_transaction();

		Buleys.index = Buleys.objectStoreCategories.index("slug");
		var keyRange = IDBKeyRange.only( slug_filter );
		var cursorRequest = Buleys.index.openCursor( keyRange );

		cursorRequest.onsuccess = function ( event ) {

			if (!event.target.result ) {
				return;
			}

			var result = event.target.result;
			var item = result.value;
			new_seen_transaction();

			var item_request_2 = Buleys.objectStore.get(item.link);
			item_request_2.onsuccess = function ( event1 ) {

				if (typeof event1.target.result !== 'undefined' && make_inverse !== true) {

					if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						get_item(item.link);
					}

				} else if (typeof event1.target.result == 'undefined' && make_inverse == true) {

					if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						get_item(item.link);
					}

				}

			};

			result.continue();	
	    	};
	
	    	cursorRequest.onerror = function ( event ) {
		};
	}



	function mark_item_as_seen( item_url, item_slug, item_type ) {
	jQuery(document).trigger('mark_item_as_seen');

	
	
	    new_seen_transaction();
	
	    var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
		Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function mark_item_as_unseen( item_url, item_slug, item_type ) {
	jQuery(document).trigger('mark_item_as_unseen');

	
	
	    new_seen_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function ( event ) {

	
		delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}


	
	
	
	function add_item_as_seen( item_url ) {
	jQuery(document).trigger('add_item_as_seen');

	
	
	    new_seen_transaction();
	
	    var data = {
		"link": item_url,
		"modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
		Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function check_if_item_is_seen( item_url ) {
	jQuery(document).trigger('check_if_item_is_seen');

	
	
	    new_seen_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function ( event ) {

	
		checker = item_request;
	
	
		if (typeof item_request.result != 'undefined') {
	
		    jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('seen');
	
		} else {
	
		    jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unseen');
		}
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	
	
	}
	
	function add_item_to_seens_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('add_item_to_seens_database');

	
	
	    new_seen_transaction();
	
	    var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
		Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	
	function remove_item_from_seens_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('remove_item_from_seens_database');

	
	
	    new_seen_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function ( event ) {

	
		delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}
	
	

