
/**
 * Items.js
 **/


jQuery('.item').live( 'click', function(){ 
	jQuery(this).addClass('selected');
	jQuery(this).trigger('preview_item');
});


// TODO: Fix gratuitous args
function remove_item_from_items_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_items_database');
	
	/* Callbacks */
	
	var on_success = function ( context ) {
	};
	
	var on_error = function ( context ) {
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'items', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}

	
function get_data_object_for_item( item ) {
	
	/* Actions */

	jQuery(document).trigger('get_data_object_for_item');

	/* Setup */

	var data = {
		"link": item.link,
		"title": item.title,
		"author": item.author,
		"entities": item.entities,
		"published_date": new Date(item.published_date).getTime(),
		"index_date": new Date(item.index_date).getTime(),
		"modified": new Date().getTime()
	};

	/* Return */

	return data;

}


function add_item_to_results( item ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log("items.js > add_item_to_results()", item );
	}
	
	/* Action */

	jQuery(document).trigger('add_item_to_results');

	/* Setup */

	var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (!(jQuery("#" + id).length)) {

			jQuery("<li class='item' modified= '" + item.modified + "' index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().appendTo("#results").fadeIn('slow');
	
	}

}


function prepend_item_to_results( item ) {
		
	/* Debug */

	if( true === Buleys.debug ) {
		console.log("items.js > add_item_to_results()", item );
	}
	
	/* Action */

	jQuery(document).trigger('prepend_item_to_results');

	/* Setup */

	var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (!(jQuery("#" + id).length)) {
		
		jQuery("<li class='item' modified= '" + item.modified + "' index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().prependTo("#results").fadeIn('slow');

	}

}


function add_item_to_items_database( item ) {

	/* Action */

	jQuery(document).trigger('add_item_to_items_database');

	/* Setup */

	var data = get_data_object_for_item(item);

	/* Callbacks */

	var deleted_on_success = function ( context ) {

		/* Setup */

		var event = context.event;

		// Verify item is not deleted
		if ( typeof event.result === 'undefined' ) {

			/* Callbacks */

			var add_on_success = function ( context_2 ) {

				/* Setup */

				var event2 = context_2.event;

				// Verify that (1) there are entities
				if (item.entities.length > 1 && typeof item.entities.type === "undefined" && typeof item.entities.slug === "undefined") {

					/* Debug */
					
					if( true === Buleys.debug ) {
						console.log("items.js > add_item_to_items_database() > item.entities > ", item.entities );
					}

					// Qualify the view
					// TODO: Better description
					if ( ( Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" ) && ( typeof page === "undefined" || ( page !== "favorites" && page !== "seen" && page !== "read" && page !== "archive" && page !== "trash" ) ) ) {

						// Add the item to the results
						prepend_item_to_results(get_data_object_for_item(item));

					}
				// or (2) that there is a single entity
				} else if ( ( item.entities.length === 1 && typeof item.entities.slug !== "undefined" ) && ( Buleys.view.type === "home" || ( item.entities[0].slug.toLowerCase() === slug && item.categories[0].type.toLowerCase() === type ) ) ) {

					add_item_to_results(get_data_object_for_item(item));

				}
			};

			var add_on_error = function ( context_2 ) {
			
			};

			/* Request */

			InDB.trigger( 'InDB_do_row_add', { 'store': 'items', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

		}

	};

	deleted_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': item.link, 'on_success': deleted_on_success, 'on_error': deleted_on_error } ); 

}


function check_if_item_is_read( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_read');

	/* Callbacks */

	var on_success = function ( context ) {

		var item_request = context.event;
		if (typeof item_request.result !== 'undefined') {
			jQuery( "#" + item_url.replace( /[^a-zA-Z0-9-_]+/g, "" ) ).addClass( "read" );
		} else {
			jQuery( "#" + item_url.replace( /[^a-zA-Z0-9-_]+/g, "" ) ).addClass( "unread" );
		}
	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'status', 'key': item_url, 'on_success': on_success, 'on_error': on_error } ); 

}


function recreate_item( item_url, slug, type ) {

	/* Action */

	jQuery(document).trigger('recreate_item', { "item_url": item_url } );

	// TODO: Should be assertion
	// Verify the item curl is not blank
	if (typeof item_url !== 'undefined') {

		/* Callbacks */

		var on_success = function ( event ) {

			if (typeof event.target.result !== 'undefined') {
			
				var item = event.target.result; 
				
				add_categories_to_categories_database(item.link, item.entities );
	
				for( category in item.entities ) {
					if( item.entities.hasOwnProperty( category ) ) {
						console.log(category);
						mark_item_as_seen( item.link, category.slug, category.type );
					}
				}
			}

		};

		var on_error = function ( e ) {

		};
		
		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

	
	}

}


function get_item_raw_no_trash( item_url ) {
	
	/* Action */

	jQuery(document).trigger('get_item_raw_no_trash');

	/* Callbacks */

	var on_success = function( context ) {
		var event = context.event;
		if( !InDB.isEmpty( InDB.row.value( event ) ) ) { 
			if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
				add_item_to_results(item_request_1.result);
				check_if_item_is_favorited(item_request_1.result.link);
				check_if_item_is_read(item_request_1.result.link);
				check_if_item_is_seen(item_request_1.result.link);
			}
		}		
	};

	var on_error = function( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );	

}

function get_item_wip( item_url ) {

	/* Debug */

	if ( true === Buleys.debug ) {
		console.log('items.js > get_item()', item_url );
	}

	/* Action */

	jQuery(document).trigger('get_item');

	/* Callbacks */
	
	var on_error = function( context_1 ) {
		console.log( 'Error in get_item', context_1 );
	}
	
	var on_success = function( context_1 ) {

		/* Setup */
		var event_1 = context_1.event;
		var result = event_1.target.result;

		// Verify the item exists, wasn't deleted and isn't archived
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) {


			/* UI */
			console.log('l5', result,event_1);

			if (jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
				console.log('l6');
				add_item_to_results(result);

				check_if_item_is_favorited(item_url);

				check_if_item_is_read(item_url);

				check_if_item_is_seen(item_url);

			}
		}

	}; // End on_success

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function get_item( item_url ) {

	/* Debug */

	if ( true === Buleys.debug ) {
		console.log('items.js > get_item()', item_url );
	}

	/* Action */

	jQuery(document).trigger('get_item');

	/* Callbacks */
	
	var on_error = function( context_1 ) {
		console.log( 'Error in get_item', context_1 );
	}
	
	var on_success = function( context_1 ) {

		/* Setup */
		var event_1 = context_1.event;

		// Verify the item wasn't deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) {

			/* Request */

			// Check if the item was archived
			InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': item_url, 'on_success': function( context_2 ) {

				/* Setup */
				var event_2 = context_2.event;

				// Verify that the item wasn't archived
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 

					/* Request */

					// Get the item
					InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': function( context_3 ) {
						/* Setup */

						var event_3 = context_3.event;
						var result = event_3.target.result
						if( !result ) {
							return;
						}

						// Verify the item exists		
						if( !InDB.isEmpty( InDB.row.value( event_3 ) ) ) { 

							/* UI */
console.log('l5', result,event_3);

							if (jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
console.log('l6');
								add_item_to_results(result);

								check_if_item_is_favorited(item_url);

								check_if_item_is_read(item_url);

								check_if_item_is_seen(item_url);

							}

						} // End verify the item exists

					}, 'on_error': on_error } ); // End get the item

				} // End verify that the item wasn't archived

			}, 'on_error': on_error } ); // End check if the item was archived

		} // End verify the item wasn't deleted

	}; // End on_success


	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function get_item_raw( item_url ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log('get_item_raw() > ',item_url);
	}

	/* Action */

	jQuery(document).trigger('get_item_raw');

	/* Callbacks */

	var on_error = function() {
		console.log( 'Error in get_item_raw', item_url );
	}

	/* Request */

	// Check if the item was deleted
	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': item_url, 'on_success': function( context ) {
		
		/* Setup */

		var event_1 = context.event;
		console.log('get_item_raw success', event_1, InDB.row.value( event_1 ) );
		// Verify the item wasn't deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 

			/* Request */

			InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': function( context ) {

				/* Setup */

				var event_2 = context.event;
				var value =  InDB.row.value(event_2);
				console.log('about to do UI');
				// Verify the item wasn't archived
				if( !InDB.isEmpty( value ) ) { 

					console.log('doing UI now', value );
					/* UI */

					if (jQuery("#" + value.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						add_item_to_results( value );
						check_if_item_is_favorited( value.link );
						check_if_item_is_read( value.link );
						check_if_item_is_seen( value.link );
					}

				} //End verify the item wasn't archived	

			}, 'on_error': on_error } ); // End check if the item was deleted

		} // End verify the item wasn't deleted

	}, 'on_error': on_error } ); // End check if the item was deleted

}


