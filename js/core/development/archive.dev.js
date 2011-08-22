	
	function new_archived_transaction(  ) {
		
		jQuery(document).trigger('new_archived_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["archive"], IDBTransaction.READ_WRITE /*Read-Write*/ , 5000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {
			console.log("archive transaction complete");
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {
			console.log("archive transaction aborted");
			console.log(e);
	        };
	        Buleys.objectStore = transaction.objectStore("archive");
	
	    } catch (e) {
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10));
	        request.onsuccess = function ( e ) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("archive", {
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
	
		       var transaction = Buleys.db.transaction(["archive"], IDBTransaction.READ_WRITE /*Read-Write*/ , 5000 /*Time out in ms*/ );
			transaction.oncomplete = function ( e ) {
				console.log("archive transaction complete");
			    delete Buleys.objectStore;
			};
			transaction.onabort = function ( e ) {
				console.log("archive transaction aborted");
				console.log(e);
			};
			Buleys.objectStore = transaction.objectStore("archive");
		
	
	        };
	        request.onerror = function ( e ) {

	
	        };
	
	    };
	}
	
	
	function get_archived( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {
	jQuery(document).trigger('get_archived');
	console.log( 'archive.js > get_archived' );
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
	var keyCursor = IDBKeyRange.only(slug_filter);
	console.log(keyCursor);
	console.log("^key");
	    var cursorRequest = Buleys.index.openCursor( keyCursor );
	
	    cursorRequest.onsuccess = function ( event ) {

	        var result = event.target.result;
			var item = result.value;
	                if( !item ) {
				return;
			}
			new_archived_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function ( event1 ) {
	
	                    if (typeof event1.target.result !== 'undefined' && make_inverse !== true) {
	                        new_item_transaction();
	                        var item_request = Buleys.objectStore.get(event1.target.result.link);
	                        item_request.onsuccess = function ( event2 ) {
	
	                            if (typeof event2.target.result !== 'undefined') {
	                                if (typeof event2.target.result.link !== 'undefined') {
	                                    if (jQuery("#" +event2.target.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						console.log("get_item_raw");
						console.log( event2.target.result );
	                                        get_item_raw(event2.target.result.link);
	                                    }
	
	                                } else {
	
	                                }
	                            }
	
	                        };
	                    } else if (make_inverse == true) {
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item.link);
	
	                        item_request.onsuccess = function ( event ) {

	
	                            if (typeof item_request.result !== 'undefined') {
	
	
	                                if (typeof item_request.result !== 'undefined') {
	
	
	                                    if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                                        get_item_raw(item_request.result.link);
	                                    }
	
	                                } else {
	
	                                }
	                            }
	
	                        };
			}	

		};
		result["continue"]();
	     };
	    cursorRequest.onerror = function ( event ) {

	
	    };
	
	
	
	}
	
	
	
	
	function archive_item( item_url ) {
	jQuery(document).trigger('archive_item');


		console.log("Archiving item: " + item_url );
	
	    new_archived_transaction();
	
	    var data = {
	        "link": item_url,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

		console.log(event.target.result);	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

		console.log(e);
		console.log('error archiving item');	
	
	    };
	
	}
	
	function check_if_item_is_archived( item_url ) {
	jQuery(document).trigger('check_if_item_is_archived');

	
	
	    new_archived_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function ( event ) {

	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('archived');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unarchived');
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	
	
	}
	
	function add_item_to_archives_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('add_item_to_archives_database');

	
	
	    new_archived_transaction();
	
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
	
	function unarchive_item( item_url, item_slug, item_type ) {
	jQuery(document).trigger('unarchive_item');

	
	
	    new_archived_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}
	
	
		
	function remove_item_from_archives_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('remove_item_from_archives_database');

	
	
	    new_archived_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}

