/**
 * InDB by Taylor Buley
 * Github -> http://github.com/editor/indb 
 * Twitter -> @taylorbuley
 **/

/**
 * Namespaces:
 *   Indb - application namespace
 *   Indb.db - namespace for the open IndexedDB instance (IDBFactory)
 *   Indb.dbs = namespace for open databases (reserved)
 *   Indb.database - namepspace for database methods (IDBDatabase)
 *   Indb.store - namespace for operations against multiple object stores (IBObjectStore)
 *   Indb.stores - namespace for single object stores (IDBObjectStore)
 *   Indb.index - namespace for index methods (IDBIndex)
 *   Indb.transaction - namespace for key range methods (IDBTransaction)
 *   Indb.range - namespace for key range methods (IDBKeyRange)
 *   Indb.row - namespace for row methods
 *   Indb.cursor - namespace for rows methods (IDBCursor)
 *   Indb.event - namespace for event and error methods (IDBEvent, IDBSuccessEvent, IDBErrorEvent, IDBDatabaseError and IDBDatabaseException)
 *   Indb.events - namespace for event callbacks
 **/

/* Begin Namespaces */
var InDB = {};
InDB.factory = {};
InDB.db = {};
InDB.dbs = {};
InDB.database = {};
InDB.store = {};
InDB.stores = {};
InDB.index = {};
InDB.indexes = {};
InDB.range = {};
InDB.row = {};
InDB.cursor = {};
InDB.event = {};
InDB.events = {};
InDB.transaction = {};
/* End Namespaces */


/**
 * Constants:
 *   None
 **/

/* Begin Constants */
/* End Constants */


/**
 * Defaults:
 *   InDB.database.version (int) - database version to start with
 *   InDB.debug (bool) - whether or not to console.log stuff
 *   InDB.events.on_success (function) - generic success callback
 *   InDB.events.onComplete (function) - generic complete callback
 *   InDB.events.onError (function)- generic error callback
 *   InDB.events.onAbort (function) - generic abort callback
 */

/* Begin Defaults */
InDB.database.version = 1;
InDB.debug = false;
InDB.events.onComplete = function ( e ) {
	if ( !!InDB.debug ) {
		console.log ( "IndexedDB request completed", e );
	}
};
InDB.events.onSuccess = function ( e ) {
	if ( !!InDB.debug ) {
		console.log ( "IndexedDB request successful", e );
	}
};
InDB.events.onError = function ( e ) {
	if ( !!InDB.debug ) {
		console.log ( "IndexedDB request errored", e );
	}
};

InDB.events.onAbort = function ( e ) {
	if ( !!InDB.debug ) {
		console.log ( "IndexedDB request aborted", e );
	}
};

InDB.events.onBlocked = function ( e ) {
	if ( !!InDB.debug ) {
		console.log ( "IndexedDB request blocked", e );
	}
};

/* End Defaults */

/* Begin Onload */
//jQuery document.load callback TK
/* End Onload */


/**
 * Actions:
 *  InDB_database_loaded - The database is loaded into the InDB.db namespace; no guarantee that object stores exist if a fresh install
 *  InDB_database_created - Database is created for the first time
 *  InDB_stores_load_{success|error|abort} - Database is loaded and all collections have been created
 *  InDB_store_created_{success|error|abort} - Response to an attempt at creating an object store
 *  InDB_database_already_loaded - a specific type of InDB_database_load_error
 *  InDB_store_already_exists - a specific type of InDB_store_created_error
 **/
 /* End Actions */

/* Begin Functions */

/* Begin Event Methods */

/* binds a callback method to new events */
InDB.bind = function ( event_name, callback_method ) {
	//TODO: assert argument types and validity
	jQuery( InDB ).bind( event_name, callback_method );
}

/* triggers a new event */
InDB.trigger = function ( event_name, context ) {
	//TODO: assert argument types and validity
	jQuery( InDB ).trigger( event_name, context );
}


/* Begin InDB Methods */
/**
 * InDB.browserSupported( )  > support level (int): [ -1, 0, 1 ]
 *  Checks to see if IndexedDB is supported
 *  returns 1 if fully supported, 0 if supported w/fixes, and -1 if unsupported
 **/




/* Create object stores after the database is created */
InDB.bind( 'InDB_do_database_load', function ( event, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_database_load', event, context );
	}

	/* Setup */

	var name = context.name;
	var description = context.description;
	var on_success = context.on_success;
	var on_error = context.on_error;
	var on_abort = context.on_abort;

	/* Assertions */

	// Assert that the database has a name
	if ( !InDB.assert( !InDB.isEmpty( name ), 'Database must have a name' ) ) {
		return;
	}

	/* Request */

	InDB.database.load( name, description, on_success, on_error, on_abort );

} );




/* Bug (sort of): The InDB.db namespace means that it works with only one 
 * IndexedDB database at a time. */
/* This function is indempodent (you can run it multiple times and it won't do anything */
InDB.database.load = function ( name, description, on_success, on_error, on_abort ) {

	/* Begin Debug */
	if ( !!InDB.debug ) {
		console.log ( "InDB.database.load", name, description, on_success, on_error, on_abort );
	}
	/* End Debug */

	var context = { "name": name, "description": description, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };


	/* Assertions */	
	
	if ( "IDBDatabase" === typeof InDB.db && name === InDB.db.name ) {
		on_error( new Error( "Database already loaded" ) );
		InDB.trigger( 'InDB_database_already_loaded', context );
		return;
	}
		
	if ( !InDB.assert( !InDB.isEmpty( name ), "database name cannot be empty" ) ) { 
		return;
	}
	
	if ( !InDB.assert( !InDB.isEmpty( description ), "database description cannot be empty" ) ) { 
		return;
	}

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}
	
	/* Action */
	InDB.trigger( 'InDB_database_loading', context );
	
	/* Request Responses */

	if ( "undefined" !== typeof InDB.db && name === InDB.db.name ) {
		InDB.trigger( 'InDB_database_load_success', context );
		InDB.trigger( 'InDB_stores_load_success', context );
	} else {
		var open_request = window.indexedDB.open( name, description );
		open_request.onsuccess = function ( event ) {
			InDB.db = event.target.result;
			context[ 'event' ] = event;
			on_success( context );
			if ( isNaN( InDB.db.version ) ) {
				InDB.trigger( 'InDB_database_load_success', context );
				InDB.trigger( 'InDB_database_created_success', context );
				/* Database is unversioned, so create object stores */
				InDB.trigger( 'InDB_stores_load_success', context );
			} else {
				InDB.trigger( 'InDB_database_load_success', context );
				InDB.trigger( 'InDB_stores_load_success', context );
			}
		}
		open_request.onerror = function ( event ) {
			context[ 'event' ] = event;
			on_error( context );
			InDB.trigger( 'InDB_database_load_error' );
		}
		open_request.onabort = function ( event ) {
			context[ 'event' ] = event;
			on_abort( context );
			InDB.trigger( 'InDB_database_load_error' )
		}
	}
}

InDB.checkBrowser = function () {
	InDB.trigger( 'InDB_checking_browser' );		
	var result = -1;
	// the support check
	if ( !!window.webkitIndexedDB || !!window.mozIndexedDB ) {
		result = 0;
	} else if (!!window.indexedDB ) {
		result = 1;
	}
	//TODO: Allow filter
	//result = InDB.trigger( 'Indb_did_browserSupported', { "result": result } );
	InDB.trigger( 'InDB_checked_browser', { "result": result } );
	return result;
}

/**
 * InDB.assert( statement, string, string ) - handy little tool for unit tests
 * statement (mixed): whatever you want to evaluate
 * warn_level (string): log, alert or *error (*default) 
 *
 **/
InDB.assert = function ( statement, error_message, warn_level ) {

	error_message = ( !!error_message ) ? error_message : "False assertion";
	result = false;
	switch( warn_level ) {
		case 'log':
			( statement ) ? result = true : console.log ( error_message );
			break;
		case 'alert': 
			( statement ) ? result = true : alert( error_message );
			break;
		default: 
			if ( statement ) { 
				result = true;
			} else {
				console.log( error_message );
				throw new Error( error_message );
			}
			break;
	}
	return result;
}


