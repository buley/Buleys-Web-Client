
/**
 *  Topic.js
 **/


function parse_single_topic( topic_slug ) {

	/* Action */

	jQuery(document).trigger('parse_single_topic');

	/* Setup */

	var split_string = topic_slug.split("_");
	var type_to_get = split_string[0];
	var company_to_get = split_string[1];
	var item = Buleys.queues.pending_crawls.slice(0, 1);
	
	/* Work */

	Buleys.queues.pending_crawls.push( topic_slug );

}


function update_topic_in_topics_database( topic_key, topic ) {

	/* Action */

	jQuery(document).trigger('update_topic_in_topics_database');

	/* Setup */

	topic.topic_key = topic_key;

	/* Defaults */

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

	/* Requests */

	InDB.trigger( 'InDB_row_put', { 'store': 'topic', 'data': topic, 'on_success': on_success, 'on_failure': on_failure } );

}



function get_page_topic_info( the_type, the_key ) {

	/* Action */

	jQuery(document).trigger('get_page_topic_info');

	/* Callbacks */

	var on_success = function ( context ) {

	    if (typeof context.event.result !== 'undefined') {
			load_page_title_info( context.event.result);	
			// TODO: Use or lose the commented code below
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

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'topics', 'key': ( the_type + "_" + the_key ), 'index': null, 'on_success': on_success, 'on_error': on_error } );

}


function get_topics( ) {

	/* Action */

	jQuery(document).trigger('get_topics');

	/* Callbacks */

	var on_success = function( context ) {
		console.log( InDB.row.value( context.event ) );
	}

	var on_error = function( context ) {
		console.log( 'There was an error in get_topics()' );
	}

	/* Request */

	InDB.trigger( 'InDB_cursor_get', { 'store': 'topics', 'index': 'topic_key', 'keyRange': InDB.transaction.left_open( '0' ) /* Everything */ } );	

}


function remove_topic( topic_key ) {

	/* Action */

	jQuery(document).trigger('remove_topic');

	/* Callbacks */

	var on_success = function ( context ) {
			console.log( 'Removed topic successfully', context );
	};

	var on_error = function ( context ) {
		console.log( 'There was an error removing the topic', context );
	};

	/* Request */
	
	InDB.trigger( 'InDB_row_delete', { 'store': topic, 'key': topic_key, 'on_success': on_success, 'on_error': on_error } );

}

function add_or_update_topic( topic ) {

	/* Action */
	
	jQuery(document).trigger('add_or_update_topic');

	/* Defaults */

	if (typeof topic == 'undefined') {
		topic = {};
	}

	/* Callbacks */
	
	var on_success = function( context ) {
		console.log( 'Topic added or updated', context );
	}

	var on_error = function( context ) {
		console.log( 'There was an error adding or updating the topic', context );
	}

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'topics', 'data': topic, 'on_success': on_success, 'on_error': on_error } );

}

function add_topic_to_topics_database( topic_key, topic ) {

	/* Action */

	jQuery(document).trigger('add_topic_to_topics_database');

	/* Setup */

	topic.topic_key = topic_key;

	/* Defaults */

	if (typeof topic == "undefined") {
		var topic = {};
	}

	topic.modified = new Date();

	/* Callbacks */

	var on_success = function ( context ) {
		
		/* Debug */
	
		if( !!Buleys.debug ) {
			console.log( 'topic.js > add_topic_to_topics_database() > on_success', context );
		}
	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'topics', 'data': topic, 'on_success': on_success, 'on_error': on_error } );

}
