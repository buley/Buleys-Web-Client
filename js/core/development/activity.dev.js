
/**
 * Activity.js
 **/


/* Setup */

Buleys.activity = Buleys.activity || {};
Buleys.activities = Buleys.activities || {};


/* UI */

//adds a click watcher to activity items
jQuery('.activity').live( 'click', function(){ 
	jQuery(this).addClass('selected');
	jQuery(this).trigger('preview_activity');
});


/* Utility functions */

Buleys.activity.shorthand = {
	'archived': 'ar',
	'actor': 'a',
	'actor_attachments': 'a_at',
	'actor_content': 'a_c',
	'actor_display_name': 'a_dn',
	'actor_downstream_duplicates': 'a_dd',
	'actor_id': 'a_i',
	'actor_image_height': 'a_ih',
	'actor_image_url': 'a_iu',
	'actor_image_width': 'a_iw',
	'actor_object_type': 'a_ot',
	'actor_published': 'a_pu',
	'actor_summary': 'a_s',
	'actor_updated': 'a_up',
	'actor_upstream_duplicates': 'a_ud',
	'actor_url': 'a_u',
	'content': 'c',
	'favorited': 'f',
	'icon': 'ic',
	'icon_height': 'ic_h',
	'icon_width': 'ic_w',
	'icon_url': 'ic_u',
	'id': 'i',
	'object': 'o',
	'object_attachments': 'o_at',
	'object_content': 'o_c',
	'object_display_name': 'o_dn',
	'object_downstream_duplicates': 'o_dd',
	'object_id': 'o_i',
	'object_image_height': 'o_ih',
	'object_image_url': 'o_iu',
	'object_image_width': 'o_iw',
	'object_object_type': 'o_ot',
	'object_published': 'o_pu',
	'object_summary': 'o_s',
	'object_updated': 'o_up',
	'object_upstream_duplicates': 'o_ud',
	'object_url': 'o_u',
	'provider': 'p',
	'provider_attachments': 'p_at',
	'provider_content': 'p_c',
	'provider_display_name': 'p_dn',
	'provider_downstream_duplicates': 'p_dd',
	'provider_id': 'p_i',
	'provider_image_height': 'p_ih',
	'provider_image_url': 'p_iu',
	'provider_image_width': 'p_iw',
	'provider_object_type': 'p_ot',
	'provider_published': 'p_pu',
	'provider_score': 'p_sc',
	'provider_summary': 'p_s',
	'provider_updated': 'p_up',
	'provider_upstream_duplicates': 'p_ud',
	'provider_url': 'p_u',
	'published': 'pu',
	'seen': 's',
	'target': 't',
	'target_attachments': 't_at',
	'target_content': 't_c',
	'target_display_name': 't_dn',
	'target_downstream_duplicates': 't_dd',
	'target_id': 't_i',
	'target_image_height': 't_ih',
	'target_image_url': 't_iu',
	'target_image_width': 't_iw',
	'target_object_type': 't_ot',
	'target_published': 't_pu',
	'target_score': 't_sc',
	'target_summary': 't_s',
	'target_updated': 't_up',
	'target_upstream_duplicates': 't_ud',
	'target_url': 't_u',
	'trashed': 'tr',
	'updated': 'up',
	'url': 'u',
	'verb': 'v'
};

Buleys.activity.shorthand = function ( key ) {
	if( 'undefined' !== typeof Buleys.activity.shorthand[ key ] ) {
		return Buleys.shorthand[ key ];
	} else {
		false;
	}
}

Buleys.activity.install = function ( ) {

        var activities = {
                'activities': { 'key': Buleys.shorthand[ 'id' ], 'incrementing_key': false, 'unique': true }
        }

        var activities_idxs = {
                'activities': {
                        Buleys.shorthand( 'actor_id' ).replace( '_', '.' ): { 'actor_id': true },
                        Buleys.shorthand( 'object_id' ).replace( '_', '.' ): { 'object_id': true },
                        Buleys.shorthand( 'object_url' ).replace( '_', '.' ): { 'object_url': false },
                        Buleys.shorthand( 'object_published' ).replace( '_', '.' ): { 'object_published': false }
                        Buleys.shorthand( 'verb' ): { 'verb': true },
                        Buleys.shorthand( 'seen' ): { 'seen': true },
                        Buleys.shorthand( 'clicked' ): { 'clicked': true },
                        Buleys.shorthand( 'trashed' ): { 'trashed': true },
                        Buleys.shorthand( 'archived' ): { 'archived': true },
                        Buleys.shorthand( 'favorited' ): { 'favorited': true }
                }
        };

        console.log( activities, activities_idxs );

        InDB.trigger( 'InDB_do_stores_create', { 'stores': activities, 'on_success': function( context ) {
                InDB.trigger( 'InDB_do_indexes_create', { 'indexes': activities_idxs, 'on_complete': function( context2 ) {
                        console.log( 'Activities store loaded', context2 );
                } } );
        } } );

}


