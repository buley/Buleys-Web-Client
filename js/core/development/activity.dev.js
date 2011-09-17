
/**
 * Activity.js
 **/

Buleys.activity = Buleys.activity || {};
Buleys.activities = Buleys.activities || {};

jQuery('.activity').live( 'click', function(){ 
	jQuery(this).addClass('selected');
	jQuery(this).trigger('preview_activity');
});


/* Utility functions */


/* Single activity methods */


//adds a new activity to the database (meaning it must not yet exist)
//on_success callback returns activity id as only argument
//on_error returns error
Buleys.activity.add = function ( activity ) {

};


//removes an existing activity from database
//on_error returns error, on_success returns nothing
Buleys.activity.remove = function ( activity_id, on_success, on_error ) {

};


//updates an existing activity or adds a new one
//given an activity_id and data
//data argument can be attributes or whole activity
//on_success returns activity_id
//on_error returns error
Buleys.activity.update = function ( activity_id, data, on_success, on_error ) {

};


//gets an existing activity given an activity_id
Buleys.activity.get = function ( activity_id, on_success, on_error ) {

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
Buleys.activities.getAll = function( filter, on_success, on_error, on_complete, index, begin, begin_inclusive, end, end_inclusive, inverse ) {

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



/* 
Buleys.activity.remove = ( id, on_success, on_error ) {

	/* Action */

	jQuery(document).trigger('remove_activity_from_activities_database');
	
	/* Callbacks */

	if( 'undefined' === typeof on_success ) {	
		var on_success = function ( context ) {
		};
	}
	
	if( 'undefined' === typeof on_error ) {
		var on_error = function ( context ) {
		};
	}

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'activities', 'key': id, 'on_success': on_success, 'on_error': on_error } );

}


Buleys.activity.update = function( activity ) {

	/* Action */

	jQuery(document).trigger('add_activity_to_activities_database');

	/* Setup */

	var data = get_data_object_for_activity(activity);

	/* Callbacks */

	var deleted_on_success = function ( context ) {

		/* Setup */

		var event = context.event;

		// Verify activity is not deleted
		if ( typeof event.result === 'undefined' ) {

			/* Callbacks */

			var add_on_success = function ( context_2 ) {

				/* Setup */

				var event2 = context_2.event;


					/* Debug */
					
					if( true === Buleys.debug ) {
						console.log("activities.js > add_activity_to_activity_database() > activity.entities > ", activity.entities );
					}

					// Qualify the view
					// TODO: Better description
					if ( ( Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" ) && ( typeof page === "undefined" || ( page !== "favorites" && page !== "seen" && page !== "read" && page !== "archive" && page !== "trash" ) ) ) {

						// Add the activity to the results
						Buleys.activity.publish( activity );

					}
			};

			var add_on_error = function ( context_2 ) {
			
			};

			/* Request */

			InDB.trigger( 'InDB_do_row_add', { 'store': 'activities', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

		}

	};

	deleted_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': activity.link, 'on_success': deleted_on_success, 'on_error': deleted_on_error } ); 

}



Buleys.activity.publish = function( activity, prepend ) {
	
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

