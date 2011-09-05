
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
		var item_1 = InDB.cursor.value( event_1 );
		if ( null === item_1 ) {
			return;
		}
		console.log('got from status db ',event_1,item_1);

		if( !make_inverse ) {
			get_item_raw( item_1.link );
			return;
		} else {

			var seen_on_success = function( context_2 ) { 
				
				var event_2 = context_2.event;
				var item_2 = InDB.cursor.value( event_2 );

				// Proceed if:
				// 1) Item is unseen (isEmpty) but we want to get unseen (make_inverse = true)
				// 2) Item is seen (!isEmpty) and we want to get seen
				console.log('seen_on_success', item_2 );
				if( ( !InDB.isEmpty( item_2 ) && true !== make_inverse ) || ( InDB.isEmpty( item_2 ) && true === make_inverse )  ) { 

					if (jQuery("#" + item_1.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {

						console.log('getting raw item in get_read() > ', item_1.link );
						get_item_raw(item_1.link);

					}

				}

			};

			var seen_on_error = function( context_2 ) {

			};
			
			InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_1.link, 'on_success': seen_on_success, 'on_error': seen_on_error } );

		}

	};

	cursor_on_error = function ( event ) {

	};

	/* Request */

	if( !!make_inverse ) {	

		InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

	} else {

		InDB.trigger( 'InDB_do_cursor_get', { 'store': 'status', 'index': 'topic_slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

	}

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
	};

	/* Callbacks */

	var add_on_success = function ( context ) {
		console.log( 'mark_item_as_read() success', context );
	};

	var add_on_error = function ( context ) {
		console.log( 'mark_item_as_read() error', context );
	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'status', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

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
