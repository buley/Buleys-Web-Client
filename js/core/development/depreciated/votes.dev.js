
/**
 * Items.js
 **/


function check_item_vote_status_for_overlay( item_url ) {

	/* Action */

	jQuery(document).trigger('check_item_vote_status_for_overlay');

	/* Callbacks */
	var on_success = function ( context_1 ) {

		/* Setup */

		var event = context_1.event;

		/* UI */

		if (typeof event.target.result !== 'undefined') {
			console.log("VOTE VALUE", event.target.result, event.target.result.vote_value );
			if (event.target.result.vote_value == -1) {
				jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down vote thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			} else if (event.target.result.vote_value == 1) {
				jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up vote thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			} else {
				jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			}

			jQuery("#overlay_left").parent().addClass('voted');

		} else {

			jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');

			jQuery("#overlay_left").parent().addClass('unvoted');

		}

	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'votes', 'key': item_url.replace(/[^a-zA-Z0-9-_]+/g, ""), 'on_success': on_success, 'on_error': on_error } );
	
}

function get_vote_info( the_url, the_type, the_key ) {

	/* Action */

	jQuery(document).trigger('get_vote_info');

	/* Setup */

	var vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_key.toLowerCase();

	/* Callbacks */
	
	var on_success = function ( context ) {

		/* Setup */

		var item_request = context.event;

		/* UI */

		if ( typeof item_request.result !== 'undefined' && item_request.result !== "") {

			if (item_request.result.vote_value == 0) {
				jQuery("#" + vote_key).addClass("voted downvoted");
			} else if (item_request.result.vote_value == 1) {
				jQuery("#" + vote_key).addClass("voted upvoted");
			}

		}
	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'votes', 'key': vote_key, 'on_success': on_success, 'on_error': on_error } );
	
}

// TODO: Do timeframes do anything?
function get_voted( type_filter, slug_filter, vote_value, begin_timeframe, end_timeframe, make_inverse ) {

	/* Action */

	jQuery(document).trigger('get_voted');

	/* Defaults */

	var keyRange;
	if( !!vote_value ) {
		keyRange = InDB.range.left_open( '0' ); // Everything
	} else {
		keyRange = InDB.range.only( vote_value );
	}

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
		var item = InDB.cursor.value( event_1 );
	
		if( !InDB.isEmpty( InDB.cursor.value( event_1 ) ) ) { 

			if ( make_inverse !== true) {
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw( item.link );
				}
			} else { 
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw( item.link );
				}
			}
		}

	};

	cursor_on_error = function ( event ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'voted', 'index': 'vote_value', 'keyRange': keyRange, 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

}


function remove_vote( vote_key ) {
	
	/* Action */

	jQuery( document ).trigger('remove_vote');
	
	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'votes', 'key': vote_key, 'on_success': on_success, 'on_error': on_error } );

}

function add_or_update_vote( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('add_or_update_vote');

	/* Defaults */
	
	if (typeof vote_value == 'undefined') {
		vote_value = '';
	}

	/* Setup */

	var data = {
		'vote_key': vote_key,
		'vote_value': vote_value,
		"modified": new Date().getTime()
	};
	
	/* Callbacks */

	var on_success = function ( context ) {
		console.log('Successfully updated vote', context );	
	};
	
	var on_error = function ( context ) {
		console.log('Failed to update vote', context );
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

function add_vote_to_votes_database( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('add_vote_to_votes_database');

	/* Setup */

	var data = {
		"vote_key": vote_key,
		"vote_value": vote_value,
		"modified": new Date().getTime()
	};
	
	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

function update_vote_in_votes_database( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('update_vote_in_votes_database');

	/* Setup */

	var data = {
		"vote_key": vote_key,
		"vote_value": vote_value,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

$('.vote_up').live('click', function ( event ) {

	event.preventDefault();

	/* Setup */

	var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
	var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (jQuery("#overlay_upvote_" + the_url_slug).hasClass('vote')) {

		/* UI */

		jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().removeClass('voted');

		/* Work */

		post_feedback('item_remove_upvote', the_url, Buleys.view.type, Buleys.view.slug);

		remove_vote(the_url);

	} else {
	
		/* UI */

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');
		jQuery("#overlay_upvote_" + the_url_slug).removeClass('empty_thumb_up_icon').addClass('thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().addClass('voted');
		$(this).addClass('vote');

		/* Work */

		post_feedback('item_upvote', the_url, Buleys.view.type, Buleys.view.slug);

		add_or_update_vote(the_url, 1);

	}
});


$('.vote_down').live('click', function ( event ) {

	event.preventDefault();
	
	/* Setup */

	var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
	var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (jQuery("#overlay_downvote_" + the_url_slug).hasClass('vote')) {

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');

		$('.vote').removeClass('vote');
		$(this).parent().removeClass('voted');

		post_feedback('item_remove_downvote', the_url, Buleys.view.type, Buleys.view.slug);
		
		remove_vote(the_url);

	} else {

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('empty_thumb_icon').addClass('thumb_icon');
		jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().addClass('voted');
		$(this).addClass('vote');

		post_feedback('item_downvote', the_url, Buleys.view.type, Buleys.view.slug);

		add_or_update_vote(the_url, -1);

	}

});
