
/**
 * Follows.js
 **/


function get_follows(  ) {

	/* Action */

	jQuery( document ).trigger( 'get_follows' );

	/* Callbacks */

	var on_success = function( context ) {
		console.log( InDB.rows.value( context.event ) );
	}

	var on_error = function( context ) {
		console.log( 'get_follows error', context );
	}

	/* Request */

	InDB.trigger( 'InDB_rows_get', { 'store': 'follows', 'keyRange': InDB.transaction.left_open( '0' ), 'on_success': on_success, 'on_error': on_error } );

}


function getKeys( obj ) {
	
	/* Action */

	jQuery( document ).trigger( 'getKeys' );

	var keys = [];

	if (typeof obj !== "undefined") {

		$.each(obj, function ( key, obj ) {

			keys.push(key);
		});

		return keys.length;

	} else {

		return 0;

	}
}


function get_page_follow_status( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'get_page_follow_status' );

	/* Callback */

	var follows_on_success = function ( context ) {
		var event = context.event;
		if (typeof event.result == 'undefined' || event.result == "") {
			jQuery( "#page_follow_status").html("<div class='follow_topic empty_heart_icon'></div>");
		} else {
			jQuery( "#page_follow_status").html("<div class='unfollow_topic heart_icon'></div>");
		}
	};

	var follows_on_error = function ( e ) {
		console.log( 'Follows error getting status' );
	};

	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( the_type + "_" + the_key ), 'on_success': follows_on_success, 'on_error': follows_on_error } );

}


function remove_follow( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'remove_follow' );

	/* Callback */

	var on_success = function( context ) {
		console.log( 'Follow removed' );
	}

	var on_error = function( context ) {
		console.log( 'remove_follow error', context );
	}

	/* Request */

	InDB.trigger( 'InDB_row_delete', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}


function add_follow_if_doesnt_exist( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'add_follow_if_doesnt_exist' );

	/* Callback */

	var on_success = function( context ) {
		var item_request = context.event;
		//Not yet following	
		if (typeof item_request.result == 'undefined' ) {
			add_follow_to_follows_database(the_type, the_key);
		}

	}

	var on_error = function( context ) {
		console.log( 'Follow already exists', context );
	}

	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}


function add_follow_to_follows_database( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'add_follow_to_follows_database' );

	/* Setup */

	var data = {
		"key": the_type + "_" + the_key,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function( context ) {
		console.log( 'Added follow to follow database', context );
	}

	var on_error = function( context ) {
		console.log( 'Error adding follow to follow database', context );
	}

	/* Request */

	InDB.trigger( 'InDB_row_add', { 'store': 'follows', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}


jQuery(  'html' ).bind( 'mousemove', function ( e ) {

	/* UI */

	Buleys.mouse.mouse_x = e.pageX;
	Buleys.mouse.mouse_y = e.pageY;

});



jQuery(  '.follow_topic' ).live( 'click', function ( event ) {

	// Prevent clickthrough
	event.preventDefault();

	/* Setup */

	var the_key = jQuery( this ).attr( 'key' );
	var the_type = jQuery( this ).attr( 'type' );

	if (typeof the_key == 'undefined' ) {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}

	if (typeof the_type == 'undefined' || the_type == '' ) {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	/* Methods */

	add_follow_if_doesnt_exist(the_type, the_key);

	post_feedback( 'follow', '', the_key, the_type);

	/* UI */

	jQuery( this ).removeClass( 'empty_heart_icon' ).addClass( 'heart_icon' );
	jQuery( this ).removeClass( 'follow_topic' );
	jQuery( this ).addClass( 'unfollow_topic' );

} );

jQuery(  '.unfollow_topic' ).live( 'click', function ( event ) {

	// Prevent clickthrough
	event.preventDefault();

	/* Setup */

	var the_key = jQuery( this ).attr( 'key' );
	var the_type = jQuery( this ).attr( 'type' );

	if (typeof the_key == 'undefined' ) {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}

	if (typeof the_type == 'undefined' || the_type == "") {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	/* Methods */

	remove_follow(the_type, the_key);

	post_feedback( 'unfollow', '', the_key, the_type);

	/* UI */

	jQuery( this ).removeClass( 'heart_icon' ).addClass( 'empty_heart_icon' );
	jQuery( this ).removeClass( 'unfollow_topic' );
	jQuery( this ).addClass( 'follow_topic' );

} );