function get_items( type_filter, slug_filter, begin_timeframe, end_timeframe ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log('items.js > get_items( type_filter, slug_filter, begin_timeframe, end_timeframe )', type_filter, slug_filter, begin_timeframe, end_timeframe );
	}

	/* Actions */

	jQuery(document).trigger('get_items');

	/* Defaults*/

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if ( typeof begin_timeframe == "undefined" || begin_timeframe == null ) {
		begin_date = 0;
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if ( typeof end_timeframe == "undefined" || end_timeframe == null ) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt( end_timeframe );
	}

	/* Callbacks */

	var cursor_on_success = function ( context ) {

		/* Setup */

		var event1 = context.event;
		var result = event1.target.result;
		var item;
	
		if( "undefined" !== typeof result && null !== result ) {
			item = result.value;
		}

		//console.log( 'items.js > get_items() > item.link', context, result, item.link );

		/* Work */

		// Verify there's an item to add
		if( !!item ) {
			
			/* Debug */
			if( true === Buleys.debug ) {
				console.log( 'items.js > get_items() > item.link', item.link );
			}

			// Get the item
			get_item( item.link );

		}
	};

	var cursor_on_error = function ( context ) {
		console.log('Error in get_items()', context );
	};
	
	var cursor_on_abort = function( context ) {
		console.log('Cursor aborted in get_items()', context );
	}

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error, 'on_abort': cursor_on_abort } );	

}


