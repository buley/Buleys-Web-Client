var Buleys = {};
/* IndexedDB */
Buleys.db = {};
Buleys.version = 7;
Buleys.database_name = "Buleys-324";
Buleys.database_description = "Database for www.buleys.com";
Buleys.on_complete = function( e ) { console.log( "indexeddb request completed" ); console.log( e ); }
Buleys.on_error = function( e ) { console.log( "indexeddb request errored" ); console.log( e ); }
Buleys.on_abort = function( e ) { console.log( "indexeddb request aborted" ); console.log( e ); }


Buleys.queues = {};
Buleys.settings = {};
Buleys.profile = {};
Buleys.mouse = {};
Buleys.shortcuts = {};
Buleys.history = {};
Buleys.session = {};
Buleys.view = {};
Buleys.view.scripts = [];
Buleys.loader = {};
Buleys.loader.loaded_scripts = 0;
Buleys.loader.total_scripts = 0;
Buleys.debug = false;
Buleys.debug.database = false;
Buleys.debug.ajax = false;
Buleys.debug.items = false;
Buleys.settings.mini_inbox_topic_count = 5;
Buleys.shortcuts.s_depressed = false;
Buleys.shortcuts.d_depressed = false;
Buleys.shortcuts.shift_depressed = false;
Buleys.settings.crawl_speed = 10000;
Buleys.settings.crawl_deincrement = (2 / 4);
Buleys.settings.crawl_increment = (1 / 5);
Buleys.settings.crawl_max = 6000000;
Buleys.settings.crawl_min = 10000;
Buleys.settings.hotkeys = {};
Buleys.settings.hotkeys.disabled = true;
Buleys.queues.pending_crawls = [];
Buleys.queues.new_items = {};
Buleys.mouse.mouse_y = 0;
Buleys.mouse.mouse_x = 0;
Buleys.mouse.mouse_y_snapshot = 0;
Buleys.mouse.mouse_x_snapshot = 0;
Buleys.store = window.localStorage;
Buleys.session.database_is_open = false;

var session_token = '';
var debug;
//webkitIDBCursor

$(document).ready(function() {

	var browser_check = InDB.checkBrowser();
	InDB.assert( -1 !== browser_check, 'incompatible browser' );
	if ( 0 === browser_check ) {
		InDB.fixBrowser();
	}

	set_page_vars();
	check_login_status();


	InDB.debug = false;
	InDB.trigger( 'InDB_do_database_load', { 'name': Buleys.database_name, 'description': Buleys.database_description } ) ;
});

jQuery( InDB ).bind( 'InDB_database_load_success', function( event, parameters ) {
	console.log( 'InDB_database_load_success', parameters );
	Buleys.session.database_is_open = true;
	//load_current_page();
});

jQuery( InDB ).bind( 'InDB_database_created', function( event, parameters ) {
	Buleys.install_stores();
});

Buleys.install_stores = function() {

	/* Archive */

	var archive = {
		'archive': {
			'key': 'link', 'incrementing_key': false, 'unique': true
		}
	};	

	var archive_idxs = {
		'archive': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( archive, archive_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': archive, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': archive_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Archive store loaded', context2 );
		} } );		
	} } );


	/* Categories */

	var categories = {
		'categories': { 'key': 'id', 'incrementing_key': false, 'unique': true }	
	}

	var categories_idxs = {
		'categories': {
			'slug': { 'slug': false },
			'link': { 'link': false },
			'type': { 'type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( categories, categories_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': categories, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': categories_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Categories store loaded', context2 );
		} } );		
	} } );


	/* Favorites */

	var favorites = {
		'favorites': { 'key': 'link', 'incrementing_key': false, 'unique': true }
	};	

	var favorites_idxs = {
		'favorites': {
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( favorites, favorites_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': favorites, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': favorites_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Favorites store loaded', context );
		} } );		
	} } );


	/* Follows */

	var follows = {
		'follows': { 'key': 'key', 'incrementing_key': false, 'unique': true }
	};	

	var follows_idxs = {
		'follows': {
			'modified': { 'modified': false }
		}
	};

	console.log( follows, follows_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': follows, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': follows_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Follows store loaded', context2 );
		} } );		
	} } );


	/*  Items */

	var items = {
		'items': { 'key': 'link', 'incrementing_key': false, 'unique': true }	
	}

	var items_idxs = {
		'items': {
			'author': { 'slug': false },
			'published_date': { 'link': false },
			'index_date': { 'type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( items, items_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': items, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': items_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Items store loaded', context2 );
		} } );	
	} } );


	
	/* Status */

	var status = {
		'status': { 'key': 'link', 'incrementing_key': false, 'unique': true }
	};	

	var status_idxs = {
		'status': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_stores_create', { 'stores': status, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': status_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Topics store loaded', context2 );
		} } );		
	} } );


	console.log( status, status_idxs );

	
	/* Seen */

	var seen = {
		'seen': { 'key': 'link', 'incrementing_key': false, 'unique': true }
	};	

	var seen_idxs = {
		'seen': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( seen, seen_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': seen, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': seen_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Seen store loaded', context2 );
		} } );		
	} } );


	/* Subscriptions */

	var subscriptions = {
		'subscriptions': { 'key': 'key', 'incrementing_key': false, 'unique': true }
	};	

	var subscriptions_idxs = {
		'subscriptions': {
			'modified': { 'modified': false }
		}
	};

	console.log( follows, follows_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': follows, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': follows_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Follows store loaded', context2 );
		} } );		
	} } );


	
	/* Topics */

	var topics = {
		'topics': { 'key': 'topic_key', 'incrementing_key': false, 'unique': true }
	};	

	// TODO: Why is last_updated not modified like the rest?
	var topics_idxs = {
		'topics': {
			'slug': { 'topic_slug': false },
			'type': { 'topic_type': false },
			'last_updated': { 'modified': false }
		}
	};

	console.log( topics, topics_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': topics, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': topics_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Topics store loaded', context2 );
		} } );		
	} } );


	/* Deleted */

	var deleted = {
		'deleted': { 'key': 'link', 'incrementing_key': false, 'unique': true }
	};	

	var deleted_idxs = {
		'deleted': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( deleted, deleted_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': deleted, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': deleted_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Deleted store loaded', context2 );
		} } );		
	} } );


	/* Votes */

	var votes = {
		'votes': { 'key': 'vote_key', 'incrementing_key': false, 'unique': true }
	};	

	var votes_idxs = {
		'votes': {
			'vote_value': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	console.log( votes, votes_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': votes, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': votes_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Votes store loaded', context2 );
		} } );		
	} } );


}


