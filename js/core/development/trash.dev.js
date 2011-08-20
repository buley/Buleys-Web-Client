	
	function new_deleted_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["deleted"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	            delete Buleys.objectStore;
	        };
	        transaction.onerror = function (e) {
			console.log("new_deleted_transaction error");
			console.log(e);
	        };
        transaction.onabort = function (e) {
			console.log("new_deleted_transaction abort");
			console.log(e);
	        };
	        Buleys.objectStore = transaction.objectStore("deleted");
	
	    } catch (e) {
	
		console.log("big ol fail");	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("deleted", {
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

	
	function get_deleted(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	
	
	
	
	
	                new_deleted_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item_request_2.result.link);
	
	                        item_request.onsuccess = function (event) {
	
	                            if (typeof item_request.result !== 'undefined' && make_inverse !== true) {
	
	
	                                if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                                    get_item_raw_no_trash(item_request.result.link);
	                                }
	
	                            }
	
	                        };
	                    } else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item.link);
	
	                        item_request.onsuccess = function (event) {
	
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
	
	
	
	
	
	
	
	
	            });
	
	        } else {
	            get_item(objectCursor.link);
	        }
	    };
	    cursorRequest.onerror = function (event) {
	
	    };
	
	
	
	}
	
		
	function mark_item_as_deleted(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
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
	
	function mark_item_as_undeleted(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	
	
	function delete_item(item_url, the_type, the_slug) {
	
	
	    new_deleted_transaction();
	
	    var data = {
	        "link": item_url,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	/*
				
				
		
				remove_item_from_items_database(item_url, the_type, the_slug);
			
				remove_item_from_favorites_database(item_url, the_type, the_slug);
			
				remove_item_from_categories_database(item_url, the_type, the_slug);
			
				remove_item_from_archives_database(item_url, the_type, the_slug);
			
				remove_item_from_seens_database(item_url, the_type, the_slug);
			
				remove_item_from_read_database(item_url, the_type, the_slug);
	
	
				*/
	    };
	    add_data_request.onerror = function (e) {
	
	
	
	    };
	
	
	
	
	
	    remove_item_from_favorites_database(item_url, the_type, the_slug);
	
	    remove_item_from_categories_database(item_url, the_type, the_slug);
	
	    remove_item_from_archives_database(item_url, the_type, the_slug);
	
	    remove_item_from_seens_database(item_url, the_type, the_slug);
	
	    remove_item_from_read_database(item_url, the_type, the_slug);
	
	
	
	}
	
	function check_if_item_is_deleted(item_url) {
	
	
	    new_deleted_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link star_icon'></a></span>");
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('deleted');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link empty_star_icon'></a></span>");
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	}
	
	function add_item_to_deletes_database(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	    var data = {
	        "item_link": item_url,
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
	
	function remove_item_from_deletes_database(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	
	
	