/* InDB.isEmpty ( mixed var ) -> bool
 * Checks whether a variable has a value */
InDB.isEmpty = function ( mixed_var ) {
	if ( !!InDB.debug && "verbose" === InDB.debug ) {
		console.log ( '"undefined" !== typeof mixed_var', "undefined" !== typeof mixed_var );
		console.log ( 'null !== mixed_var', null !== mixed_var );
		console.log ( '"" !== mixed_var', "" !== mixed_var );
		console.log ( '!!mixed_var', !!mixed_var );
	}
	return ( "undefined" !== typeof mixed_var && null !== mixed_var && "" !== mixed_var && !!mixed_var ) ? false : true;
}

InDB.isString = function ( mixed_var ) {
	console.log( "checking string for ", mixed_var, typeof mixed_var );
	return InDB.isType( "string", mixed_var );
}

InDB.isFunction = function ( mixed_var ) {
	return InDB.isType( "function", mixed_var );
}

InDB.isNumber = function ( mixed_var ) {
	return InDB.isType( "number", mixed_var );
}

InDB.isBoolean = function ( mixed_var ) {
	return InDB.isType( "boolean", mixed_var );
}

InDB.isType = function ( type, mixed_var ) {
	return ( type !== typeof mixed_var ) ? false : true;
}

/* InDB.fixBrowser( ) -> null 
 * Sets up expermental interfaces if necessary. For use when a browser has not yet implemented the native (window.IndexedDB) dom interface, which is detectable if InDB.browser_supported returns -1. */
InDB.fixBrowser = function () {
	InDB.trigger( 'doing_fixBrowser' );		
	if (typeof window.webkitIndexedDB !== "undefined") {
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
}

/* End InDB Methods */

InDB.index.exists = function ( store, index ) {
	var store = InDB.transaction.create( store );
	var indexes = store.indexNames;
	for( i=0; i< indexes.length; i++ ) {
		if ( name === indexes[i] ) {
			return true;
		}
	}
	return false;
}


/* Begin Object Store Methods */

InDB.store.exists = function ( name ) {
/*	if( "function" === typeof InDB.db.objectStores.contains ) {
		return InDB.db.objectStores[ 'contains' ]( name ); //TODO: #Question: Not in IndexedDB spec?
	} */
	for( i=0; i<InDB.db.objectStoreNames.length; i++ ) {
		if ( name === InDB.db.objectStoreNames[i] ) {
			return true;
		}
	}
	return false;
}



/* Create object stores after the database is created */
InDB.bind( 'InDB_do_stores_create', function ( event, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_create_stores', event, context );
	}

	/* Setup */

	var stores = context.stores;
	var on_success = context.on_success;
	var on_error = context.on_error;
	var on_abort = context.on_abort;

	/* Assertions */

	// Assert that the database is already loaded
	if ( !InDB.assert( InDB.db !== 'Object', 'Database not loaded' ) ) {
		if ( !!InDB.debug ) {
			console.log ( 'Database created', event, context );
		}
	}

	/* Request */

	InDB.stores.create( stores, on_success, on_error, on_abort );

} );


InDB.stores.create = function ( stores, on_success, on_error, on_abort ) {

	var context = { 'stores': stores, 'on_success': on_success, 'on_error': on_error, 'on_abort': on_abort }; 
	//TODO: Assertions
	for( store in stores ) {

		console.log('store',store);
		console.log('options',stores[store]);
		var options = stores[ store ];

		if ( InDB.isString( options ) ) {
			/* options object is really a string
                         * recast options var from a string to a
                         * real deal options object */
			options = InDB.store.options( options );
		}
		if ( !InDB.store.exists( store ) ) {
			/* Setup */
			console.log('Store doesn\'t yet exist', store );
			//TODO: #Cleanup; if/else logic here is a little muddy (why the empty_key var?)
			var key, autoinc_key, empty_key, unique;
			if( "undefined" !== typeof options && !InDB.isEmpty( options.key ) ) {
				key = options.key;
				unique = options.unique;
				autoinc_key = options.incrementing_key;
				empty_key = InDB.isEmpty( key );
			} else {
				for( attrib in options ) {
					// Don't want prototype attributes
					if( options.hasOwnProperty( attrib ) ) {
						key = attrib;
						unique = options[ attrib ];
						autoinc_key = false;
					}
				}
			}

			/* Defaults */

			if ( "undefined" === typeof unique || InDB.isBoolean( unique ) ) { 
				unique = false; 
			}

			if ( "undefined" === typeof autoinc_key || InDB.isBoolean( autoinc_key ) ) { 
				autoinc_key = false; 
			}

			/* Assertions */

			InDB.assert( ( empty_key || InDB.isString( key ) ), 'Key needs to be a string' );  
			InDB.assert( ( InDB.isBoolean( autoinc_key ) ), 'Autoinc_key (whether the key uses a generator) needs to be a boolean' ); 

			/* Debug */

			if( !!InDB.debug ) {
				console.log( 'InDB.stores.create calling InDB.store.create', store, key, autoinc_key, on_success, on_error, on_abort );
			}

			/* Request */
				
			InDB.store.create( store, key, autoinc_key, unique, on_success, on_error, on_abort );

		}
	}
};


InDB.store.options = function ( key, autoinc_key ) {
	//TODO: Assertions key is valid string; autoinc_key is bool (isBoolean?)
	var obj = { 
		'keyPath': ( !!key ) ? key : null
		//, autoIncrement: ( !!key && autoinc_key ) ? true : false
	};
	return obj;
}

/* Create object stores after the database is created */
InDB.bind( 'InDB_do_store_create', function ( event, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_create_store', event, context );
	}

	/* Setup */

	var name = context.name;
	var key = context.key;
	var autoinc_key = context.incrementing_key;
	var unique = context.unique;
	var on_success = context.on_success;
	var on_error = context.on_error;
	var on_abort = context.on_abort;
	var on_blocked = context.on_blocked;

	/* Assertions */

	// Assert that the database is already loaded
	if ( !InDB.assert( InDB.db !== 'Object', 'Database not loaded' ) ) {
		if ( !!InDB.debug ) {
			console.log ( 'Database created', event, context );
		}
	}

	/* Request */
	
	InDB.store.create( name, key, autoinc_key, unique, on_success, on_error, on_abort, on_blocked );

} );


/* return true if request is successfully requested (no bearing on result)
/* autoinc_key defaults to false if a key is specified;
   key gets set to "key" and autoincrements when key is not specified */