/* Single activity methods */

//adds a new activity to the database (meaning it must not yet exist)
//takes an activity, requires an activity_id attribute
//on_success callback returns activity id as only argument
//on_error returns error
Buleys.activity.add = function ( activity, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_add', { 'activity': activity } );

	/* Shorthand Encoding */

	activity = Buleys.activities.shorthand_encode( activity );

	/* Callbacks */

	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {
			on_success( context );
		}
	};

	var on_error_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_error ) {
			on_error( context );
		}
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'activities', 'data': data, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );

};


//removes an existing activity from database
//on_error returns error, on_success returns nothing
Buleys.activity.remove = function ( activity_id, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_remove', { 'activity_id': activity_id } );
	
	/* Callbacks */

	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {
			on_success( context );
		}
	};

	var on_error_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_error ) {
			on_error( context );
		}
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'activities', 'key': activity_id, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );

};


//updates an existing activity or adds a new one
//given an activity_id and data
//data argument can be individual attributes or whole activities
//activity_ids cannot be modified
//on_success returns nothing
//on_error returns error
Buleys.activity.update = function ( activity_id, data, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_update', { 'activity_id': activity_id, 'data': data } );
	
	/* Callbacks */

	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {
			on_success();
		}
		
	};

	var on_error_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_error ) {
			on_error( context.error );
		}
	};

	/* Request */

	// Success callback
	var check_success = function( context ) {

		// Get row value
		var result = InDB.row.value( context.event );

		// If item exists
		if( !InDB.isEmpty( result ) ) { 	

			/* Shorthand Encoding */

			result = Buleys.activity.shorthand_encode( result );
			data = Buleys.activity.shorthand_encode( data );

			// Update any attributes
			for( var x in data ) {
				if( Buleys.shorthand[ 'id' ] !== x ) {
					result[ x ] = data[ x ];
				}
			}

			//Put with on_success_wrapper() and on_error_wrapper()
			InDB.trigger( 'InDB_do_row_put', { 'store': 'activities', 'data': data, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );

		} // End if item exists

	};

	// Get error callback
	var check_error = function( context ) {

		// Call other callbacks
		on_error_wrapper( context.error );

	};

	// InDB row get

	InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_id, 'on_success': check_success, 'on_error': check_error } );

};


//replaces an existing activity or adds a new one
//given an activity_id and data
//data argument cannot replace individual attributes, for that use Buleys.activity.update
//data must be a complete activity object, including any required attributes such as id
//activity_ids cannot be modified
//on_success returns nothing
//on_error returns error
Buleys.activity.replace = function ( activity_id, data, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_replace', { 'activity_id': activity_id, 'data': data } );
	
	/* Callbacks */

	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {
			on_success();
		}		
	};

	var on_error_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_error ) {
			on_error( context.error );
		}
	};

	/* Request */

	// Success callback
	var check_success = function( context ) {

		// Get row value
		var result = InDB.row.value( context.event );

		/* Shorthand Encoding */

		result = Buleys.activity.shorthand_encode( result );

		// If item exists
		if( !InDB.isEmpty( result ) ) { 	

			//Put with on_success_wrapper() and on_error_wrapper()
			InDB.trigger( 'InDB_do_row_put', { 'store': 'activities', 'data': data, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );

		} // End if item exists

	};

	// Error callback
	var check_error = function( context ) {

		// Error callbacks
		on_error_wrapper( context.error );

	};

	// InDB row get

	InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_id, 'on_success': check_success, 'on_error': check_error } );

};


//gets an existing activity given an activity_id
//on_success returns the row
Buleys.activity.get = function ( activity_id, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_get', { 'activity_id': activity_id } );
	
	/* Callbacks */

	// Out callback
	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {

			var result = InDB.row.value( context.event );
			
			/* Shorthand Decoding */

			result = Buleys.activity.shorthand_decode( result );

			// Their callback
			on_success( result );

		}
	};

	var on_error_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_error ) {
			on_error( context );
		}
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_id, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );


};


