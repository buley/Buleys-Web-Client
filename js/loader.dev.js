var Buleys = {};
/* IndexedDB */
Buleys.db = {};
Buleys.version = 7;
Buleys.database_name = "Buleys-320";
Buleys.database_description = "www.buleys.com";
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
Buleys.debug = {};
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
	set_page_vars();
	check_login_status();
	if(typeof Buleys.db === "object") {
		var database_open_on_complete = function( event ) {
			Buleys.db = event.request.result;
			jQuery( document ).trigger( 'database_loaded' );
		};
		open_database( Buleys.database_name, Buleys.database_description, database_open_on_complete, Buleys.on_error, Buleys.on_abort );
	} else if( typeof Buleys.db === "IDBDatabase" ) {
		//database already loaded
		jQuery( document ).trigger( 'database_loaded' );
	}
});

jQuery( document ).bind( 'database_open', function( event, parameters ) {
	Buleys.session.database_is_open = true;
	load_current_page();
});

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
