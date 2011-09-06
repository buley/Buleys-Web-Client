function twitter_request( type, data, on_success, on_error ) {

	/* Actions */

	jQuery(document).trigger('oauth_preflight');

	/* Defaults */

	if( 'function' !== typeof on_success ) {
			on_success = function( context ) {
				console.log('Twitter request completed successfully', context );
			}
	}

	if( 'function' !== typeof on_error ) {
			on_error = function( context ) {
				console.log('Twitter request did not complete successfully', context );
			}
	}

	/* Setup */

	var data_to_send = {
			"method": "twitter_" + type,
			"oauth_access_token": get_local_storage( 'twitter_oauth_access_token' ),
			"oauth_access_token_secret": get_local_storage( 'twitter_oauth_access_token_secret' )
	};

	if ( null !== data && "undefined" !== typeof data ) {
		for( item in data ) {
			if ( data.hasOwnProperty( item ) ) {
				data_to_send[ item ] = data[ item ];
			}
		}
	}

	/* Request */

	jQuery.ajax( {
			'type': 'POST',
			'url': "http://api.buleys.com/twitter",
			'data': data_to_send,
			'success': function ( data ) {
					on_success( data );
			},
			'error': function( data ) {
					on_error( data );
			},
			'dataType': 'json'
	} );

}




function add_tweets( items ) {

	/* Debug */

	if( true === Buleys.debug ) {
		console.log('items.js > add_tweets', items );
	}

	/* Action */

	jQuery(document).trigger('add_tweets');

	/* Work */

	// Loop through each item to database
	$.each( items, function ( i, item ) {

		if( true === Buleys.debug ) {
			//console.log('items.js > add_items > each', item );
		}

		add_tweet_to_items_database( item );

	});

}

function get_data_object_for_tweet( item ) {

        /* Actions */

        jQuery(document).trigger('get_data_object_for_item');

        /* Setup */

        var data = {
                "link": "http://twitter.com/#!/" + item.user.name + "/status/" + item.id_str,
                "title": item.text,
                "author_id": item.id_str,
                "author": item.user.name,
                "published_date": new Date(item.created_at).getTime(),
                "modified": new Date().getTime()
        };

        /* Return */

        return data;

}

function add_tweet_to_items_database( item ) {

	/* Action */

	jQuery(document).trigger('add_item_to_items_database');

	/* Setup */

	var data = get_data_object_for_tweet(item);

	/* Callbacks */

	var add_on_success = function ( context_2 ) {

		/* Setup */

		var event2 = context_2.event;


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

	};

	var add_on_error = function ( context_2 ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'items', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}