InDB.store.create = function ( name, key, autoinc_key, unique, on_success, on_error, on_abort, on_blocked ) {
	
	/* Debug */
	
	console.log('InDB.store.create!@', name, key, autoinc_key, unique, on_success, on_error, on_abort );

	if( !!InDB.debug ) {
		console.log ( "InDB.store.create", name, key, autoinc_key, on_success, on_error, on_abort );
	}

	/* Assertions */	

	if ( !InDB.assert( !InDB.isEmpty( name ), "object store name should not be empty" ) ) { 
		return false;
	}

	if ( !InDB.assert( !InDB.store.exists( name ) , "object store should not already exist" ) ) { 
		return false;
	}

	// TODO: #Question: Is this true?
	if ( !InDB.assert( !InDB.isEmpty( key ), "object store needs a key" ) ) { 
		return false;
	}

	console.log('r1');
	var keyPath = {};

	if ( !key ) {
		autoinc_key = false;
	} else {
		keyPath = { "keyPath": key };	
	}

	if ( !autoinc_key ) {
		autoinc_key = false;
	}

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}
	if ( "undefined" === typeof on_blocked ) {
		on_blocked = InDB.events.onBlocked;
	}
	
	var context =  { "name": name, "keyPath": keyPath, "autoinc_key": autoinc_key };
	
	/* Debug */
	
	if( !!InDB.debug ) {
		console.log( 'InDB.store.create context', context );
	}

	// Database changes must happen w/in a setVersion transaction
	var version = parseInt( InDB.db.version, 10 );
	version = ( isNaN( version ) ) ? 1 : version + 1;
	
	var setVersionRequest = InDB.db.setVersion( version );

	setVersionRequest.onsuccess = function ( event ) {
		try {
			//missing autoinc_key as third arg
			InDB.db.createObjectStore( name, keyPath );
			// not reachable when createObjectStore throws an error
			context[ 'event' ] = event;
			on_success( context );
			InDB.trigger( "InDB_store_created_success", context );
		} catch( error ) {
			// createdObject store threw an error 
			context[ 'error' ] = error;
			on_error( context );
			InDB.trigger( "InDB_store_created_error", context );
			//if already created, then the store already exists
			if ( IDBDatabaseException.CONSTRAINT_ERR === error.code ) {
				InDB.trigger( "InDB_store_already_exists", context );
			}
		}
	};

	setVersionRequest.onblocked = function ( event ) {
		context[ 'event' ] = event;
		on_block( context );
		InDB.trigger( "InDB_store_created_error", context );
	};

	setVersionRequest.onerror = function ( event ) {
		context[ 'event' ] = event;
		on_error( context );
		InDB.trigger( "InDB_store_created_error", context );
	};

	setVersionRequest.onabort = function ( event ) {
		context[ 'event' ] = event;
		on_abort( context );
		InDB.trigger( "InDB_store_created_abort", context );
	};

}


InDB.bind( 'InDB_do_indexes_create', function ( event, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_create_indexes', event, context );
	}

	/* Setup */

	var indexes = context.indexes;
	var on_success = context.on_success;
	var on_error = context.on_error;
	var on_abort = context.on_abort;

	/* Assertions */

	// Assert that the database is already loaded
	if ( !InDB.assert( InDB.db !== 'Object', 'Database not loaded' ) ) {
		return;
	}

	/* Request */
	
	InDB.indexes.create( indexes, on_success, on_error, on_abort );

} );

InDB.indexes.create = function ( stores, on_success, on_error, on_abort ) {
	var context = { 'indexes': stores, 'on_success': on_success, 'on_error': on_error, 'on_abort': on_abort }; 
	//TODO: Assertions
	for( store in stores ) {
		//TODO: Cache vars to prevent wasted nested lookups
		for( index in stores[store] ) {
			if( stores[store].hasOwnProperty( index ) ) {

				var options = stores[store][index];
				var key, unique, empty_key;
				var name = index;

				if ( !InDB.index.exists( store, index ) ) {
					//TODO: Cleanup
					if( "undefined" !== typeof options && !InDB.isEmpty( options.key ) ) {
						key = options.key;
						unique = options.unique;
					} else {
						for( attrib in options ) {
							// Don't want prototype attributes
							if( options.hasOwnProperty( attrib ) ) {
								key = attrib;
								unique = options[ attrib ];
								console.log( 'setting key',key);
								console.log( 'setting key unique',unique);
							}
						}
					}
				}
			}

			if ( "undefined" === typeof unique || !InDB.isBoolean( unique ) ) { 
				unique = false; 
			}

			/* Assertions */
			
			InDB.assert( !InDB.isEmpty( key ), 'Must provide an index key' );  
			InDB.assert( ( InDB.isBoolean( unique ) ), 'Unique key value must be a boolean' );

			/* Debug */

			if( !!InDB.debug ) {
				console.log( 'InDB.indexes.create calling InDB.index.create', store, key, name, unique, on_success, on_error, on_abort );
			}

			/* Request */
			
			InDB.index.create( store, key, name, unique, on_success, on_error, on_abort );

		
			
		}
	}
};


//context.store, context.key, context.index, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_index_create', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_index_create', row_result, context );
	}

	/* Assertions */
	if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide a store for index' ) ) {
		return;
	}
			
	if ( !InDB.assert( !InDB.isEmpty( context.key ), 'Must provide a key for index' ) ) {
		return;
	}
	
	if ( !InDB.assert( !InDB.isEmpty( context.name ), 'Must provide a name for index' ) ) {
		return;
	}


	/* Inovation */

	InDB.index.create( context.store, context.key, context.name, context.unique, context.on_success, context.on_error, context.on_abort );
} );


/* unique defaults to false if not present */
InDB.index.create = function ( store, key, name, unique, on_success, on_error, on_abort ) {
	
	/* Debug */

	if( !!InDB.debug ) {
		console.log( 'InDB.index.create', store, key, name, unique, on_success, on_error, on_abort );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide a store for index' ) ) {
		return;
	}
			
	if ( !InDB.assert( !InDB.isEmpty( key ), 'Must provide a key for index' ) ) {
		return;
	}
	
	if ( !InDB.assert( !InDB.isEmpty( name ), 'Must provide a name for index' ) ) {
		return;
	}

	/* Defaults */	

	if ( "undefined" === typeof unique ) {
		unique = false;	
	}
	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "key": key, "name": name, "unique": unique, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Request */

	// Database changes need to happen from w/in a setVersionRequest
	var version = ( parseInt( InDB.db.version, 10 ) ) ? parseInt( InDB.db.version, 10 ) : 0;
        var setVersionRequest = InDB.db.setVersion( version );
	console.log('index setVersion setup', setVersionRequest, version);
	/* Request Responses */

	setVersionRequest.onsuccess = function ( event ) {
		var result = event.target.result;
		var databaseTransaction = result.objectStore( store );
		try {
			console.log('attempting to create using db tx', databaseTransaction);
			databaseTransaction.createIndex( name, key, { 'unique': unique } );
			on_success( event );
		} catch ( error ) {
			console.log( error );
		}
	};

	setVersionRequest.onerror = function ( event ) {
		context[ 'event' ] = event;
		on_error( context );
	};

	setVersionRequest.onabort = function ( event ) {
		context[ 'event' ] = event;
		on_abort( context );
	};

}

//context.store, context.key, context.index, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_index_delete', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_index_delete', row_result, context );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide a store for index' ) ) {
		return;
	}
			
	if ( !InDB.assert( !InDB.isEmpty( context.name ), 'Must provide a name for index' ) ) {
		return;
	}

	/* Inovation */

	InDB.index.delete( context.store, context.name, context.on_success, context.on_error, context.on_abort );

} );


/* unique defaults to false if not present */
InDB.index.delete = function ( store, name, on_success, on_success, on_abort ) {
	
	/* Debug */

	if( !!InDB.debug ) {
		console.log( 'InDB.index.delete', store, name, on_success, on_error, on_abort );
	}

	/* Assertions */	

	if ( !InDB.assert( !InDB.isEmpty( store ), "object store name cannot be empty" ) ) { 
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( name ), "index name cannot be empty" ) ) { 
		return;
	}

	/* Defaults */	

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "name": name, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Request */

	// Database changes need to happen from w/in a setVersionRequest
	var version = ( parseInt( InDB.db.version, 10 ) ) ? parseInt( InDB.db.version, 10 ) : 0;
        var setVersionRequest = InDB.db.setVersion( version );

	/* Request Responses */

	setVersionRequest.onsuccess = function ( event ) {
	
		var result = event.target.result;
		var databaseTransaction = result.objectStore( store );
		console.log( databaseTransaction );
		databaseTransaction.deleteIndex( name );

		databaseTransaction.onsuccess = function ( event ) {
			context[ 'event' ] = event;
			on_success( context );
			InDB.trigger( 'index_created_success', context );
		};

		databaseTransaction.onerror = function ( event ) {
			context[ 'event' ] = event;
			on_error( context );
			InDB.trigger( 'index_created_error', context );
		};

		databaseTransaction.onabort = function ( event ) {
			context[ 'event' ] = event;
			on_abort( context );
			InDB.trigger( 'index_created_abort', context );
		};		

	};

	setVersionRequest.onerror = function ( event ) {
		context[ 'event' ] = event;
		on_error( context );
	};

	setVersionRequest.onabort = function ( event ) {
		context[ 'event' ] = event;
		on_abort( context );
	};

}