/* Published */

//publish an activity given its activity_id
//this makes an activity visibile
Buleys.activity.publish = function( ) {

}; //makes item visible


//unpublish an activity given its activity_id
//this removes an activity from visibility
Buleys.activity.unpublish = function( ) {

};


//verify trash status of an activity given an activity_id
//this determines whether an activity is visible
//returns true if item is archived, else returns false
Buleys.activity.is_published = function( ) {

};



/* Seen */


//mark an activity as seen given its activity_id
Buleys.activity.see = function( activity_id ) {

};


//mark an activity as unseen given its activity_id
Buleys.activity.unsee = function( activity_id ) {

};


//verify seen status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_seen = function( activity_id ) {

};


/* Clicks */


//mark an activity as clicked given its activity_id
Buleys.activity.click = function( activity_id ) {

};


//mark an activity as clicked given its activity_id
Buleys.activity.unclick = function( activity_id ) {

};


//verify click status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_clicked = function( ) {

};


/* Trash */


//trash an activity given its activity_id
Buleys.activity.trash = function( activity_id ) {

};


//untrash an activity given its activity_id
Buleys.activity.untrash = function( activity_id ) {

};


//verify trash status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_trashed = function( activity_id ) {

};


/* Archive */

//archive an activity given its activity_id
Buleys.activity.archive = function( activity_id ) {

};

//unarchive an activity given its activity_id
Buleys.activity.unarchive = function( activity_id ) {

};

//verify archive status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_archived = function( activity_id ) {

};


/* Favorite */

//favorite an activity given its activity_id
Buleys.activity.favorite = function( activity_id ) {

};

//unfavorite an activity given its activity_id
Buleys.activity.unfavorite = function( activity_id ) {

};

//determine favorite status of activity
//returns true if activity is favorited, else false
Buleys.activity.is_favorited = function( activity_id ) {

};




/* Multi-activity methods */


//gets all activities based on an existing index and value
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getAll = function( filter, on_success, on_error, on_complete, value, left_bound, right_bound, includes_left_bound, includes_right_bound, inverse ) {

	/* Actions */

	jQuery(document).trigger('Buleys_activities_getAll');

	/* Defaults */

	if ( typeof inverse === "undefined" ) {
		inverse = false;
	}

	var key_range = InDB.range.get( value, left_bound, right_bound, includes_left_bound, includes_right_bound );
	
	/* Callbacks */

	var cursor_on_success = function ( context ) {

		/* Setup */

		var activity = InDB.row.value( context.event );

		// Fire on_success() callback if items
		// Else call on_complete() if cursor is exhausted
		if( !!activity ) {
			
			var matches_filter = true;
			for( x in filter ) {
				if ( filter[ x ] !== activity[ Buleys.reverse_shorthand( x ) ] ) {
					matches_filter = false;
				}
			} 

			if( true === matches_filter ) {
				//Fire on_callback()
				on_success( activity );
			}

		} else {

			// Fire on_complete()
			on_complete();

		}

	};

	var cursor_on_error = function ( context ) {
		on_error( context.error );
	};
	
	var cursor_on_abort = function( context ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'activities', 'index': index, 'keyRange': key_range, 'on_success': cursor_on_success, 'on_error': cursor_on_error, 'on_abort': cursor_on_abort } );	

};


/* Helpers */


/* Archive */


//gets all archived activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getArchived = function ( on_success, on_error, on_complete ) {


};


//gets all unarchived activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getArchived = function ( on_success, on_error, on_complete ) {

};


/* Seen */


//gets all seen activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getSeen = function ( on_success, on_erorr, on_complete ) {

}


//gets all unseen activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnseen = function ( on_success, on_error, on_complete ) {

}


/* Trash */


//gets all trashed activities
//depends on activities.getAll
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getTrashed = function ( on_success, on_error, on_complete ) {

};


//gets all untrashed activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUntrashed = function ( on_success, on_error, on_complete ) {

};


/* Favorites */


//gets all favorited activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getFavorited = function ( on_success, on_error, on_complete ) {

};


//gets all untrashed activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnfavorited = function ( on_success, on_error, on_complete ) {

};

/* Published */


//gets all published activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getPublished = function ( on_success, on_error, on_complete ) {


};


//gets all unpublished activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnpublished = function ( on_success, on_error, on_complete ) {

};


/* Utilities */


