
/**
 * Archive.js 
 **/

function get_archived( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	if( Buleys.debug ) {
		console.log( 'archive.js > get_archived', type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse );
	}

	jQuery(document).trigger('get_archived');

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

	categories_on_success = function ( context_1 ) {

		var result = context_1.target.result;
		var item = result.value;
		if( !item ) {
			return;
		}

		var categories_on_success = function ( context_2 ) {

			var event1 = context_2.event;

			if ( typeof event1.target.result !== 'undefined' && make_inverse !== true ) {
				new_item_transaction();
				var item_link = event1.target.result.link;
				var item_request = Buleys.objectStore.get( item_link );
				items_on_success = function ( context_3 ) {
					var event2 = context.event;
					if ( typeof event2.target.result !== 'undefined' && typeof event2.target.result.link !== 'undefined' && jQuery( "#" + event2.target.result.link.replace(/[^a-zA-Z0-9-_]+/g, "") ).length <= 0 ) {
						get_item_raw( event2.target.result.link );
					}
				};

				InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_link, 'on_success': items_on_success, 'on_error': items_on_error } );

			} else if ( make_inverse == true ) {

				items_on_success = function ( context_3 ) {
					//TODO: rename item_request var
					var item_request = context_3.event;
					if (typeof item_request.result !== 'undefined' && item_request.result !== 'undefined' && jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0 ) {

						get_item_raw(item_request.result.link);

					}

				};

				InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_link, 'on_success': items_on_success, 'on_error': items_on_error } );
			}	

		};
	};
	
	var categories_on_error = function ( event ) {

	};

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'items', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': items_on_success, 'on_error': items_on_error } );

}


function archive_item( item_url ) {
	
	/* Action */

	jQuery(document).trigger('archive_item');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	var add_on_success = function ( context ) {
		console.log( 'archived item', context );
	};
	var add_on_error = function ( context ) {
		console.log( 'Error archiving item', context );	
	};

	/* Request */
	
	InDB.trigger( 'InDB_do_row_add', { 'store': 'archive', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

function check_if_item_is_archived( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_archived');

	var archive_on_success = function ( context) {

		if (typeof item_request.result != 'undefined') {

			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('archived');

		} else {

			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unarchived');

		}

	};

	var archive_on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'archive', 'key': item_url, 'on_success': items_on_success, 'on_error': items_on_error } );

}

function add_item_to_archives_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('add_item_to_archives_database');

	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	var archive_on_success = function ( context ) {

	};

	var archive_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_add', { 'store': 'archive', 'data': data, 'on_success': archive_on_success, 'on_error': archive_on_error } );

}


//TODO: Fix gratuitous args
function unarchive_item( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('unarchive_item');

	var archive_on_success = function ( context ) {

	};

	var archive_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'archive', 'key': item_url, 'on_success': archive_on_success, 'on_error': archive_on_error } );

}

	
//TODO: Fix gratuitous args
//TODO: remove this function in favor of unarchive_item
function remove_item_from_archives_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('remove_item_from_archives_database');
	
	unarchive_item( item_url, item_slug, item_type );

}

