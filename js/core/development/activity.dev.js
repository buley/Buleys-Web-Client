
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

Buleys.activity.shorthand_map = {
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
	'clicked': 'cl',
	'content': 'c',
	'entities': 'e', //extension
	'favorited': 'f',
        'generator': 'g',
        'generator_attachments': 'g_at',
        'generator_content': 'g_c',
        'generator_display_name': 'g_dn',
        'generator_downstream_duplicates': 'g_dd',
        'generator_id': 'g_i',
        'generator_image_height': 'g_ih',
        'generator_image_url': 'g_iu',
        'generator_image_width': 'g_iw',
        'generator_object_type': 'g_ot',
        'generator_published': 'g_pu',
        'generator_score': 'g_sc',
        'generator_summary': 'g_s',
        'generator_updated': 'g_up',
        'generator_upstream_duplicates': 'g_ud',
        'generator_url': 'g_u',
	'icon': 'ic',
	'icon_height': 'ic_h',
	'icon_width': 'ic_w',
	'icon_url': 'ic_u',
	'id': 'i',
	'image': 'im',
	'image_height': 'ih',
	'image_url': 'iu',
	'image_width': 'iw',
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
	'score': 'sc', //extension
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
	'topic': 'to', //extension
	'title': 'ti',
	'trashed': 'tr',
	'updated': 'up',
	'url': 'u',
	'verb': 'v'
};

Buleys.activity.shorthand = function ( key ) {
	if( 'undefined' !== typeof Buleys.activity.shorthand_map[ key ] ) {
		return Buleys.activity.shorthand_map[ key ];
	} else {
		return key;
	}
}


Buleys.activity.shorthand_reverse = function ( key ) {
	var k = key;
	var reversed = {};
	for( var item in Buleys.activity.shorthand_map ) {
		if( Buleys.activity.shorthand_map.hasOwnProperty( item ) ) {
			reversed[ Buleys.activity.shorthand_map[ item ] ] = item;
		}
	}
	if( 'undefined' !== typeof reversed[ k ] ) {
		return reversed[ k ];
	} else {
		return k;
	}
}

//recursive
Buleys.activity.shorthand_decode = function( object ) {
	var encoded = {};
	var total = 0;
	for( var itemobj in object ) {
		if( 'undefined' !== typeof itemobj && object.hasOwnProperty( itemobj ) ) {
			//recursive case: object value
			//base case: string value
			var value = object[ itemobj ];
			if( 'object' === typeof value ) {
				encoded[ Buleys.activity.shorthand_reverse( itemobj ) ] = Buleys.activity.shorthand_decode( value );
				delete value;
			} else { 
				encoded[ Buleys.activity.shorthand_reverse( itemobj ) ] = value;
				delete value;
			}
		}
		total++;
	}
	if( total > 0 ) {
		return encoded;
	} else {
		return {};
	}
}


//recursive
Buleys.activity.shorthand_encode = function( object ) {
	var encoded = {};
	for( var item in object ) {
		if( object.hasOwnProperty( item ) ) {
			//recursive case: object value
			//base case: string value

			if( 'object' === typeof object[ item ] ) {
				encoded[ Buleys.activity.shorthand( item ) ] = Buleys.activity.shorthand_encode( object[ item ] );	
			} else { 
				encoded[ Buleys.activity.shorthand( item ) ] = object[ item ];
			}
		}
	}
	return encoded;
}


