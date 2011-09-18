
/** 
 * Trash.js
 **/

function get_deleted( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {
	
	/* Action */

	jQuery(document).trigger('get_deleted', { "type_filter": type_filter, "slug_filter": slug_filter, "begin_timeframe":begin_timeframe, "end_timestamp":end_timeframe, "make_inverse": make_inverse } );

	/* Default */

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

	/* Request */

	var cursor_on_success = function ( context_1 ) {

		var result = context_1.event.target.result;
		var item = result.value;
		
		var deleted_on_success = function ( context_2 ) {

			/* Setup */

			var event_2 = context_2.event;

			if( typeof event_2.target.result !== 'undefined' ) {

				/* Setup */

				var on_success_2, on_error_2;

				/* Work */

				// TODO: These don't actually handle asc/desc
				if( make_inverse !== true) {
					on_success_2 = function ( event ) {
						if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
							if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
								get_item_raw_no_trash(event.target.result.link);
							}
						} 
					};
	
				} else {
					on_success_2 = function ( event ) {
						if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
							if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
								get_item_raw_no_trash(event.target.result.link);
							}
						} 
					};
				}

				on_error_2 = function( context ) {

				}

				InDB.trigger( 'InDB_do_row_get', { 'context': 'deleted', 'key': item.link, 'on_success': on_success_2, 'on_error': on_error_2 } );

			}

		}

		var deleted_on_error = function ( context ) {

		}
	
		/* Request */

		InDB.trigger( 'InDB_do_row_put', { 'context': 'deleted', 'key': item.link, 'on_success': deleted_on_success, 'on_error': deleted_on_error } );

	};

	var cursor_on_error = function ( context ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'context': 'categories', 'keyRange': InDB.range.only( slug_filter ), 'index': 'slug', 'on_success': cursor_on_success, 'on_error': cursor_on_error } );
	
}

function mark_item_as_deleted( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_deleted');

	/* Setup */

	var data = {
		"link": item_url,
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

	InDB.trigger( 'InDB_do_row_put', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function mark_item_as_undeleted( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_undeleted');

	/* Callbacks */

	var on_success = function ( context ) {
		recreate_item( item_url );	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function delete_item( item_url, the_type, the_slug ) {

	/* Action */

	jQuery(document).trigger('delete_item');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Request */

	var on_success = function ( event ) {
		//commenting this out allows for item restoration
		//remove_item_from_items_database(item_url, the_type, the_slug);
		remove_item_from_favorites_database(item_url, the_type, the_slug);
		remove_item_from_categories_database(item_url, the_type, the_slug);
		remove_item_from_archives_database(item_url, the_type, the_slug);
		remove_item_from_seens_database(item_url, the_type, the_slug);
		remove_item_from_read_database(item_url, the_type, the_slug);
	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function undelete_item( item_url, the_type, the_slug ) {
	
	/* Action */

	jQuery(document).trigger('undelete_item');

	/* Callbacks */

	var on_success = function ( context ) {
		recreate_item( item_url );	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );
	
}


function check_if_item_is_deleted( item_url ) {

	/* Action */

	jQuery(document).trigger( 'check_if_item_is_deleted', { "item_url": item_url } );

	/* Callbacks */

	var on_success = function ( context ) {
		var item_request = context.event;
		if (typeof item_request.result != 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link star_icon'></a></span>");
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('deleted');
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link empty_star_icon'></a></span>");
		}
	};

	var on_error = function ( e ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}


function add_item_to_deletes_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('add_item_to_deletes_database');

	/* Setup */

	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	}

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'data': data, 'on_success': on_success, 'on_error': on_error } );
	
}


function remove_item_from_deletes_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_deletes_database');

	/* Callbacks */

	var on_success = function ( context ) {

	}

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}