InDB.database.open = function ( name, description, on_success, on_error, on_abort ) {

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "name": name, "description": description, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */

	InDB.trigger( 'InDB_open_database', context );

	/* Request */

	var open_database_request = window.indexedDB.open( name, description );

	/* Request Responses */

	database_open_request.onsuccess = function ( event ) {

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_success( context );

		/* Action */

		InDB.trigger( 'InDB_open_database_success', context );

	};

	database_open_request.onerror = function ( event ) {
		
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_error( context );

		/* Action */

		InDB.trigger( 'InDB_open_database_error', context );

	}

	database_open_request.onabort = function ( event ) {

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_abort( context );

		/* Action */

		InDB.trigger( 'InDB_open_database_abort', context );

	}

}

/**
 * Transactions
 *
 **/

/* Transaction types */
InDB.transaction.read = function () {
	return IDBTransaction.READ_ONLY;
} 
InDB.transaction.read_write = function () {
	return IDBTransaction.READ_WRITE;
} 
InDB.transaction.write = function () {
	return IDBTransaction.READ_WRITE;
} 

/* Transaction factory */
InDB.transaction.create = function ( database, type, on_complete, on_error, on_abort ) {
	InDB.trigger( 'InDB_create_transaction', { "name": name, "type": type, "on_complete": on_complete, "on_error": on_error, "on_abort": on_abort } );		
	if ( "undefined" === typeof type ) {
		type = IDBTransaction.READ_WRITE;
	}
	if ( "undefined" === typeof timeout ) {
		timeout = 1000;
	}
	if ( "undefined" === typeof on_complete ) {
		on_complete = InDB.events.onComplete;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}
	try {
		if ( !!InDB.debug ) {
			console.log ( "InDB.db.transaction.create", database, type, timeout );
		}
		var transaction = InDB.db.transaction( [ database ], type, timeout );
		transaction.oncomplete = function ( event ) {
			on_complete( event );
			InDB.trigger( 'transaction_complete', { "database": database, "type": type, "timeout": timeout } );
		};
		transaction.onerror = function ( event ) {
			on_error( event );
			InDB.trigger( 'transaction_error', { "database": database, "type": type, "timeout": timeout } );
		};
		transaction.onabort = function ( event ) {
			on_abort( event );
			InDB.trigger( 'transaction_abort', { "database": database, "type": type, "timeout": timeout } );
		};
		return transaction.objectStore( database );
	} catch ( event ) {
		return event;
	};
}


InDB.row.result = function ( event ) {

	if ( "undefined" !== typeof event.result ) {
		return event.result;
	} else {
		return null;
	}
}


InDB.row.value = function ( event ) {
	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.value', event );
	}
	if ( "undefined" !== typeof event && "undefined" !== typeof event.target && "undefined" !== typeof event.target.result ) {
		return event.target.result;
	} else {
		return null;
	}
}


InDB.cursor.result = function ( event ) {
	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.result', event );
	}
	if ( "undefined" !== typeof event.target && "undefined" !== typeof event.target.result ) {
		return event.target.result;
	} else {
		return null;
	}
}


InDB.cursor.value = function ( event ) {
	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.value', event );
	}
	if ( "undefined" !== typeof event.target && "undefined" !== typeof event.target.result ) {
		return event.target.result.value;
	} else {
		return null;
	}
}


InDB.database.errorType = function ( code ) {

	if ( 8 === code ) {
		return "Request aborted";
	} else if ( 4 === code ) {
		return "Already exists";
	} else if ( 13 === code ) {
		return "Deadlock";
	} else if ( 2 === code ) {
		return "Not allowed";
	} else if ( 6 === code ) {
		return "Not allowed";
	} else if ( 3 === code ) {
		return "Not found";
	} else if ( 9 === code ) {
		return "Read only";
	} else if ( 10 === code ) {
		return "Application failure";
	} else if ( 11 === code ) {
		return "Data serialization error";
	} else if ( 12 === code ) {
		return "Timeout";
	} else if ( 7 === code ) {
		return "Transaction inactive";
	} else if ( 11 === code ) {
		return "Temporary issue";
	} else if ( 1 === code ) {
		return "Unknown error";
	}

}


/* Key Ranges */

/* Key range helpers */
InDB.range.only = function ( value ) {
	return InDB.range.get( value, null, null, null, null );
}
InDB.range.left = function ( left_bound ) {
	return InDB.range.get( null, left_bound, null, false, null );
}
InDB.range.left_open = function ( left_bound ) {
	return InDB.range.get( null, left_bound, null, true, null );
}
InDB.range.right = function ( right_bound ) {
	return InDB.range.get( null, null, right_bound, null, false );
}
InDB.range.right_open = function ( right_bound ) {
	return InDB.range.get( null, null, right_bound, null, true );
}

/* returns an IDBKeyRange given a range type
 * returns false if type is not valid;
 * valid types: bound, leftBound, only, rightBound */
/* uses duck typing to determine key type */
/* more info: https://developer.mozilla.org/en/indexeddb/idbkeyrange*/
InDB.range.get = function ( value, left_bound, right_bound, includes_left_bound, includes_right_bound ) {
	if ( !!InDB.debug ) {
		console.log ( 'InDB.range.get', value, left_bound, right_bound, includes_left_bound, includes_right_bound );
	}
	if ( !!left_bound && !!right_bound && !!includes_left_bound && !!includes_right_bound ) {	
		return IDBKeyRange.bound( left_bound, right_bound, includes_left_bound, includes_right_bound );	
	} else if ( !!left_bound && !!includes_left_bound ) {
		return IDBKeyRange.lowerBound( left_bound, includes_left_bound );
	} else if ( !!right_bound && !!includes_right_bound ) {
		return IDBKeyRange.upperBound( right_bound, includes_right_bound );
	} else if ( false === value || !!value ) {
		return IDBKeyRange.only( value );
	}  else {
		return false;
	}
}


//context.store, context.key, context.index, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_row_get', function( row_result, context ) {
	
	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_row_get', row_result, context );
	}

	/* Assertions */
	if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide an object store' ) ) {
		return;
	}
		
	if ( !InDB.assert( !InDB.isEmpty( context.key ), 'Must provide a range to get' ) ) {
		return;
	}

	/* Inovation */

	InDB.row.get( context.store, context.key, context.index, context.on_success, context.on_error, context.on_abort );
} );


InDB.row.get = function ( store, key, index, on_success, on_error, on_abort ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.get', store, key, index, on_success, on_error, on_abort );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}
		
	if ( !InDB.assert( !InDB.isEmpty( key ), 'Must provide a range to get' ) ) {
		return;
	}

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	index = ( InDB.isEmpty( index ) ) ? index : null;

	/* Context */

	var context =  { "store": store, "key": key, "index": index, "on_complete": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */

	InDB.trigger( 'InDB_row_get', context );

	/* Transaction */
	
	var transaction = InDB.transaction.create( store, InDB.transaction.read() );

	/* Debug */
	
	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.get transaction', transaction );
	}

	/* Request */

	var request = {};

	/* Optional Index */

	if ( "undefined" !== typeof index && null !== index ) {
		var transaction_index = transaction.index( index );
		request = transaction_index.get( key );
	} else {
		request = transaction.get( key );
	}
	
	/* Request Responses */
	
	request.onsuccess = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_success( context );
	
		/* Action */
		
		InDB.trigger( 'InDB_row_get_success', context );

	}

	request.onerror = function ( event ) {
	
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_error( context );

		/* Action */

		InDB.trigger( 'InDB_row_get_error', { "event": event, "store": store, "key": key, "on_success": on_success, "on_error": on_error, "on_abort": on_abort } );

	}
	
	request.onabort = function ( event ) {
	
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_abort( context );
	
		/* Action */
	
		InDB.trigger( 'InDB_row_get_abort', { "event": event, "store": store, "key": key, "on_success": on_success, "on_error": on_error, "on_abort": on_abort } );

	}
}