Buleys.activity.install = function ( ) {

        var activities = {
                'activities': { 'key': Buleys.activity.shorthand( 'id' ), 'incrementing_key': false, 'unique': true }
        }

        var activities_idxs = {
                'activities': {
			'actor_id': {},
			'object_id': {},
			'object_url': {},
			'object_published': {},
			'verb': {},
			'seen': {},
			'clicked': {},
			'trashed': {},
			'archived': {},
			'favorited': {}
		}
	}


	activities_idxs.activities[ 'actor_id' ][ Buleys.activity.shorthand( 'object_id' ).replace( '_', '.' ) ] =  'true';
	activities_idxs.activities[ 'object_id' ][ Buleys.activity.shorthand( 'object_id' ).replace( '_', '.' ) ] = 'true';
	activities_idxs.activities[ 'object_url' ][ Buleys.activity.shorthand( 'object_url' ).replace( '_', '.' ) ] = 'false';
	activities_idxs.activities[ 'object_published' ][ Buleys.activity.shorthand( 'object_published' ).replace( '_', '.' ) ] = 'false';
	activities_idxs.activities[ 'verb' ][ Buleys.activity.shorthand( 'verb' ) ] = 'true';
	activities_idxs.activities[ 'seen' ][ Buleys.activity.shorthand( 'seen' ) ] = 'true';
	activities_idxs.activities[ 'clicked' ][ Buleys.activity.shorthand( 'clicked' ) ] = 'true';
	activities_idxs.activities[ 'trashed' ][ Buleys.activity.shorthand( 'trashed' ) ] = 'true';
	activities_idxs.activities[ 'archived' ][ Buleys.activity.shorthand( 'archived' ) ] = 'true';
	activities_idxs.activities[ 'favorited' ][ Buleys.activity.shorthand( 'favorited' ) ] = 'true';

	console.log( 'Buleys_activity_install', activities, activities_idxs );

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

	/* Defaults */

	if( !activity.trashed ) {
		activity.trashed = "false";
	}

	if( !activity.seen ) {
		activity.seen = "false";
	}

	if( !activity.clicked ) {
		activity.clicked = "false";
	}

	if( !activity.archived ) {
		activity.archived = "false";
	}

	if( !activity.favorited ) {
		activity.favorited = "false";
	}

	if( !activity.published ) {
		activity.published = "true";
	}

	/* Assertions */

	InDB.assert( !InDB.isEmpty( activity.id ), 'activity.id must not be empty' );

	/* Callbacks */

	var on_success_wrapper = function ( context ) {
		if( !!Buleys.debug ) {
			console.log( 'Activity added successfully', context );
		}
		if( 'undefined' !== typeof on_success ) {
			on_success( context );
		}
	};

	var on_error_wrapper = function ( context ) {
		if( !!Buleys.debug ) {
			console.log( 'Error adding activity', context );
		}
		if( 'undefined' !== typeof on_error ) {
			on_error( context );
		}
	};

	/* Shorthand Encoding */

	activity = Buleys.activity.shorthand_encode( activity );
	
	/* Request */
	
	InDB.trigger( 'InDB_do_row_add', { 'store': 'activities', 'data': activity, 'on_success': on_success_wrapper, 'on_error': on_error_wrapper } );

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
//on_success returns the row or null if the row doesn't exists or it exists but doesn't match the filter
Buleys.activity.get = function ( activity_id, filter, on_success, on_error ) {

	/* Action */

	jQuery( document ).trigger( 'Buleys_activity_get', { 'activity_id': activity_id, 'filter': filter } );
	
	/* Callbacks */

	// Out callback
	var on_success_wrapper = function ( context ) {
		if( 'undefined' !== typeof on_success ) {

			var result = InDB.row.value( context.event );
			
			var matches_filter = true;
			var x;
			for( x in filter ) {
				if ( filter[ x ] !== result[ Buleys.activity.shorthand( x ) ] ) {
					matches_filter = false;
					break;
				}
			} 

			/* Shorthand Decoding */
			
			result = Buleys.activity.shorthand_decode( result );
			console.log('matched?', matches_filter, true === matches_filter, true == matches_filter );	
			//return result if it matches the filter	
			//else return null
			if( true === matches_filter ) {
				on_success( result );
			} else {
				on_success( null );
			}

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
Buleys.activity.publish = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'published': 'true' }, on_success, on_error );
};


//unpublish an activity given its activity_id
//this removes an activity from visibility
Buleys.activity.unpublish = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'published': 'false' }, on_success, on_error );
};


//verify trash status of an activity given an activity_id
//this determines whether an activity is visible
//returns true if item is archived, else returns false
Buleys.activity.is_published = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'published': 'true' }, on_success_wrapper, on_error_wrapper );

};



/* Seen */


//mark an activity as seen given its activity_id
Buleys.activity.see = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'seen': 'true' }, on_success, on_error );
};


//mark an activity as unseen given its activity_id
Buleys.activity.unsee = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'seen': 'false' }, on_success, on_error );
};


//verify seen status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_seen = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'seen': 'true' }, on_success_wrapper, on_error_wrapper );

};


/* Clicks */


//mark an activity as clicked given its activity_id
Buleys.activity.click = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'clicked': 'true' }, on_success, on_error );
};


//mark an activity as unclicked given its activity_id
Buleys.activity.unclick = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'clicked': 'false' }, on_success, on_error );
};


//verify click status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_clicked = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'clicked': 'true' }, on_success_wrapper, on_error_wrapper );

};


/* Trash */


//trash an activity given its activity_id
Buleys.activity.trash = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'trashed': 'true' }, on_success, on_error );
};


//untrash an activity given its activity_id
Buleys.activity.untrash = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'trashed': 'false' }, on_success, on_error );
};


//verify trash status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_trashed = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'trashed': 'true' }, on_success_wrapper, on_error_wrapper );

};


/* Archive */

//archive an activity given its activity_id
Buleys.activity.archive = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'archived': 'true' }, on_success, on_error );
};

//unarchive an activity given its activity_id
Buleys.activity.unarchive = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'archived': 'false' }, on_success, on_error );
};

//verify archive status of an activity given an activity_id
//returns true if item is archived, else returns false
Buleys.activity.is_archived = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'archived': 'true' }, on_success_wrapper, on_error_wrapper );

};


/* Favorite */

//favorite an activity given its activity_id
Buleys.activity.favorite = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'favorited': 'true' }, on_success, on_error );
};

//unfavorite an activity given its activity_id
Buleys.activity.unfavorite = function( activity_id, on_success, on_error ) {
	Buleys.activity.update( activity_id, { 'favorited': 'true' }, on_success, on_error );
};

