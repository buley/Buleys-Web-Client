
/**
 * Favorite.js 
 **/

function add_favorite_to_results( item ) {

	/* Action */

	jQuery(document).trigger('add_favorite_to_results');

	/* UI */

	var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");

	if (!(jQuery("#" + id).length)) {

		jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><div class='magnify_icon'></div></li>").hide().prependTo("#results").fadeIn('slow');

	}

}


function get_favorites( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	/* Action */
	
	jQuery(document).trigger( 'get_favorites' );

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined") {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined") {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}
	
	make_inverse = ( make_inverse ) ? true : false;

	/* Callbacks */
	
	var categories_on_success = function ( context ) {

		var result = context.event.target.result;
		if( InDB.isEmpty( result ) ) {
			return;
		}
		var item = result.value;

		var favorites_on_success = function ( context_2 ) {

			var event2 = context_2.event;

			if (typeof event2.target.result !== 'undefined') {

				console.log('FAVORITE!');

				var item_on_success = function ( event3 ) {

					if ( ( make_inverse !== true && typeof event2.target.result !== 'undefined' && typeof event2.target.result !== 'undefined' ) || ( true === make_inverse && typeof event2.target.result !== 'undefined' && typeof event2.target.result !== 'undefined' ) ) {
						console.log('favorite found, getting raw item');
						get_item_raw(item.link);
					}

				};
				
				var item_on_error = function ( event3 ) {

				}
				
				/* Request */

				InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item.link, 'on_success': item_on_success, 'on_error': item_on_error } );


			}
		};

		var favorites_on_error = function ( context ) {
			console.log( "error in get_favorites()", context );
		}

		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': item.link, 'on_success': favorites_on_success, 'on_error': favorites_on_error } );

	};

	var categories_on_error = function ( context ) {
		console.log("Error in get favorites", context);
	};
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': categories_on_success, 'on_error': categories_on_error } );

}


function get_favorite( favorite_slug ) {

	/* Action */

	jQuery(document).trigger('get_favorite');

	if (typeof favorite_slug !== 'undefined') {

		/* Callbacks */

		var favorite_on_success = function ( context_1 ) {
			var event_1 = context_1.event;
			if (typeof event_1.result != 'undefined') {
				
				/* Callbacks */

				var archive_on_success = function ( context_2 ) {
					var event_2 = context_2.event;
					if (typeof event_2.result === 'undefined') {

						/* UI */

						if (jQuery("#" + event_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
							add_favorite_to_results(event_1.result);
							check_if_favorite_is_favorited(event_1.result.link);
							check_if_favorite_is_read(event_1.result.link);
							check_if_favorite_is_seen(event_1.result.link);

						}

					}
				};

				var archive_on_error = function ( context_2 ) {
					
					/* Setup */

					var event_2 = context_2.event;

					/* UI */

					if ( jQuery("#" + event_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "") ).length <= 0 ) {
						add_favorite_to_results(event_1.result);
						check_if_favorite_is_favorited(event_1.result.link);
						check_if_favorite_is_read(event_1.result.link);
						check_if_favorite_is_seen(event_1.result.link);
					}

				};

				/* Request */

				InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': event_1.result.link, 'on_success': archive_on_success, 'on_error': archive_on_error } );

			}
		};
		var favorite_on_error = function ( context ) {

		};

		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': favorite_slug, 'on_success': favorite_on_success, 'on_error': favorite_on_error  } );

	}
}


function get_favorite_for_console( favorite_slug ) {
	
	/* Action */

	jQuery(document).trigger('get_favorite_for_console');

	/* Callbacks */

	var favorite_on_success = function ( context ) {
	
		/* Setup */

		var result = context.event.result;

		if (typeof result != 'undefined' && typeof result.id == 'string') {

			/* UI */
			var html_snippit = "<div id='console_" + favorite_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
			html_snippit = html_snippit + "<h3><a href='" + favorite_request.result.id + "'>" + favorite_request.result.title + "</a></h3>";
			html_snippit = html_snippit + "<p>" + favorite_request.result.author + "</p>";
			html_snippit = html_snippit + "</div>";

			send_to_console(html_snippit);

		}

	};

	favorite_on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': favorite_slug, 'on_success': favorite_on_success, 'on_error': favorite_on_error  } );

}


function get_favorite_for_overlay( favorited_url ) {

	/* Action */

	jQuery(document).trigger('get_favorite_for_overlay');

	/* Callbacks */

	var favorite_on_success = function ( context ) {

		/* Setup */

		var favorite_request = context.event;

		if (typeof favorite_request.result != 'undefined' && typeof favorite_request.result.link == 'string') {

			/* UI */

			var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><div href="#" class="close_sidebar_link close_icon" id="' + favorite_slug + '"></div></div>' + "<h3 id='overlay_" + favorite_slug.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + favorite_request.result.link + "'>" + favorite_request.result.title + "</div></h3></div><div id='overlay_left'></div>";
			send_to_overlay(html_snippit);
		}
	};

	var favorite_on_error = function ( context ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': favorited_url, 'on_success': favorite_on_success, 'on_error': favorite_on_error  } );

}


function add_item_as_favorite( item_url ) {

	/* Action */

	jQuery(document).trigger('add_item_as_favorite');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var favorites_on_success = function ( context ) {
		console.log('add_item_as_favorite success', context );	
	};

	var favorites_on_error = function ( context ) {
		console.log('add_item_as_favorite failed', context );	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'favorites', 'data': data, 'on_success': favorites_on_success, 'on_error': favorites_on_error  } );

}


