
	function get_read(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	    Buleys.index = Buleys.objectStore.index("slug");
	    var cursorRequest = Buleys.index.openCursor(slug_filter);
	
	    cursorRequest.onsuccess = function (event) {
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	            return;
	        }
	
	
	
	        if (objectCursor.length > 1) {
	            jQuery.each(objectCursor, function (k, item) {
	
	
	
	
	
	
	                new_status_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item_raw(item_request_2.result.link);
	                        }
	
	                    } else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item_raw(item.link);
	                        }
	
	                    }
	
	                };
	
	
	
	
	
	
	
	
	            });
	
	        } else {
	            get_item(objectCursor.link);
	        }
	    };
	    cursorRequest.onerror = function (event) {
	
	    };
	
	
	
	}
	
	
	
	
	
	function mark_item_as_read(item_url, item_slug, item_type) {
	
	
	    new_status_transaction();
	
	    var data = {
	        "link": item_url,
	        "topic_slug": item_slug,
	        "topic_type": item_type,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function new_status_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["status"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("status");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("status", {
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
	        request.onerror = function (e) {
	
	        };
	
	    };
	}

	
	function remove_item_from_read_database(item_url, item_slug, item_type) {
	
	
	    new_status_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
		
	function add_item_to_readstatus_database(item, status) {
	
	    if (typeof status == 'undefined') {
	        status = "unread";
	    }
	
	    new_status_transaction();
	
	    var data = {
	        "link": item.link,
	        "status": status,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	
	    };
	
	}

