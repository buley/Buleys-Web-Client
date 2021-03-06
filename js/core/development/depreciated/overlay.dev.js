function send_text_to_overlay( text_to_send ) {
	jQuery(document).trigger('send_text_to_overlay');

    jQuery("#overlay").html('').append(text_to_send);
}

function send_to_overlay( text ) {
	jQuery(document).trigger('send_to_overlay');
	console.log('send_to_overlay()', text );
    send_text_to_overlay(text);
    jQuery("#overlay").stop(true).animate({
        opacity: 1
    }, 500);
}
function hide_overlay(  ) {
	jQuery(document).trigger('hide_overlay');

    jQuery("#overlay").stop(true).animate({
        opacity: 0
    }, 500);
    jQuery("#overlay").html('').removeClass();
}
	
function load_item_to_overlay( item_key ) {
	jQuery(document).trigger('load_item_to_overlay');

	console.log('load_item_to_overlay()', item_key );
    get_item_for_overlay(item_key);
    check_if_item_is_favorited_for_overlay(item_key);
    check_item_vote_status_for_overlay(item_key);
    get_item_categories_for_overlay(item_key);
}

function get_item_for_overlay( item_url ) {

	jQuery(document).trigger('get_item_for_overlay');

	console.log('get_item_for_overlay()', item_url );
	var on_success = function ( context ) {
	var item_request = context.event;
	var result = item_request.target.result;
        if (typeof result !== 'undefined' && typeof result.link === 'string') {
            var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><div class="close_sidebar_link cross_icon" id="' + item_url + '"></div></div>' + "<div id='overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + result.link + "' class='overlay_headline'>" + result.title + "</a></div></div><div id='overlay_left'></div>";
            send_to_overlay(html_snippit);
            /*
            <div id='overlay_controls'><a href='" + item_url + "' class='favorite_item'>Favorite</a>&nbsp;<a href='" + item_url + "' class='unfavorite_item'>Unfavorite</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_read'>Mark as read</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unread'>Mark as unread</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_seen'>Mark as seen</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + item_url + "' class='archive_item'>Archive</a>&nbsp;<a href='" + item_url + "' class='delete_item'>Delete</a>&nbsp;<a href='" + item_url + "' class='unarchive_item'>Unarchive</a>&nbsp;<a href='" + item_url + "' class='vote_item_up'>Vote up</a>&nbsp;<a href='" + item_url + "' class='vote_item_down'>Vote down</a>&nbsp;<a href='" + item_url + "' class='close_item_preview'>Close preview</a></div>
            */
        }
    };
    var on_error = function ( context ) {
	console.log('Error sending item to overlay', item_url );
    };
    
	InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );
}