//context.store, context.key, context.index, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_row_delete', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_row_delete', row_result, context );
	}

        /* Assertions */

        if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide an object store' ) ) {
                return;
        }

        if ( !InDB.assert( !InDB.isEmpty( context.key ), 'Must provide a key to delete' ) ) {
                return;
        }	

	/* Invocation */

	InDB.row.delete( context.store, context.key, context.on_success, context.on_error, context.on_abort );

} );


InDB.row.delete = function ( store, key, on_success, on_error, on_abort ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.delete', store, key, on_success, on_error, on_abort );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( key ), 'Must provide a key to delete' ) ) {
		return;
	}

	/* Context */

	var context = { "store": store, "key": key, "on_complete": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */

	InDB.trigger( 'InDB_row_delete', context );

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}
	
	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.write() );

	/* Debug */
	
	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.delete transaction', transaction );
	}

	/* Request */

	var request = transaction[ "delete" ]( key );

	/* Request Responses */
	
	request.onsuccess = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_success( context );
	
		/* Action */

		InDB.trigger( 'set_success', context );

	}

	request.onerror = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_error( context );
	
		/* Action */

		InDB.trigger( 'set_error', context );

	}

	request.onabort = function ( event ) {	
	
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_abort( event );
	
		/* Action */

		InDB.trigger( 'set_abort', context );

	}

}

//context.store, context.data, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_row_add', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_row_add', row_result, context );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( context.data ), 'Must provide an object to store' ) ) {
		return;
	}

	/* Inovation */

	InDB.row.add( context.store, context.data, context.on_success, context.on_error, context.on_abort );
} );


/* Adds a data object to an object store */
InDB.row.add = function ( store, data, on_success, on_error, on_abort ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.add', store, data, on_success, on_error, on_abort );
	}

        /* Assertions */

        if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
                return;
        }

        if ( !InDB.assert( !InDB.isEmpty( data ), 'Must provide an object to store' ) ) {
                return;
        }

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "data": data, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */

	InDB.trigger( 'InDB_row_add', context );

	if ( !!InDB.debug ) {
		console.log( 'InDB_row_add', context );
	}
	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.read_write() );
	
	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.add transaction', data, transaction );
	}

	//use this[ 'format' ] for function invocation to avoid a Closure compiler error
	try {
		var request = transaction[ 'add' ]( data );
		request.onsuccess = function ( event ) {	

			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_success( context );
	
			/* Action */

			InDB.trigger( 'InDB_row_add_success', context );

		}

		request.onerror = function ( event ) {
	
			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_error( context );
	
			/* Action */

			InDB.trigger( 'InDB_row_add_error', context );

		}

		request.onabort = function ( event ) {

			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_abort( context );

			/* Action */

			InDB.trigger( 'InDB_row_add_abort', context );

		}

	} catch( event ) {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( event );
			console.log ( 'errorType', InDB.database.errorType( event.code ) );
		}	
		
		/* Context */

		context[ 'event' ] = event;
			
		/* Action */

		InDB.trigger( 'InDB_row_add_error', context );

	}
}


//context.store, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_store_clear', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_store_clear', row_result, context );
	}

        /* Assertions */
        
        if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide an object store' ) ) {
                return; 
        }       

	/* Invocation */

	InDB.store.clear( context.store, context.on_success, context.on_error, context.on_abort );
} );


/* Clears an object store of any objects */
InDB.store.clear = function ( store, on_success, on_error, on_abort ) {

	/* Debug */
	
	console.log ( 'InDB.store.clear', store, on_success, on_error, on_abort );	

        /* Assertions */
        
        if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
                return; 
        }       

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };
	
	/* Action */

	InDB.trigger( 'InDB_store_clear', context );

	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.read_write() );

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.store.clear transaction', transaction );
	}

	/* Request */

	//use this[ 'format' ] for function invocation to avoid a Closure compiler error
	var request = transaction[ 'clear' ];

	/* Request Responses */

	request.onsuccess = function ( event ) {	
		
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_success( event );

		/* Action */

		InDB.trigger( 'InDB_store_clear_success', context );

	}

	request.onerror = function ( event ) {
		
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_error( event );

		/* Action */

		InDB.trigger( 'InDB_row_put_error', context );

	}

	request.onabort = function ( event ) {
		
		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_abort( event );
		
		/* Action */

		InDB.trigger( 'InDB_row_put_abort', context );

	}
}


//context.store, context.data, context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_row_put', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_row_put', row_result, context );
	}

        /* Assertions */
        
        if ( !InDB.assert( !InDB.isEmpty( context.store ), 'Must provide an object store' ) ) {
                return; 
        }       

        if ( !InDB.assert( !InDB.isEmpty( context.data ), 'Must provide an object to store' ) ) {
                return; 
        }       

	/* Invocation */

	InDB.row.put( context.store, context.data, context.key, context.on_success, context.on_error, context.on_abort );
} );


/* Puts a data object to an object store */
InDB.row.put = function ( store, data, key, on_success, on_error, on_abort ) {

	/* Debug */
	
	if ( !!InDB.debug ) {
		console.log ( 'InDB.row.put', store, data, key, on_success, on_error, on_abort );	
	}

        /* Assertions */
        
        if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
                return; 
        }       

        if ( !InDB.assert( !InDB.isEmpty( data ), 'Must provide an object to store' ) ) {
                return; 
        }       

	/* Defaults */

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	key = ( !!key ) ? key : null;

	/* Context */

	var context = { "store": store, "key": key, "data": data, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };
	
	/* Action */

	InDB.trigger( 'InDB_row_put', context );

	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.read_write() );

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_row_put transaction', transaction );
	}

	//use this[ 'format' ] for function invocation to avoid a Closure compiler error
	try {


		/* Request */
		var request;
		if( !!key ) {
			request = transaction[ 'put' ]( data, key );
		} else { 
			request = transaction[ 'put' ]( data );
		}


		/* Request Responses */

		request.onsuccess = function ( event ) {	

			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_success( event );

			/* Action */

			InDB.trigger( 'InDB_row_put_success', { "event": event, "store": store, "data": data, "key": key, "on_success": on_success, "on_error": on_error, "on_abort": on_abort } );

		}

		request.onerror = function ( event ) {

			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_error( event );

			/* Action */

			InDB.trigger( 'InDB_row_put_error', { "event": event, "store": store, "data": data, "key": key, "on_success": on_success, "on_error": on_error, "on_abort": on_abort } );

		}

		request.onabort = function ( event ) {

			/* Context */

			context[ 'event' ] = event;
	
			/* Callback */

			on_abort( event );
			
			/* Action */

			InDB.trigger( 'InDB_row_put_abort', { "event": event, "store": store, "data": data, "key": key, "on_success": on_success, "on_error": on_error, "on_abort": on_abort } );

		}

	} catch( error ) {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'errorType', InDB.database.errorType( error.code ) );
		}

		/* Context */

		context[ 'error' ] = error;

		on_error( context );
	
	}
}


InDB.bind( 'InDB_do_cursor_get', function( row_result, context ) {
	
	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_cursor_get', row_result, context );
	}

	/* Setup */

	var store = context.store; // Required
	var index = context.index; // Optional
	var keyRange = context.keyRange; // Required
	var on_success = context.on_success; // Optional; No default
	var on_error = context.on_error; // Optional; No default
	var on_abort = context.on_abort; // Optional; No default

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( keyRange ), 'Must provide keyRange' ) ) {
		return;
	}


	/* Defaults */

	index = ( !InDB.isEmpty( context.index ) ) ? context.index : null;

	/* Invocation */
	
	InDB.cursor.get( store, index, keyRange, on_success, on_error, on_abort );

} );