Buleys.install_indexes = function() {

	/* Archive */

	var archive_idxs = {
		'archive': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': archive_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Archive store loaded', context2 );
	} } );		


	/* Categories */

	var categories_idxs = {
		'categories': {
			'slug': { 'slug': false },
			'link': { 'link': false },
			'type': { 'type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': categories_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Categories store loaded', context2 );
	} } );		


	/* Favorites */

	var favorites_idxs = {
		'favorites': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': favorites_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Favorites store loaded', context );
	} } );		


	/* Follows */

	var follows_idxs = {
		'follows': {
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': follows_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Follows store loaded', context2 );
	} } );		


	/*  Items */

	var items_idxs = {
		'items': {
			'author': { 'slug': false },
			'published_date': { 'link': false },
			'index_date': { 'type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': items_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Items store loaded', context2 );
	} } );	

	
	/* Status */

	var status_idxs = {
		'status': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': status_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Topics store loaded', context2 );
	} } );		

	
	/* Seen */

	var seen_idxs = {
		'seen': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': seen_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Seen store loaded', context2 );
	} } );		


	/* Subscriptions */

	var subscriptions_idxs = {
		'subscriptions': {
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': follows_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Follows store loaded', context2 );
	} } );		


	
	/* Topics */

	// TODO: Why is last_updated not modified like the rest?
	var topics_idxs = {
		'topics': {
			'slug': { 'topic_slug': false },
			'type': { 'topic_type': false },
			'last_updated': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': topics_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Topics store loaded', context2 );
	} } );		


	/* Deleted */

	var deleted_idxs = {
		'deleted': {
			'topic_slug': { 'topic_slug': false },
			'topic_type': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': deleted_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Deleted store loaded', context2 );
	} } );		


	/* Votes */

	var votes_idxs = {
		'votes': {
			'vote_value': { 'topic_type': false },
			'modified': { 'modified': false }
		}
	};

	InDB.trigger( 'InDB_do_indexes_create', { 'indexes': votes_idxs, 'on_complete': function( context2 ) { 
		console.log( 'Votes store loaded', context2 );
	} } );		

}

/*
Buleys.loader.announce_loaded_script = function(loaded_script) {

	Buleys.loader.loaded_scripts++;
	if(Buleys.loader.total_scripts === Buleys.loader.loaded_scripts) {
	    set_page_vars();
		check_login_status();

		if(typeof Buleys.db === "object") {
		    open_database();
	    } else if(typeof Buleys.db === "IDBDatabase") {
	    	console.log('database loaded');
		    reload_results();
	    }
	    	
	} else {
		console.log("Loaded/unloaded: "+Buleys.loader.total_scripts + ", " + Buleys.loader.loaded_scripts);
	}	
}

var scripts_to_load = [
	"/js/core/items.js",
	"/js/core/storage.js",
	"/js/core/archive.js",
	"/js/core/authentication.js",
	"/js/core/categories.js",
	"/js/core/console.js",
	"/js/core/cron.js",
	"/js/core/cursor.js",
	"/js/core/favorites.js",
	"/js/core/follows.js",
	"/js/core/inbox.js",
	"/js/core/messaging.js",
	"/js/core/misc.js",
	"/js/core/notification.js",
	"/js/core/overlay.js",
	"/js/core/queue.js",
	"/js/core/read.js",
	"/js/core/seen.js",
	"/js/core/settings.js",
	"/js/core/social.js",
	"/js/core/style.js",
	"/js/core/subscriptions.js",
	"/js/core/time.js",
	"/js/core/topics.js",
	"/js/core/trash.js",
	"/js/core/user.js",
	"/js/core/votes.js",
	"/js/core/work.js",
	"/js/utilities/md5.js",
	"/js/utilities/isotope.js",
	"/js/core/templating.js"
	];

Buleys.loader.total_scripts = scripts_to_load.length;

$.each(scripts_to_load, function(script_key,script_path) {
 	console.log(script_path);
    var script = document.createElement( 'script' );
    script.src = script_path;
	script.type = "text/javascript";
	//http://stevesouders.com/efws/script-onload.php
	script.onload = function() { 
	    if ( ! script.onloadDone ) {
	        script.onloadDone = true; 
	        Buleys.loader.announce_loaded_script(script_path)
	    }
	};
	script.onreadystatechange = function() { 
	    if ( ( "loaded" === script.readyState || "complete" === script.readyState ) && ! script.onloadDone ) {
	        script.onloadDone = true; 
	        Buleys.loader.announce_loaded_script(script_path)
	    }
	}

    var headID = document.getElementsByTagName("head")[0];         
    //headID.appendChild(script);
});

*/
