function get_follows(  ) {
	jQuery(document).trigger('get_follows');

	var on_success = function( context ) {
		console.log( InDB.rows.value( context.event ) );
	}
	var on_error = function( context ) {
		console.log( 'get_follows error', context );
	}

	InDB.trigger( 'InDB_rows_get', { 'store': 'follows', 'keyRange': InDB.transaction.left_open('0'), 'on_success': on_success, 'on_error': on_error } );
}
function getKeys( obj ) {
	jQuery(document).trigger('getKeys');

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

	jQuery(document).trigger('get_page_follow_status');

	var follows_on_success = function ( context ) {
		var event = context.event;
		if (typeof event.result == 'undefined' || event.result == "") {
			jQuery("#page_follow_status").html("<div class='follow_topic empty_heart_icon'></div>");
		} else {
			jQuery("#page_follow_status").html("<div class='unfollow_topic heart_icon'></div>");
		}
	};
	var follows_on_error = function ( e ) {
		console.log('Follows error getting status');
	};
	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( the_type + "_" + the_key ), 'on_success': follows_on_success, 'on_error': follows_on_error } );
}

function remove_follow( the_type, the_key ) {
	jQuery(document).trigger('remove_follow');

	var on_success = function( context ) {
		console.log( 'Follow removed' );
	}
	var on_error = function( context ) {
		console.log( 'remove_follow error', context );
	}

	InDB.trigger( 'InDB_row_delete', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}

function add_follow_if_doesnt_exist( the_type, the_key ) {
	jQuery(document).trigger('add_follow_if_doesnt_exist');

	var on_success = function( context ) {
		var item_request = context.event;
		//Not yet following	
		if (typeof item_request.result == 'undefined') {
			add_follow_to_follows_database(the_type, the_key);
		}

	}
	var on_error = function( context ) {
		console.log( 'Follow already exists', context );
	}

	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}

function add_follow_to_follows_database( the_type, the_key ) {
	jQuery(document).trigger('add_follow_to_follows_database');

	var data = {
		"key": the_type + "_" + the_key,
		"modified": new Date().getTime()
	};

	var on_success = function( context ) {
		console.log( 'Added follow to follow database', context );
	}
	var on_error = function( context ) {
		console.log( 'Error adding follow to follow database', context );
	}

	InDB.trigger( 'InDB_row_add', { 'store': 'follows', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

$('html').bind('mousemove', function ( e ) {

	Buleys.mouse.mouse_x = e.pageX;
	Buleys.mouse.mouse_y = e.pageY;
});


$('.follow_topic').live('click', function ( event ) {

	event.preventDefault();
	var the_key = $(this).attr('key');
	var the_type = $(this).attr('type');

	if (typeof the_key == 'undefined') {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}
	if (typeof the_type == 'undefined' || the_type == '') {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	add_follow_if_doesnt_exist(the_type, the_key);
	post_feedback('follow', '', the_key, the_type);

	$(this).removeClass('empty_heart_icon').addClass('heart_icon');
	$(this).removeClass('follow_topic');
	$(this).addClass('unfollow_topic');

});
$('.unfollow_topic').live('click', function ( event ) {

	event.preventDefault();
	var the_key = $(this).attr('key');
	var the_type = $(this).attr('type');

	if (typeof the_key == 'undefined') {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}
	if (typeof the_type == 'undefined' || the_type == "") {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	remove_follow(the_type, the_key);
	post_feedback('unfollow', '', the_key, the_type);

	$(this).removeClass('heart_icon').addClass('empty_heart_icon');
	$(this).removeClass('unfollow_topic');
	$(this).addClass('follow_topic');
});