function index_items_by_field( type_filter, slug_filter, field ) {
	
	/* Action */

	jQuery( document ).trigger('index_items_by_field');

	/* Defaults */
	
	if ( typeof make_inverse == "undefined" ) {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if( typeof Buleys.index_view == "undefined" ) {
		Buleys.index_view = {};
	}

	if( typeof Buleys.index_view[field] === "undefined" ) {
		Buleys.index_view[field] = {};
	}

	if ( typeof begin_timeframe == "undefined" || begin_timeframe == null ) {
		begin_date = 0;
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if ( typeof end_timeframe == "undefined" || end_timeframe == null ) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt( end_timeframe );
	}

	if( undefined == typeof field ) {
		field = "modified";
	}

	/* Callbacks */
	
	var cursor_on_success = function ( context ) {

		/* Setup */
		
		var event_1 = context.event;
	
		var result = event_1.target.result;
		var item = event_1.target.result.value;

		//TODO: What is this?
		if( item ) {
			index_view[ field ][ item[field] ] = item.link;	
		}

	};

	var cursor_on_error = function( context ) {

	}

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'cateogries', 'index': 'slug', 'keyRange': InDB.transaction.only( slug_filter ), 'on_success': oncusor_on_success, 'on_error': cursor_on_error } );
	
}


function get_item_for_console( item_url ) {

	/* Action */

	jQuery(document).trigger('get_item_for_console');

	/* Callbacks */

	item_on_success = function ( context ) {
		var item_request = context.event;
		if (typeof item_request.result !== 'undefined' && typeof item_request.result.id === 'string') {
			var html_snippit = "<div id='console_" + item_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
			html_snippit = html_snippit + "<h3><a href='" + item_request.result.id + "'>" + item_request.result.title + "</a></h3>";
			html_snippit = html_snippit + "<p>" + item_request.result.author + "</p>";
			html_snippit = html_snippit + "</div>";
			send_to_console(html_snippit);
		}
	};

	item_on_error = function ( e ) {
		console.log('Error gettng item', e );
	};
	
	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'items', 'key': item_url, 'on_success': item_on_success, 'on_error': item_on_error } );

}