function check_if_item_is_favorited_for_overlay( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_favorited_for_overlay');

	/* Callbacks */

	var favorite_on_success = function ( context ) {

		var item_request = context.event;

		if (typeof item_request.result != 'undefined') {
			jQuery("#overlay_left").prepend("<div class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + item_url + "' class='unfav_link star_icon'></div></div>");		
			jQuery("#overlay_left").addClass('favorited');
		} else {
			jQuery("#overlay_left").prepend("<div class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + item_url + "' class='fav_link empty_star_icon'></div></div>");
			jQuery("#overlay_left").addClass('unfavorited');
		}

	};

	var favorite_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': item_url, 'on_success': favorite_on_success, 'on_error': favorite_on_error } );

}


function check_if_item_is_favorited( item_url ) {
	
	/* Action */

	jQuery(document).trigger('check_if_item_is_favorited');

	/* Callbacks */

	var favorite_on_success = function ( context ) {
		var item_request = context.event;
		console.log("CHECKING",item_request);
		if (typeof item_request.target.result != 'undefined') {

			/* UI */

			if( Buleys.settings.show_favorite_status !== false) {
				jQuery( "#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><div href='" + item_url + "' class='unfav_link star_icon'></div></span>");
			}

			jQuery( "#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('favorited');

		} else {

			/* UI */

			if(Buleys.settings.show_favorite_status !== false) {
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><div href='" + item_url + "' class='fav_link empty_star_icon'></div></span>");
			}

			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unfavorited');

		}
	};

	var favorite_on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'favorites', 'key': item_url, 'on_success': favorite_on_success, 'on_error': favorite_on_error } );

}

/* adds item to fav db
 */
function add_item_to_favorites_database( item_url, item_slug, item_type ) {

	/* Debug */

	if ( !!Buleys.debug ) {
		console.log( 'add_item_to_favorite_database()', item_url, item_slug, item_type );
	}

	/* Action */	

	jQuery(document).trigger('add_item_to_favorites_database');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var add_on_success = function ( context ) {
	
	};

	var add_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'favorites', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}


function remove_item_from_favorites_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_favorites_database');

	/* Callbacks */

	var on_success = function ( context ) {
		console.log('Item removed from favorites database', context );	
	};

	var on_error = function (  ) {
		console.log('Item was not removed from favorites database', context );	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'favorites', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


jQuery('.unfav_link').live('click', function ( event ) {
	
	/* Setup */

	event.preventDefault();

	/* Debug */
	
	if( Buleys.debug ) {
		console.log( jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('.unfav_link') );
	}

	/* UI */

	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
	jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
	jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');

	if(typeof Buleys.view.page !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
		jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
	}
	
	remove_item_from_favorites_database(jQuery(this).attr('href'), Buleys.view.slug, Buleys.view.type);

	post_feedback('unstar', jQuery(this).attr('href'), Buleys.view.slug, Buleys.view.type);

	send_to_console("<p>item removed from favorites</p>");

	setTimeout('fade_console_message()', 1000);

});

jQuery(document).bind('favorite', function ( event ) {

	event.preventDefault();

	if (!is_in_cursor_mode()) {

		$.each( jQuery( '.selected' ), function ( i, item_to_mark ) {

			/* UI */

			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
			jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
			jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');

			add_item_to_favorites_database(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

			post_feedback('star', jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

			send_to_console("<p>item favorited</p>");

			setTimeout('fade_console_message()', 1000);

		} );

	} else {

		/* UI */

		jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
		jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
		jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
		jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
		jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');

		add_item_to_favorites_database(jQuery('.cursor a').attr('href'), Buleys.view.slug, Buleys.view.type);

		post_feedback('star', jQuery('.cursor a').attr('href'), Buleys.view.slug, Buleys.view.type);

		send_to_console("<p>item favorited</p>");

		setTimeout('fade_console_message()', 1000);

	}

});

jQuery(document).bind('unfavorite', function ( event ) {

	event.preventDefault();

	if (!is_in_cursor_mode()) {

		/* UI */

		$.each( jQuery( '.selected' ), function ( i, item_to_mark ) {

			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
			jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
			jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
			jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
			if(typeof Buleys.view.type !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
				jQuery("#" +  jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
			}
			remove_item_from_favorites_database(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
			post_feedback('unstar', jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
			send_to_console("<p>item removed from favorites</p>");
			setTimeout('fade_console_message()', 1000);
		} );

	} else {

		/* UI */

		jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
		jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
		jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
		jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
		jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');

		if(typeof Buleys.view.type !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
			jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
		}

		remove_item_from_favorites_database(jQuery('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);

		post_feedback('unstar', jQuery('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);

		send_to_console("<p>item removed from favorites</p>");

		setTimeout('fade_console_message()', 1000);

	}

});


jQuery('.fav_link').live('click', function ( event ) {

	event.preventDefault();

	/* UI */

	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('fav_link').addClass('unfav_link');;
	jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
	jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');

	add_item_to_favorites_database(jQuery(this).attr('href'), Buleys.view.slug, Buleys.view.type);

	post_feedback('star', jQuery(this).attr('href'), Buleys.view.slug, Buleys.view.type);

	send_to_console("<p>item favorited</p>");

	setTimeout('fade_console_message()', 1000);

} );

jQuery( document ).bind( 'select_favorites', function ( event ) {

	event.preventDefault();

	$.each( jQuery( '.favorited' ), function ( i, item_to_mark ) {

		if (jQuery(item_to_mark).hasClass('selected')) {

		} else {

			jQuery(item_to_mark).addClass('selected');

			jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));

		}

	} );

} );

jQuery(document).bind('deselect_favorites', function ( event ) {

	/* Setup */

	event.preventDefault();

	$.each( jQuery( '.favorited' ), function ( i, item_to_mark ) {

		jQuery(item_to_mark).removeClass('selected');
		jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

	} );

} );
