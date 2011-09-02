
/**
 * Seen.js
 **/

function get_seen( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	if( !!InDB.debug ) {
		console.log( 'get_seen', type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse );
	}

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

	var on_success = function ( context_1 ) {

		var event_1 = context_1.event;
		var result = event_1.target.result;
		if ( !result ) {
			return;
		}
		var item = result.value;
		var item_request_2 = Buleys.objectStore.get(item.link);

		var seen_on_success = function ( context_2 ) {

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
		
		var seen_on_error = function( context_2 ) {
			console.log( 'error in get_seen', context_2 );
		}		

		InDB.trigger( 'InDB_do_row_get', { 'store': 'seen', 'key': item_link, 'on_success': seen_on_success, 'on_error': seen_on_error } );

		};

		var on_error = function ( context_1 ) {
		console.log( 'error in get_seen', context_1 );
	};

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': on_success, 'on_error': on_error } );
	
}



function mark_item_as_seen( item_url, item_slug, item_type ) {
jQuery(document).trigger('mark_item_as_seen');

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	var on_success = function ( context ) {

	};
	var on_error = function ( context ) {

	};

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two vars are gratuitous	
function mark_item_as_unseen( item_url, item_slug, item_type ) {

	jQuery(document).trigger('mark_item_as_unseen');

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}

function add_item_as_seen( item_url ) {

	jQuery(document).trigger('add_item_as_seen');

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	var on_success = function ( context ) {

	};
	var on_error = function ( context ) {

	};

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: Function name really descriptive of method
function check_if_item_is_seen( item_url ) {

	jQuery(document).trigger('check_if_item_is_seen');

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

	InDB.trigger( 'InDB_do_row_get', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}

function add_item_to_seens_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('add_item_to_seens_database');	
	
	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	var on_success = function ( event ) {

	};
	var on_error = function ( e ) {
	
	};

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two gratuitious args	
function remove_item_from_seens_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('remove_item_from_seens_database');

	var on_success = function ( event ) {
	
	};
	var on_error = function (  ) {

	};

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}