//helper function for adding activities in batch
//takes an array of objects
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.add = function( activities, on_success, on_error, on_complete ) {

};


//helper function for removing activities in batch
//takes an Array of activity_id Strings
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.remove  = function( activities, on_success, on_error, on_complete ) {
	for( var i; i <= activities.length; i++ ) {
		Buleys.activity.remove( activities[ i ], on_success, on_error );
	}
};


//helper function for updating activites in bulk
//takes an Array of activity objects
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.update = function( activities, on_success, on_error, on_complete ) {

};



Buleys.activity.add_to_result = function( activity, prepend ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log("activities.js > add_activity_to_results()", activity );
	}
	
	/* Action */

	jQuery(document).trigger('add_activity_to_results');

	/* Setup */

	var id = activity.link.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (!(jQuery("#" + id).length)) {

		if( true === prepend ) {

			jQuery("<li class='activity' modified= '" + activity.modified + "' index-date= '" + activity.index_date + "' published-date= '" + activity.published_date + "' id='" + activity.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + activity.link + "'>" + activity.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().prependTo("#results").fadeIn('slow');

		} else {
			jQuery("<li class='activity' modified= '" + activity.modified + "' index-date= '" + activity.index_date + "' published-date= '" + activity.published_date + "' id='" + activity.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + activity.link + "'>" + activity.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().appendTo("#results").fadeIn('slow');
		}
	}

}



Buleys.activity.is_read = function( activity_url ) {

	/* Action */

	jQuery(document).trigger('check_if_activity_is_read');

	/* Callbacks */

	var on_success = function ( context ) {

		var activity_request = context.event;
		if (typeof activity_request.result !== 'undefined') {
			jQuery( "#" + activity_url.replace( /[^a-zA-Z0-9-_]+/g, "" ) ).addClass( "read" );
		} else {
			jQuery( "#" + activity_url.replace( /[^a-zA-Z0-9-_]+/g, "" ) ).addClass( "unread" );
		}
	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'status', 'key': activity_url, 'on_success': on_success, 'on_error': on_error } ); 

}

Buleys.activity.undelete = function( activity_url, slug, type ) {

	/* Action */

	jQuery(document).trigger('recreate_activity', { "activity_url": activity_url } );

	// TODO: Should be assertion
	// Verify the activity curl is not blank
	if (typeof activity_url !== 'undefined') {

		/* Callbacks */

		var on_success = function ( event ) {

			if (typeof event.target.result !== 'undefined') {
			
				var activity = event.target.result; 
				
				add_categories_to_categories_database(activity.link, activity.entities );
	
				for( category in activity.entities ) {
					if( activity.entities.hasOwnProperty( category ) ) {
						console.log(category);
						mark_activity_as_seen( activity.link, category.slug, category.type );
					}
				}
			}

		};

		var on_error = function ( e ) {

		};
		
		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_url, 'on_success': on_success, 'on_error': on_error } );

	
	}

}


Buleys.activity.get_raw_no_trash = function( activity_url ) {
	
	/* Action */

	jQuery(document).trigger('get_activity_raw_no_trash');

	/* Callbacks */

	var on_success = function( context ) {
		var event = context.event;
		if( !InDB.isEmpty( InDB.row.value( event ) ) ) { 
			if (jQuery("#" + activity_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
				add_activity_to_results(activity_request_1.result);
				check_if_activity_is_favorited(activity_request_1.result.link);
				check_if_activity_is_read(activity_request_1.result.link);
				check_if_activity_is_seen(activity_request_1.result.link);
			}
		}		
	};

	var on_error = function( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': activity_url, 'on_success': on_success, 'on_error': on_error } );	

}

Buleys.activity.get_wip = function ( activity_url ) {

	/* Debug */

	if ( true === Buleys.debug ) {
		console.log('activities.js > get_activity()', activity_url );
	}

	/* Action */

	jQuery(document).trigger('get_activity');

	/* Callbacks */
	
	var on_error = function( context_1 ) {
		console.log( 'Error in get_activity', context_1 );
	}
	
	var on_success = function( context_1 ) {

		/* Setup */
		var event_1 = context_1.event;
		var result = event_1.target.result;

		// Verify the activity exists, wasn't deleted and isn't archived
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) {


			/* UI */
			console.log('l5', result,event_1);

			if (jQuery("#" + activity_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
				console.log('l6');
				add_activity_to_results(result);

				check_if_activity_is_favorited(activity_url);

				check_if_activity_is_read(activity_url);

				check_if_activity_is_seen(activity_url);

			}
		}

	}; // End on_success

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_url, 'on_success': on_success, 'on_error': on_error } );

}