function fire_off_request( ) {

	/* Action */

	jQuery(document).trigger('fire_off_request');

	/* Setup */

	var data_to_send;

	data_to_send = {
		"method": "get_users_personal_collection"
	};

	var the_url;

	if (typeof Buleys.view.type === "undefined" || Buleys.view.type === "") {
		the_url = "http://api.buleys.com/feedback/";
	} else {
		the_url = "http://cdn.buleys.com/js/collections/" + Buleys.view.type + "/" + Buleys.view.slug + ".js";
	}

	/* Work */

	// Call the remote feed
	$.ajax( {
		url: the_url,
		dataType: 'jsonp',
		/*data: data_to_send,*/
		jsonpCallback: 'load_collection',
		error: function (	) {

			/* UI */

			$("#index").html("<li class='item'>No results.</li>");

		},
		success: function ( data ) {

			/* Setup */

			Buleys.view.slug = data.info.key;
			Buleys.view.type = data.info.type;

			if( "undefined" !== typeof data.info && "undefined" === typeof data.info.topic_key ) {
				data.info.topic_key = data.info.type + "_" + data.info.key;
			}

			/* Work */

			//populate_and_maybe_setup_indexeddbs(data.items);

			//get_data_for_items(data.items);

			add_items(data.items, data.info.type, data.info.key);

			load_page_title_info(data.info);

			add_or_update_topic( data.info);

		}

	} );
}


/* Method for batch processing of items for type and topic */
function get_data_for_items( items ) {

	/* Action */

	jQuery(document).trigger('get_data_for_items');

	/* Work */

	// Loop through each item
	$.each(items, function ( i, item ) {


		/* Debug */

		if( true === Buleys.debug ) {
			console.log("getting data for item", item);
		}

		/* Work */

		// Calls get_item() using the item.link
		get_item(item.link);

	} );

}


function add_items( items, type_to_get, company_to_get ) {

	/* Debug */

	if( true === Buleys.debug ) {
		console.log('items.js > add_items', items, type_to_get, company_to_get );
	}

	/* Action */

	jQuery(document).trigger('add_items');

	/* Work */

	// Loop through each item to database
	$.each( items, function ( i, item ) {

		if( true === Buleys.debug ) {
			//console.log('items.js > add_items > each', item );
		}

		add_item_if_new( item, type_to_get, company_to_get );

	});

}


function populate_and_maybe_setup_indexeddbs( items ) {

	/* Action */

	jQuery(document).trigger('populate_and_maybe_setup_indexeddbs');

	// Loop through each item to database
	jQuery.each( items, function ( i, item ) {
		add_item_if_doesnt_exist( item );
	});

}

function add_item_if_new( item, type_to_get, company_to_get ) {

	/* Debug */
	
	if ( !!Buleys.debug ) {
		console.log( 'add_item_if_new()', item, type_to_get, company_to_get );
	}
	add_item_to_items_database(item);
	return;

	/* Action */

	jQuery(document).trigger('add_item_if_new');

	/* Assertions */

	if( !item.link ) {
		return;
	}

	/* Callbacks */
	
	var on_error = function() {
		console.log( 'Error in get_item', item.link );
	}	

	var on_abort = function() {
		console.log( 'Abort in get_item', item.link );
	}	

	/* Request */

	// Check if the item was deleted
	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': item.link, 'on_success': function( context_1 ) {

		/* Setup */

		var event_1 = context_1.event;
		
		// Verify item was not deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 

			/* Request */

			// Check if the item was archived
			InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': item.link, 'on_success': function( context_2 ) {

				/* Setup */

				var event_2 = context_2.event;
				
				// Verify the item wasn't archived
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 

					/* UI */

					add_item_to_items_database(item);

					send_to_console("<p>Added: <a href='" + item.link + "'>" + item.title + "</a></p>");

					add_categories_to_categories_database(item.link, item.entities );

					/* Setup */

					var item_key = type_to_get.toLowerCase() + "_" + company_to_get.toLowerCase();

					/* Work */

					// Empty the current view's new item inbox
					if (typeof Buleys.queues.new_items[item_key] === "undefined") {

						Buleys.queues.new_items[item_key] = 0;

					}

					// Queue up another crawl
					Buleys.queues.new_items[item_key] = Buleys.queues.new_items[item_key] + 1;

				} // End verify that the item was not archivedc

			}, 'on_error': on_error } ); // End check if the item was archived

		} // End verify that the item was not deleted

	}, 'on_error': on_error } ); // End check if the item was deleted

}