InDB.cursor.get = function ( store, index, keyRange, on_success, on_error, on_abort ) {

	/* Debug */
	if ( !!InDB.debug ) {	
		console.log ( 'InDB.cursor.get', store, index, keyRange, on_success, on_error, on_abort );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( 'undefined' !== typeof keyRange, 'keyRange must be an IDBKeyRange' ) ) {
		return;
	}

	/* Defaults */

	index = ( !InDB.isEmpty( index ) ) ? index : null;

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}

	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}

	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context =  { "store": store, "index": index, "keyRange": keyRange, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Debug */
	
	if( !!Buleys.debug ) {
		console.log( 'indb.js > InDB.cursor.get() > Doing InDB_cursor_get', context );
	}	
	
	/* Action */

	InDB.trigger( 'InDB_cursor_get', context );
	
	try {

		/* Transaction */

		var transaction = InDB.transaction.create ( store, InDB.transaction.read_write() );

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'InDB.cursor.get transaction', transaction, index, typeof index );
		}

		/* Request */

		var request;
		
		/* Optional Index */

		if ( !InDB.isEmpty( index ) ) {

			/* Debug */

			if ( !!InDB.debug ) {
				console.log ( 'transaction_index.openCursor (index)', transaction, index, keyRange );
			}

			// Using index
			var transaction_index = transaction.index( index );

			/* Request */

			request = transaction_index.openCursor( keyRange );

		} else {

			/* Debug */

			if ( !!InDB.debug ) {
				console.log ( 'transaction.openCursor (no index)', transaction, keyRange );
			}

			// No index

			/* Request */

			request = transaction.openCursor( keyRange );

		}

		/* Request Responses */

		request.onsuccess = function ( event ) {	

			/* Debug */

			if ( !!InDB.debug ) {
				console.log ( 'cursor.get result', InDB.cursor.result( event ) );
				console.log ( 'cursor.value value', InDB.cursor.value( event ) );
			}

			/* Context */

			context[ 'event' ] = event;

			/* Callback */

			on_success( context ); 

			/* Action */

			InDB.trigger( 'InDB_cursor_row_get_success', context );

			/* Result */
			
			var result = event.target.result;

			if ( !InDB.isEmpty( result ) && "undefined" !== typeof result.value ) {
				// Move cursor to next key
				result[ 'continue' ]();
			}
		}

		request.onerror = function ( event ) {	

			/* Context */

			context[ 'event' ] = event;

			/* Callback */

			on_error( context );

			/* Debug */

			if ( !!InDB.debug ) {
				console.log ( 'Doing InDB_cursor_row_get_error', context );
			}

			/* Action */

			InDB.trigger( 'InDB_cursor_row_get_error', context );

		}

		request.onabort = function ( event ) {	

			/* Context */

			context[ 'event' ] = event;

			/* Callback */

			on_abort( event );
			
			/* Debug */

			if ( !!InDB.debug ) {
				console.log ( 'Doing InDB_cursor_row_get_abort', context );
			}

			/* Action */

			InDB.trigger( 'InDB_cursor_row_get_abort', context );

		}

	} catch ( error ) {

		context[ 'error' ] = error;
		on_error( context );

		if( !!Buleys.debug ) {
			console.log('Error in cursor get row', error );
		}

	}
}

//context.store, context.index, context.keyRange (e.g. InDB.range.left_open( "0" ) ), context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_cursor_update', function( row_result, context ) {
	
	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_cursor_update', row_result, context );
	}

	/* Setup */

	var store = context.store; // Required
	var index = context.index; // Optional; Defaults to null
	var keyRange = context.keyRange; // Required
	var data = context.data; // Required
	var replace = context.replace; // Optional; Defaults to false
	var on_success = context.on_success; // Optional; No default
	var on_error = context.on_error; // Optional; No default
	var on_abort = context.on_abort; // Optional; No default

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( data ), 'Must provide an object' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( keyRange ), 'Must provide keyRange' ) ) {
		return;
	}

	/* Defaults */

	replace = ( InDB.isBoolean( replace ) ) ? replace : false;
	index = ( !InDB.isEmpty( index ) ) ? index : null;

	/* Invocation */

	InDB.cursor.update( store, index, keyRange, data, replace, on_success, on_error, on_abort );

} );


InDB.cursor.update = function ( store, index, keyRange, data, replace, on_success, on_error, on_abort ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.update', store, index, keyRange, data, on_success, on_error, on_abort );
	}


	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( data ), 'Must provide an object' ) ) {
		return;
	}

	if ( !InDB.assert( 'undefined' !== typeof keyRange, 'keyRange must be an IDBKeyRange' ) ) {
		return;
	}

	/* Defaults */

	replace = ( InDB.isBoolean( replace ) ) ? replace : false;
	index = ( !InDB.isEmpty( index ) ) ? index : null;

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "keyRange": keyRange, "index": index, "data": data, "replace": replace, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */

	InDB.trigger( 'InDB_cursor_update', context );
	
	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.read_write() );

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.update transaction', transaction, index, typeof index );
	}

	/* Request */

	var request;

	/* Optional Index */

	if ( "undefined" !== typeof index && !InDB.isEmpty( index ) ) {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'transaction_index.openCursor', index, keyRange );
		}
		
		// Using index
		var transaction_index = transaction.index( index );
	
		/* Request */

		request = transaction_index.openCursor( keyRange );

	} else {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'transaction.openCursor', keyRange );

		}

		// No index

		/* Request */

		request = transaction.openCursor( keyRange );

	}

	/* Request Responses */

	request.onsuccess = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_success( context );

		/* Action */

		InDB.trigger( 'InDB_cursor_row_update_success', context );

		/* Update */
		var update_data = {};
		if ( true === replace ) { 
			update_data = data;
		} else {
			update_data = InDB.cursor.value( event );
			update_data = ( !!update_data ) ? update_data : {};
		}
		for( attr in data ) {
			update_data[ attr ] = data[ attr ];
		}
		
		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'InDB.cursor.update context.data update_data', update_data );
		}

		/* Result */

		var result = event.target.result;
		
		if ( "undefined" !== typeof result && "undefined" !== typeof result.value ) {
			// Update current cursor item
			result[ 'update' ]( update_data );
			// Move cursor to next key
			result[ 'continue' ]();
		}
	}

	request.onerror = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_error( context );

		/* Action */

		InDB.trigger( 'InDB_cursor_row_update_error', context );

	}

	request.onabort = function ( event ) {	

		/* Context */

		context[ 'event' ] = event;

		/* Callback */

		on_abort( context );

		/* Action */

		InDB.trigger( 'InDB_cursor_row_update_abort', context );

	}

}


//context.database, context.index, context.keyRange (e.g. InDB.range.left_open( "0" ) ), context.on_success, context.on_error, context.on_abort
InDB.bind( 'InDB_do_cursor_delete', function( row_result, context ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB_do_cursor_delete', row_result, context );
	}

	/* Setup */

	var store = context.store; // Required
	var keyRange = context.keyRange; // Required
	var on_success = context.on_success; // Optional; No default
	var on_error = context.on_error; // Optional; No default
	var on_abort = context.on_abort; // Optional; No default

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( !InDB.isEmpty( keyRange ), 'Must provide keyRange' ) ) {
		return;
	}

	/* Defaults */

	index = ( !InDB.isEmpty( context.index ) ) ? context.index : null;

	/* Invocation */

	InDB.cursor.delete( store, index, keyRange, context.on_success, context.on_error, context.on_abort );

} );

