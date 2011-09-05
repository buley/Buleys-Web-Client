
/**
 * Seen.js
 **/


function get_seen( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	/* Debug */

	if( !!InDB.debug ) {
		console.log( 'get_seen', type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse );
	}

	/* Action */

	jQuery(document).trigger('get_seen');

	/* Defaults */

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Callbacks */

	var on_success = function ( context_1 ) {

		/* Setup */

		var event_1 = context_1.event;
		var result = event_1.target.result;
		var item = result.value;

		/* Callbacks */

		var item_on_success = function ( context_2 ) {

			var event_2 = context_2.event;
			if (typeof event_2.target.result !== 'undefined' && make_inverse !== true) {

				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item( item.link );
				}

			} else if (typeof event_2.target.result == 'undefined' && make_inverse == true) {

				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item( item.link );
				}

			}

		};
		
		var item_on_error = function( context_2 ) {
			console.log( 'error in get_seen', context_2 );
		}		

		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item.link, 'on_success': item_on_success, 'on_error': item_on_error } );

	};

	var on_error = function( context ) {
		console.log('Failure in get_seen()', context );
	}

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'status', 'index': 'topic_slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': on_success, 'on_error': on_error } );
	
}



function mark_item_as_seen( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_seen');

	/* Setup */

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two vars are gratuitous	
function mark_item_as_unseen( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_unseen');

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function add_item_as_seen( item_url ) {

	/* Action */

	jQuery(document).trigger('add_item_as_seen');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: Function name really descriptive of method
function check_if_item_is_seen( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_seen');

	/* Callbacks */

	var on_success = function ( context ) {
		var item_request = context.event;
		if (typeof item_request.result != 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('seen');
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unseen');
		}
	};

	var on_error = function ( e ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}

function add_item_to_seens_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('add_item_to_seens_database');	

	/* Setup */
	
	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( event ) {

	};

	var on_error = function ( e ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two gratuitious args	
function remove_item_from_seens_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_seens_database');

	/* Callbacks */

	var on_success = function ( event ) {
	
	};

	var on_error = function (  ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}