Buleys.activity.get = function( activity_url ) {

	/* Debug */

	if ( true === Buleys.debug ) {
		console.log('activities.js > get_activity()', activity_url );
	}

	/* Action */

	jQuery(document).trigger('get_activity');

	/* Callbacks */
	
	var on_error = function( context_1 ) {
		console.log( 'Error in get_activity', context_1 );
	}
	
	var on_success = function( context_1 ) {

		/* Setup */
		var event_1 = context_1.event;

		// Verify the activity wasn't deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) {

			/* Request */

			// Check if the activity was archived
			InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': activity_url, 'on_success': function( context_2 ) {

				/* Setup */
				var event_2 = context_2.event;

				// Verify that the activity wasn't archived
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 

					/* Request */

					// Get the activity
					InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_url, 'on_success': function( context_3 ) {
						/* Setup */

						var event_3 = context_3.event;
						var result = event_3.target.result
						if( !result ) {
							return;
						}

						// Verify the activity exists		
						if( !InDB.isEmpty( InDB.row.value( event_3 ) ) ) { 

							/* UI */
console.log('l5', result,event_3);

							if (jQuery("#" + activity_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
console.log('l6');
								add_activity_to_results(result);

								check_if_activity_is_favorited(activity_url);

								check_if_activity_is_read(activity_url);

								check_if_activity_is_seen(activity_url);

							}

						} // End verify the activity exists

					}, 'on_error': on_error } ); // End get the activity

				} // End verify that the activity wasn't archived

			}, 'on_error': on_error } ); // End check if the activity was archived

		} // End verify the activity wasn't deleted

	}; // End on_success


	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': activity_url, 'on_success': on_success, 'on_error': on_error } );

}


Buleys.activity.get_raw = function( activity_url ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log('get_activity_raw() > ',activity_url);
	}

	/* Action */

	jQuery(document).trigger('get_activity_raw');

	/* Callbacks */

	var on_error = function() {
		console.log( 'Error in get_activity_raw', activity_url );
	}

	/* Request */

	// Check if the activity was deleted
	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': activity_url, 'on_success': function( context ) {
		
		/* Setup */

		var event_1 = context.event;
		console.log('get_activity_raw success', event_1, InDB.row.value( event_1 ) );
		// Verify the activity wasn't deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 

			/* Request */

			InDB.trigger( 'InDB_do_row_get', { 'store': 'activities', 'key': activity_url, 'on_success': function( context ) {

				/* Setup */

				var event_2 = context.event;
				var value =  InDB.row.value(event_2);
				console.log('about to do UI');
				// Verify the activity wasn't archived
				if( !InDB.isEmpty( value ) ) { 

					console.log('doing UI now', value );
					/* UI */

					if (jQuery("#" + value.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						add_activity_to_results( value );
						check_if_activity_is_favorited( value.link );
						check_if_activity_is_read( value.link );
						check_if_activity_is_seen( value.link );
					}

				} //End verify the activity wasn't archived	

			}, 'on_error': on_error } ); // End check if the activity was deleted

		} // End verify the activity wasn't deleted

	}, 'on_error': on_error } ); // End check if the activity was deleted

}

Buleys.activity.get_batch( type_filter, slug_filter, begin_timeframe, end_timeframe ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log('activities.js > get_activities( type_filter, slug_filter, begin_timeframe, end_timeframe )', type_filter, slug_filter, begin_timeframe, end_timeframe );
	}

	/* Actions */

	jQuery(document).trigger('get_activities');

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
		var activity;
	
		if( "undefined" !== typeof result && null !== result ) {
			activity = result.value;
		}

		//console.log( 'activities.js > get_activities() > activity.link', context, result, activity.link );

		/* Work */

		// Verify there's an activity to add
		if( !!activity ) {
			
			/* Debug */
			if( true === Buleys.debug ) {
				console.log( 'activities.js > get_activities() > activity.link', activity.link );
			}

			// Get the activity
			get_activity( activity.link );

		}
	};

	var cursor_on_error = function ( context ) {
		console.log('Error in get_activities()', context );
	};
	
	var cursor_on_abort = function( context ) {
		console.log('Cursor aborted in get_activities()', context );
	}

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error, 'on_abort': cursor_on_abort } );	

}


