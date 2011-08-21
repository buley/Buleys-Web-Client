	
	function parse_single_topic( topic_slug ) {
	jQuery(document).trigger('parse_single_topic');

	
	    var split_string = topic_slug.split("_");
	    var type_to_get = split_string[0];
	    var company_to_get = split_string[1];
	
	
	    var item = Buleys.queues.pending_crawls.slice(0, 1);
	    Buleys.queues.pending_crawls.push(topic_slug);
	
	
	
	}

	
	function update_topic_in_topics_database( topic_key, topic ) {
	jQuery(document).trigger('update_topic_in_topics_database');

	
	
	    new_topics_transaction();
	
	    topic.topic_key = topic_key;
	    topic.modified = new Date();
	
	    if (typeof topic.last_updated != 'undefined') {
	        topic.last_updated = new Date(parseInt(topic.last_updated) * 1000);
	    }
	    if (typeof topic.updated != 'undefined') {
	        topic.updated = new Date(parseInt(topic.updated) * 1000);
	    }
	    if (typeof topic.last_attempt != 'undefined') {
	        topic.last_attempt = new Date(parseInt(topic.last_attempt) * 1000);
	    }
	
	
	    var add_data_request = Buleys.objectStore.put(topic);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	
	
	function get_page_topic_info( the_type, the_key ) {
	jQuery(document).trigger('get_page_topic_info');

	    new_topics_transaction();
	
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	    item_request.onsuccess = function ( event ) {


	        if (typeof item_request.result !== 'undefined') {
				load_page_title_info(item_request.result);	
/*
	            if (typeof item_request.result.name != 'undefined') {
	                jQuery("#page_title").html("<a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a>");
	                window.document.title = window.document.title.replace(/[|\s]*?Buley's/, "");
	                window.document.title = window.document.title + item_request.result.name + " | Buley's";
	
	
	            } else {
	    			jQuery("#page_title").html("");
	    		}
	            if (typeof item_request.result.subsector != 'undefined') {
	                jQuery("#subtitle_1").html("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
	            } else {
	    			jQuery("#subtitle_1").html("");
	 		    }
	
	            if (typeof item_request.result.sector != 'undefined') {
	                jQuery("#subtitle_2").html("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
	            } else {
	    			jQuery("#subtitle_2").html("");
	   			}
*/	
	
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	
	function get_topics(  ) {
	jQuery(document).trigger('get_topics');

	
	    try {
	
	        new_topics_transaction();
	        Buleys.index = Buleys.objectStore.index("topic_key");
	
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
	
	
	function remove_topic( topic_key ) {
	jQuery(document).trigger('remove_topic');

	
	    new_topics_transaction();
	
	    var request = Buleys.objectStore["delete"](topic_key);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	}
	
	function add_or_update_topic( topic_key, topic ) {
	jQuery(document).trigger('add_or_update_topic');

	
	    new_topics_transaction();
	    if (typeof topic == 'undefined') {
	        topic = {};
	    }
	
	    var item_request = Buleys.objectStore.get(topic_key);
	
	    item_request.onsuccess = function ( event ) {

	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_topic_to_topics_database(topic_key, topic);
	        } else {
	
	            update_topic_in_topics_database(topic_key, topic);
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_topic_to_topics_database( topic_key, topic ) {
	jQuery(document).trigger('add_topic_to_topics_database');

	
	
	    new_topics_transaction();
	
	    if (typeof topic == "undefined") {
	        var topic = {};
	    }
	    topic.topic_key = topic_key;
	    topic.modified = new Date();
	
	
	    var add_data_request = Buleys.objectStore.add(topic);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}


	function new_topics_transaction(  ) {
	jQuery(document).trigger('new_topics_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["topic"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	
	        };
	        Buleys.objectStore = transaction.objectStore("topic");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10 ) );
	        request.onsuccess = function ( e ) {

	
	            Buleys.objectStore = Buleys.db.createObjectStore("topic", {
	                "keyPath": "topic_key"
	            }, true);
	
	            Buleys.objectStore.createIndex("slug", "slug", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("type", "type", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("last_updated", "last_updated", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function ( e ) {

	
	        };
	
	
	    };
	}
	
	
	
