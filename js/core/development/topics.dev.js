	
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
	
		InDB.trigger( 'InDB_row_put', { 'store': 'topic', 'data': topic, 'on_success': on_success, 'on_failure': on_failure } );
	
	}
	
	
	
	function get_page_topic_info( the_type, the_key ) {
	jQuery(document).trigger('get_page_topic_info');

	
		var on_success = function ( context ) {


		    if (typeof context.event.result !== 'undefined') {
				load_page_title_info( context.event.result);	
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
	
		var on_error = function ( e ) {
			console.log('error getting topic', e );
		};
	
		InDB.trigger( 'InDB_do_row_get', { 'store': 'topics', 'key': ( the_type + "_" + the_key ), 'index': null, 'on_success': on_success, 'on_error': on_error } );
	}
	
	
	function get_topics( ) {

		jQuery(document).trigger('get_topics');

		var on_success = function( context ) {
			console.log( InDB.row.value( context.event ) );
		}

		var on_error = function( context ) {
			console.log( 'There was an error in get_topics()' );
		}
	
		InDB.trigger( 'InDB_cursor_get', { 'store': 'topics', 'index': 'topic_key', 'keyRange': InDB.transaction.left_open( '0' ) /* Everything */ } ); 	
	
	}
	
	function remove_topic( topic_key ) {
		jQuery(document).trigger('remove_topic');

		var on_success = function ( context ) {
				console.log( 'Removed topic successfully', context );
		};
		var on_error = function ( context ) {
			console.log( 'There was an error removing the topic', context );
		};
		
		InDB.trigger( 'InDB_row_delete', { 'store': topic, 'key': topic_key, 'on_success': on_success, 'on_error': on_error } );
	}
	
	function add_or_update_topic( topic ) {
		
		jQuery(document).trigger('add_or_update_topic');
	
		if (typeof topic == 'undefined') {
		    	topic = {};
		}
		
		var on_success = function( context ) {
			console.log( 'Topic added or updated', context );
		}

		var on_error = function( context ) {
			console.log( 'There was an error adding or updating the topic', context );
		}
		console.log('adding topic', topic );
		InDB.trigger( 'InDB_do_row_put', { 'store': 'topics', 'data': topic, 'on_success': on_success, 'on_error': on_error } );

	}
	
	function add_topic_to_topics_database( topic_key, topic ) {

		jQuery(document).trigger('add_topic_to_topics_database');

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
	
	
	