function index_activities_by_field( type_filter, slug_filter, field ) {
	
	/* Action */

	jQuery( document ).trigger('index_activities_by_field');

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
		var activity = event_1.target.result.value;

		//TODO: What is this?
		if( activity ) {
			index_view[ field ][ activity[field] ] = activity.link;	
		}

	};

	var cursor_on_error = function( context ) {

	}

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'activities', 'index': 'slug', 'keyRange': InDB.transaction.only( slug_filter ), 'on_success': oncusor_on_success, 'on_error': cursor_on_error } );
	
}


function get_activity_for_console( activity_url ) {

	/* Action */

	jQuery(document).trigger('get_activity_for_console');

	/* Callbacks */

	activity_on_success = function ( context ) {
		var activity_request = context.event;
		if (typeof activity_request.result !== 'undefined' && typeof activity_request.result.id === 'string') {
			var html_snippit = "<div id='console_" + activity_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
			html_snippit = html_snippit + "<h3><a href='" + activity_request.result.id + "'>" + activity_request.result.title + "</a></h3>";
			html_snippit = html_snippit + "<p>" + activity_request.result.author + "</p>";
			html_snippit = html_snippit + "</div>";
			send_to_console(html_snippit);
		}
	};

	activity_on_error = function ( e ) {
		console.log('Error gettng activity', e );
	};
	
	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'activities', 'key': activity_url, 'on_success': activity_on_success, 'on_error': activity_on_error } );

}

/* Method for batch processing of activities for type and topic */
function get_data_for_activities( activities ) {

	/* Action */

	jQuery(document).trigger('get_data_for_activities');

	/* Work */

	// Loop through each activity
	$.each(activities, function ( i, activity ) {


		/* Debug */

		if( true === Buleys.debug ) {
			console.log("getting data for activity", activity);
		}

		/* Work */

		// Calls get_activity() using the activity.link
		get_activity(activity.link);

	} );

}


Buleys.activity.add_batch = function ( activities, type_to_get, company_to_get ) {

	/* Debug */

	if( true === Buleys.debug ) {
		console.log('activities.js > add_activities', activity, type_to_get, company_to_get );
	}

	/* Action */

	jQuery(document).trigger('add_activities');

	/* Work */

	// Loop through each activity to database
	$.each( activities, function ( i, activity ) {

		if( true === Buleys.debug ) {
			//console.log('activities.js > add_activities > each', activity );
		}

		Buleys.activity.add( activity, type_to_get, company_to_get );

	});

}

Buleys.activities.add = function ( activity, type_to_get, company_to_get ) {

	/* Debug */
	
	if ( !!Buleys.debug ) {
		console.log( 'add_activity_if_new()', activity, type_to_get, company_to_get );
	}

	/* Action */

	jQuery(document).trigger('add_activity_if_new');

	/* Assertions */

	if( !activity.link ) {
		return;
	}

	/* Callbacks */
	
	var on_error = function() {
		console.log( 'Error in get_activity', activity.link );
	}	

	var on_abort = function() {
		console.log( 'Abort in get_activity', activity.link );
	}	

	/* Request */

	// Check if the activity was deleted
	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': activity.link, 'on_success': function( context_1 ) {

		/* Setup */

		var event_1 = context_1.event;
		
		// Verify activity was not deleted
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 

			/* Request */

			// Check if the activity was archived
			InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': activity.link, 'on_success': function( context_2 ) {

				/* Setup */

				var event_2 = context_2.event;
				
				// Verify the activity wasn't archived
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 

					/* UI */

					add_activity_to_activities_database(activity);

					send_to_console("<p>Added: <a href='" + activity.link + "'>" + activity.title + "</a></p>");

					add_categories_to_categories_database(activity.link, activity.entities );

					/* Setup */

					var activity_key = type_to_get.toLowerCase() + "_" + company_to_get.toLowerCase();

					/* Work */

					// Empty the current view's new activity inbox
					if (typeof Buleys.queues.new_activities[activity_key] === "undefined") {

						Buleys.queues.new_activities[activity_key] = 0;

					}

					// Queue up another crawl
					Buleys.queues.new_activities[activity_key] = Buleys.queues.new_activity[activity_key] + 1;

				} // End verify that the activity was not archivedc

			}, 'on_error': on_error } ); // End check if the activity was archived

		} // End verify that the activity was not deleted

	}, 'on_error': on_error } ); // End check if the activity was deleted

}