//determine favorite status of activity
//returns true if activity is favorited, else false
Buleys.activity.is_favorited = function( activity_id, on_success, on_error ) {

	var on_success_wrapper = function( result ) {

		if( isEmpty( result ) ) {
			on_success( false );
		} else {
			on_success( true );
		}

	};

	var on_error_wrapper = function( context ) {
		on_error( context.error );
	};

	Buleys.activity.get( activity_id, { 'favorited': 'true' }, on_success_wrapper, on_error_wrapper );

};




/* Multi-activity methods */


//gets all activities based on an existing index and value
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getAll = function( filter, on_success, on_error, on_complete, index, value, left_bound, right_bound, includes_left_bound, includes_right_bound ) {

	/* Actions */

	jQuery(document).trigger('Buleys_activities_getAll');

	/* Defaults */

	if( !includes_left_bound ) {
		includes_left_bound = false;
	}
	
	if( !includes_right_bound ) {
		includes_right_bound = false;
	}
	
	var key_range = InDB.range.get( value, left_bound, right_bound, includes_left_bound, includes_right_bound );
	
	/* Callbacks */

	var cursor_on_success = function ( context ) {

		/* Setup */

		var activity = InDB.cursor.value( context.event );

		// Fire on_success() callback if items
		// Else call on_complete() if cursor is exhausted
		if( !!activity ) {
			
			/* Decode Shorthand */
				
			activity = Buleys.activity.shorthand_decode( activity );

			/* Filter */

			var matches_filter = true;
			for( x in filter ) {
				if ( filter[ x ] !== activity[ x ] ) {
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
Buleys.activities.getArchived = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'archived', true, null, null, null, null );
};


//gets all unarchived activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnarchived = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'archived', false, null, null, null, null );
};


/* Seen */


//gets all seen activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getSeen = function ( filter, on_success, on_erorr, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'seen', true, null, null, null, null );
}


//gets all unseen activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnseen = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'seen', false, null, null, null, null );
}


/* Trash */


//gets all trashed activities
//depends on activities.getAll
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getTrashed = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'trashed', true, null, null, null, null );
};


//gets all untrashed activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUntrashed = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'trashed', false, null, null, null, null );
};


/* Favorites */


//gets all favorited activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getFavorited = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'favorited', true, null, null, null, null );
};


//gets all untrashed activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnfavorited = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false', 'published': 'true' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'favorited', false, null, null, null, null );
};

/* Published */


//gets all published activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getPublished = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'published', true, null, null, null, null );
};


//gets all unpublished activities
//depends on activities.getAll
//on_success and on_error are only invoked on a per-transaction basis
//on_complete is invoked after all activities have returned either an on_success or on_error
Buleys.activities.getUnpublished = function ( filter, on_success, on_error, on_complete ) {
	if( 'undefined' === typeof filter ) {
		filter = { 'trashed': 'false' };
	}
	Buleys.activities.getAll( filter, on_success, on_error, on_complete, 'published', false, null, null, null, null );
};


/* Utilities */


//helper function for adding activities in batch
//takes an Array of Objects
//on_success and on_error are only invoked on a per-transaction basis
Buleys.activities.add = function( activities, on_success, on_error ) {
	for( var i = 0; i <= activities.length; i++ ) {
		Buleys.activity.add( activities[ i ], on_success, on_error );
	}
};


//helper function for removing activities in batch
//takes an Array of activity_id Strings
//on_success and on_error are only invoked on a per-transaction basis
Buleys.activities.remove  = function( activities, on_success, on_error ) {
	for( var i = 0; i <= activities.length; i++ ) {
		Buleys.activity.remove( activities[ i ], on_success, on_error );
	}
};


//helper function for updating activites in bulk
//takes an Array of activity objects
//on_success and on_error are only invoked on a per-transaction basis
Buleys.activities.update = function( activities, on_success, on_error ) {
	for( var i = 0; i <= activities.length; i++ ) {
		Buleys.activity.update( activities[ i ], on_success, on_error );
	}
};



Buleys.activity.add_to_result = function( activity, prepend ) {
	
	/* Debug */

	if( true === Buleys.debug ) {
		console.log("activities.js > add_activity_to_results()", activity );
	}
	
	/* Action */

	jQuery(document).trigger('add_activity_to_results');

	/* Setup */

	var id = activity.id;

	/* UI */

	if (!(jQuery("#" + id).length)) {

		var content = "<li class='activity' modified= '" + activity.object.modified + "' published-date= '" + activity.published_date + "' id='" + activity.id + "'><a href='" + activity.object.url + "'>" + activity.object.summary + "</a><a class='examine_item magnify_icon' href='#'></a></li>";
		
		if( true === prepend ) {
			jQuery( content ).hide().prependTo("#results").fadeIn('slow');
		} else {
			jQuery( content ).hide().appendTo("#results").fadeIn('slow');
		}

	}

}

