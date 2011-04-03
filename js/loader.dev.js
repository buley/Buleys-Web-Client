if (typeof window.webkitIndexedDB !== "undefined") {
/* 
Currently in Chrome, these are not yet official:
webkitIDBCursor: function IDBCursor() { [native code] }
webkitIDBDatabase: function IDBDatabase() { [native code] }
webkitIDBDatabaseError: function IDBDatabaseError() { [native code] }
webkitIDBDatabaseException: function IDBDatabaseException() { [native code] }
webkitIDBErrorEvent: function IDBErrorEvent() { [native code] }
webkitIDBEvent: function IDBEvent() { [native code] }
webkitIDBFactory: function IDBFactory() { [native code] }
webkitIDBIndex: function IDBIndex() { [native code] }
webkitIDBKeyRange: function IDBKeyRange() { [native code] }
webkitIDBObjectStore: function IDBObjectStore() { [native code] }
webkitIDBRequest: function IDBRequest() { [native code] }
webkitIDBSuccessEvent: function IDBSuccessEvent() { [native code] }
webkitIDBTransaction: function IDBTransaction() { [native code] }
webkitIndexedDB: IDBFactory
*/
window.IDBCursor = window.webkitIDBCursor;
window.IDBDatabase = window.webkitIDBDatabase;
window.IDBDatabaseError = window.webkitIDBDatabaseError;
window.IDBDatabaseException = window.webkitIDBDatabaseException;
window.IDBErrorEvent = window.webkitIDBErrorEvent;
window.IDBEvent = window.webkitIDBEvent;
window.IDBFactory = window.webkitIDBFactory;
window.IDBIndex = window.webkitIDBIndex;
window.IDBKeyRange = window.webkitIDBKeyRange;
window.IDBObjectStore = window.webkitIDBObjectStore;
window.IDBRequest = window.webkitIDBRequest;
window.IDBSuccessEvent = window.webkitIDBSuccessEvent;
window.IDBTransaction = window.webkitIDBTransaction;
window.indexedDB = window.webkitIndexedDB;

} else if ('mozIndexedDB' in window) {
window.indexedDB = window.mozIndexedDB;
}

var Buleys = {};
Buleys.db = {};
Buleys.queues = {};
Buleys.mouse = {};
Buleys.shortcuts = {};
Buleys.history = {};
Buleys.session = {};
Buleys.settings = {};
Buleys.settings.hotkeys = {};
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
	    open_database();
    } else if(typeof Buleys.db === "IDBDatabase") {
    	console.log('database loaded');
	    reload_results();
    }
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