InDB.cursor.delete = function ( store, index, keyRange, on_success, on_error, on_abort ) {

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.get', store, index, keyRange, on_success, on_error, on_abort );
	}

	/* Assertions */

	if ( !InDB.assert( !InDB.isEmpty( store ), 'Must provide an object store' ) ) {
		return;
	}

	if ( !InDB.assert( 'undefined' !== typeof keyRange, 'keyRange must be an IDBKeyRange' ) ) {
		return;
	}

	/* Defaults */

	index = ( !InDB.isEmpty( index ) ) ? index : null;

	if ( "undefined" === typeof on_success ) {
		on_success = InDB.events.onSuccess;
	}
	if ( "undefined" === typeof on_error ) {
		on_error = InDB.events.onError;
	}
	if ( "undefined" === typeof on_abort ) {
		on_abort = InDB.events.onAbort;
	}

	/* Context */

	var context = { "store": store, "keyRange": keyRange, "index": index, "on_success": on_success, "on_error": on_error, "on_abort": on_abort };

	/* Action */
	
	InDB.trigger( 'InDB_cursor_delete', context );

	/* Transaction */

	var transaction = InDB.transaction.create( store, InDB.transaction.read_write() );

	/* Debug */

	if ( !!InDB.debug ) {
		console.log ( 'InDB.cursor.get transaction', transaction, index, typeof index );
	}

	/* Request */

	var request;
	
	/* Optional Index */

	if ( "undefined" !== typeof index && !InDB.isEmpty( index ) ) {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'InDB.cursor.get transaction_index.openCursor', index, keyRange );
		}

		// Using index
		var transaction_index = transaction.index( index );

		/* Request */
		request = transaction_index.openCursor( keyRange );

	} else {

		/* Debug */

		if ( !!InDB.debug ) {
			console.log ( 'InDB.cursor.get transaction.openCursor', keyRange );
		}
		
		// No index

		/* Request */
		request = transaction.openCursor( keyRange );

	}

	/* Request Responses */

	request.onsuccess = function ( event ) {	

		/* Context */
		
		context[ 'event' ] = event;

		/* Callback */

		on_success( context );

		/* Action */

		InDB.trigger( 'InDB_cursor_row_delete_success', context );

		/* Result */

		var result = event.target.result;

		if ( "undefined" !== typeof result && "undefined" !== typeof result.value ) {
			// Delete current cursor item
			result[ 'delete' ]();
			// Move cursor to next item
			result[ 'continue' ]();
		}
	}
	request.onerror = function ( event ) {	
	
		/* Context */
		
		context[ 'event' ] = event;
	
		/* Callback */

		on_error( context );
		
		/* Action */

		InDB.trigger( 'InDB_cursor_row_delete_error', context );

	}

	request.onabort = function ( event ) {	
	
		/* Context */
		
		context[ 'event' ] = event;
	
		/* Callback */

		on_abort( context );
		
		/* Action */

		InDB.trigger( 'InDB_cursor_row_delete_abort', context );

	}

}

/* End Functions */
var Buleys = {};
/* IndexedDB */
Buleys.db = {};
Buleys.version = 7;
Buleys.database_name = "Buleys-330";
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

Buleys.activity = {};
Buleys.activities = {};

Buleys.socket = {};
Buleys.sockets = {};


var session_token = '';
var debug;
//webkitIDBCursor

