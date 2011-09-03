
function get_read( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	/* Action */

	jQuery(document).trigger('get_read');

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

	cursor_on_success = function ( context_1 ) {

		var event_1 = context_1.event;

		if( !InDB.isEmpty( InDB.cursor.value( event_1 ) ) ) { 

			if ( make_inverse !== true) {
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw(item_request_2.result.link);
				}
			} else { 
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw(item.link);
				}
			}
		}

	};

	cursor_on_error = function ( event ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

}


function mark_item_as_read( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_read');
	
	/* Setup */

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	}

	/* Callbacks */

	var add_on_success = function ( event ) {

	};

	var add_on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'status', 'key': item_url, 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

};


function remove_item_from_read_database( item_url, item_slug, item_type ) {

	/* Action */
	
	jQuery(document).trigger('remove_item_from_read_database');

	/* Callbacks */

	var add_on_success = function ( event ) {

	};

	var add_on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'status', 'key': item_url, 'on_success': add_on_success, 'on_error': add_on_error } );

}

	
function add_item_to_readstatus_database( item, status ) {

	/* Action */

	jQuery(document).trigger('add_item_to_readstatus_database');

	/* Defaults */

	if (typeof status == 'undefined') {
		status = "unread";
	}

	/* Setup */

	var data = {
		"link": item.link,
		"status": status,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var add_on_success = function ( event ) {

	};

	var add_on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'status', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}