$(document).ready(function() {

	var browser_check = InDB.checkBrowser();
	InDB.assert( -1 !== browser_check, 'incompatible browser' );
	if ( 0 === browser_check ) {
		InDB.fixBrowser();
	}

	//set_page_vars();
	//check_login_status();

	if ( isEmpty( Buleys.view ) ) {
		twitter_authentication_detect();
	} else {

		var preflight = get_local_storage( 'twitter_oauth_authenticated' );
		console.log('getting the preflight',preflight, "false" == preflight );
		if( "1" !== preflight ) {

			// Check if Twitter has redirected
	
			twitter_validation_detect();
			if( "0" !== preflight ) {
				// Prepare for oauth
				twitter_preflight();
			};

		}
	}

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

	/*  Activities */
	/*
	var activities = {
		'activities': { 'key': 'id', 'incrementing_key': false, 'unique': true }	
	}

	var activities_idxs = {
		'activities': {
			'actor.id': { 'actor_id': true },
			'object.id': { 'object_id': true },
			'object.url': { 'object_url': false },
			'object.published': { 'object_published': false }
			'verb': { 'verb': true },
			'seen': { 'seen': true },
			'clicked': { 'clicked': true },
			'trashed': { 'trashed': true },
			'archived': { 'archived': true },
			'favorited': { 'favorited': true }
		}
	};

	console.log( activities, activities_idxs );

	InDB.trigger( 'InDB_do_stores_create', { 'stores': activities, 'on_success': function( context ) {
		InDB.trigger( 'InDB_do_indexes_create', { 'indexes': activities_idxs, 'on_complete': function( context2 ) { 
			console.log( 'Activities store loaded', context2 );
		} } );	
	} } );
	*/
	

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

Buleys.socket = Buleys.socket || {};
Buleys.websocket = Buleys.websocket || {};

Buleys.socket = io.connect('http://api.buleys.com');

Buleys.socket.on('connect',function() {
	Buleys.websocket.login();
});

Buleys.socket.on('disconnect',function() {

});

Buleys.socket.on( 'authorized', function( data ) {
	//data= jQuery.parseJSON( data );
	console.log('PROFILE DATA', data );
});


Buleys.websocket.cache = {};

Buleys.socket.on( 'data', function( response ) {
	
	if( response == Buleys.websocket.cache ) {
		return;
	} else {
		Buleys.websocket.cache = response;
	}
	
	response = JSON.parse( response );
//	console.log('DATA type', response.type );

	if( 'tweet' === response.type || 'news' === response.type ) {

		var on_success = function( activity_id ) {
			console.log( 'Buleys.socket.on data success', activity_id );
		};
	
		var on_error = function( error ) {
			console.log( 'Buleys.socket.on data error', error );
		};

		Buleys.activity.add( response.data, on_success, on_error );
	} 
	
} );


Buleys.websocket.login = function() {

	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'place_chicago', 'place_milwaukee', 'company_csco', 'company_jnpr', 'company_ebay', 'place_miami', 'place_los_angeles', 'place_hollywood', 'place_sacramento', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl', 'company_nflx', 'company_yhoo', 'company_aol', 'place_new_york', 'place_san_francisco', 'place_austin', 'place_nashville' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
};

function set_local_storage( set_key, set_value ) {
	jQuery(document).trigger('set_local_storage');
	console.log('set_local_storage', set_key, set_value );
	return Buleys.store.setItem(set_key, set_value);
}
	
function delete_local_storage( key ) {
	jQuery(document).trigger('delete_local_storage');

	return Buleys.store.removeItem( key );
}
	
function get_local_storage( get_key ) {
	jQuery(document).trigger('get_local_storage');

	return Buleys.store.getItem(get_key);
}

function set_local_storage_batch( dictionary ) {
	for( item in dictionary ) {
		//console.log('item', item);
		//console.log('dict', dictionary);
		if( dictionary.hasOwnProperty( item ) ) {	
			//console.log('setting item', item, dictionary[item] );
			set_local_storage( item, dictionary[ item ] );
		}
	}
}

function delete_local_storage_batch( keys ) {
	for( var i = 0; i <= keys.length; i++ ) {
		console.log('deleting', keys[i] );
		delete_local_storage( keys[ i ] );
	}
}


	$(window).bind("popstate", function ( e ) {

		console.log(location.pathname);
		if (!Buleys.session.database_is_open) {
		} else {
			reload_results();
			Buleys.session.database_is_open = true;
		}

	});

	function isEmpty( value ) {
		if( null !== value && "" !== value && "undefined" !== typeof value ) {
			return false;
		}
		return true;
	}
	
	function load_page_title_info( page_info ) {
		jQuery(document).trigger('load_page_title_info');

	console.log("LOAD PAGE TITLE:",page_info);
	// && jQuery("a .topic_name").length > 0 && !jQuery("#page_title").indexOf( "<a href='/" + page_info.type + "/" + page_info.key + "' class='topic_name'>" + page_info.name + "</a>")
		if (typeof page_info.name !== 'undefined' ) {
			jQuery("#page_title").html("<a href='/" + page_info.type + "/" + page_info.key + "' class='topic_name'>" + page_info.name + "</a>");
		}
		if (typeof page_info.subsector != 'undefined' && jQuery("a .sector_name").length > 0 && !jQuery("#subtitle_1").indexOf( "<a href='/sector/" + getURLSlug(page_info.subsector).toLowerCase() + "' class='sector_name'>" + page_info.subsector + "</a>" ) ) {
			jQuery("#subtitle_1").html("<a href='/sector/" + getURLSlug(page_info.subsector).toLowerCase() + "' class='sector_name'>" + page_info.subsector + "</a>");
		}
	
		if (typeof page_info.sector != 'undefined' && jQuery("a .subsector_name").length > 0 && !jQuery("#subtitle_2").indexOf( "<a href='/sector/" + getURLSlug(page_info.sector).toLowerCase() + "' class='subsector_name'>" + page_info.sector + "</a>" ) ) {
			jQuery("#subtitle_2").html("<a href='/sector/" + getURLSlug(page_info.sector).toLowerCase() + "' class='subsector_name'>" + page_info.sector + "</a>");
		}
	}
	
	function show_loading(  ) {
	jQuery(document).trigger('show_loading');

	
		$("#index").html("<div class='loading'>&nbsp;</div>");
	
	}
	
	function hide_loading(  ) {
	jQuery(document).trigger('hide_loading');

	
		$("#index .loading").hide();
	
	}
	
	
	
	function load_profile_info(  ) {
	jQuery(document).trigger('load_profile_info');

		var data_to_send;
		data_to_send = {
			"method": "get_user_attributes"
		};
	
		$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {
			jQuery("#small_profile").show();
			if (typeof data.display_name != "undefined" && data.display_name != null) {
				jQuery("#small_profile").append("<div id='small_profile_image'><a href='/profile/'><img src='http://www.gravatar.com/avatar/" + data.email_hash + "?s=42'></a></div><div><div id='small_profile_display_name'><a href='/profile/'>" + data.display_name + "</a></div>" + "</div>");
				jQuery.each(data, function ( key, val ) {
					add_or_update_setting(key, val);
				});
			}
		}, dataType = "json");
	
	}
		
	function clear_page(  ) {
	jQuery(document).trigger('clear_page');

		hide_overlay();
		jQuery("#right").html("<ul id='results'></ul>");
		jQuery("#main").html('');
	}

	function load_current_page(  ) {
		jQuery(document).trigger('load_current_page');
		fire_off_request();
		if (Buleys.view.type == "account") {
			disable_hotkeys();
			load_profile_info();
		}

		if (Buleys.view.type !== "account" && Buleys.view.type !== "home" && Buleys.view.type !== "signin" && Buleys.view.type !== "" && Buleys.view.type !== "start" && Buleys.view.type !== "settings" && Buleys.view.type !== "favorites" && Buleys.view.type !== "read" && Buleys.view.type !== "unread" && Buleys.view.type !== "seen" && Buleys.view.type !== "unseen" && Buleys.view.type !== "unarchived" && Buleys.view.type !== "archived") {
			enable_hotkeys();
			console.log('getting follow status');
			get_page_follow_status(Buleys.view.type, Buleys.view.slug);
			/*get_page_subscription_status(Buleys.view.type, Buleys.view.slug);*/
			console.log( 'getting topic info' );
			get_page_topic_info(Buleys.view.type, Buleys.view.slug);
		}
	 	
		if (Buleys.view.type == "settings" || Buleys.view.type == "account") {
	
			disable_hotkeys() ;
	
			//alert('get_settings_page');
			get_settings_page();
	
		} else if (Buleys.view.type == "signin" || "signin" == Buleys.view.type ||  "login" == Buleys.view.type || "register" == Buleys.view.type || "signup" == Buleys.view.type || "start" == Buleys.view.type) {
	
			disable_hotkeys() ;
	
			if (Buleys.view.loaded != "signin") {
				//alert('get_signin');
				get_signin();
			}
	
		} else if (Buleys.view.type == "register") {
	
			disable_hotkeys() ;
	
			//alert('get_registration');
			get_registration();
	
		} else if (Buleys.view.type == "confirm") {
	
			disable_hotkeys() ;
	
			//alert('get_confirmation');
			get_confirmation();
	
		} else if (Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs") {
	
			enable_hotkeys();
			//alert('get_favorites');
			get_favorites(Buleys.view.type, Buleys.view.slug);
	
		} else if (Buleys.view.type == "archive" || Buleys.view.page == "archive" || Buleys.view.page == "archived") {
	
			enable_hotkeys();
			//alert('get_archived');
			get_archived(Buleys.view.type, Buleys.view.slug);
	
		} else if (Buleys.view.type == "trash" || Buleys.view.page == "trash" || Buleys.view.page == "trashed" || Buleys.view.page == "deleted") {
			enable_hotkeys();
			//alert('get_deleted');
			get_deleted(Buleys.view.type, Buleys.view.slug);
		} else if (Buleys.view.type == "read" || Buleys.view.page == "read") {
			enable_hotkeys();
			//alert('get_read');
			get_read(Buleys.view.type, Buleys.view.slug, null, null, false);
		} else if (Buleys.view.type == "unread" || Buleys.view.page == "unread") {
			enable_hotkeys();
			//alert('get_read');
			get_read(Buleys.view.type, Buleys.view.slug, null, null, true);
		} else if (Buleys.view.type == "seen" || Buleys.view.page == "seen") {
			enable_hotkeys();
			//alert('get_seen');
			get_seen(Buleys.view.type, Buleys.view.slug, null, null, false);
		} else if (Buleys.view.type == "unseen" || Buleys.view.page == "unseen") {
			enable_hotkeys();
			//alert('get_seen');
			get_seen(Buleys.view.type, Buleys.view.slug, null, null, true);
		} else if (typeof Buleys.view.page == "undefined" || Buleys.view.page == "" || Buleys.view.page == "home" || Buleys.view.page == "index") {
			enable_hotkeys();
			get_items(Buleys.view.type, Buleys.view.slug);
		} else {
			console.log('getting items!');
			enable_hotkeys();
			get_items(Buleys.view.type, Buleys.view.slug);
		}
	
		Buleys.view.loaded = Buleys.view.type;
		

			
	
	}
	
	function reload_results(  ) {
	jQuery(document).trigger('reload_results');

	
		clear_page();
		set_page_vars();
		load_current_page();
	}

	function set_page_vars(  ) {
	jQuery(document).trigger('set_page_vars');
	
		console.log("Setting page vars: ", location.pathname);
	
		var string_for_split = location.pathname;
		string_for_split = string_for_split.replace(/^\//, "");
		string_for_split = string_for_split.replace(/\/$/, "");
	
		var splitted = string_for_split.split("/");
		Buleys.view.type = splitted[0];
		Buleys.view.slug = splitted[1];
		Buleys.view.page = splitted[2];
	
	}



		jQuery('.defaulttext').live('click', function ( event ) {

			jQuery(this).val('');
			jQuery(this).removeClass('defaulttext');
		});



// Cleverness via: http://papermashup.com/read-url-get-variables-withjavascript/
function get_url_vars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

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
			console.log('twitter.js > add_tweets > each', item );
		}

		add_tweet_to_items_database( item );
		console.log('doing entities');

		var splitted = item.topic.split('_');
		item.entities = [{
			'slug': splitted[1],
			'type': splitted[0],
			'display': null
		}];
		console.log('ENTITIES', item.entities );
		add_categories_to_categories_database(item.link, item.entities );

		send_to_console("<p>Added: <a href='" + item.link + "'>" + item.title + "</a></p>");
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

	jQuery(document).trigger('add_tweet_to_items_database');

	/* Setup */

	var data = get_data_object_for_tweet(item);
	console.log('adding twitt',data );
	/* Callbacks */

	var add_on_success = function ( context_2 ) {

		/* Setup */

		var event2 = context_2.event;

		/* Debug */
		
		if( true === Buleys.debug ) {
			console.log("items.js > add_tweet_to_items_database() > item.entities > ", item.entities );
		}

		// Qualify the view
		// TODO: Better description
		if ( ( Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" ) && ( typeof page === "undefined" || ( page !== "favorites" && page !== "seen" && page !== "read" && page !== "archive" && page !== "trash" ) ) ) {

			// Add the item to the results
			prepend_item_to_results( data );

		}

	};

	var add_on_error = function ( context_2 ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'items', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}

