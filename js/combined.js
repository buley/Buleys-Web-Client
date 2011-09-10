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
	} else if ( !!value ) {
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
 * Archive.js 
 **/

function get_archived( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	if( Buleys.debug ) {
		console.log( 'archive.js > get_archived', type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse );
	}

	jQuery(document).trigger('get_archived');

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Callbacks */

	var categories_on_success = function ( context_1 ) {

		var result = context_1.event.target.result;
		if( !result ) {
			return;
		}
		var item = result.value;
		console.log('categories_on_success link', item.link );


		var categories_on_success_2 = function ( context_2 ) {

			var event1 = context_2.event;
			if ( typeof event1.target.result !== 'undefined' && make_inverse !== true ) {
				
				var item_link = event1.target.result.link;
				console.log('doing row get on', item_link);

				var items_on_success = function ( context_3 ) {
					var event2 = context_3.event;
					if ( typeof event2.target.result !== 'undefined' && typeof event2.target.result.link !== 'undefined' && jQuery( "#" + event2.target.result.link.replace(/[^a-zA-Z0-9-_]+/g, "") ).length <= 0 ) {
						console.log('getting item raw', event2.target.result.link );
						get_item_raw( event2.target.result.link );
					}
				};
				
				var items_on_error = function( context_3 ) {
					console.log('context3',context_3);	
				};

				InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_link, 'on_success': items_on_success, 'on_error': items_on_error } );

			} else if ( make_inverse == true ) {

				var items_on_success = function ( context_3 ) {
					//TODO: rename item_request var
					var item_request = context_3.event.target;

					if (typeof item_request.result !== 'undefined' && item_request.result !== 'undefined' && jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0 ) {

						console.log('getting item raw_2', item_request.result.ilnk );
						get_item_raw(item_request.result.link);

					}

				};

				InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item.link, 'on_success': items_on_success, 'on_error': items_on_error } );
			}

		};

		var categories_on_error_2 = function(event) {
			console.log('category error 2',event );
		};

		InDB.trigger( 'InDB_do_row_get', { 'store': 'archive', 'key': item.link, 'on_success': categories_on_success_2, 'on_error': categories_on_error_2 } );

	};
	
	var categories_on_error = function ( event ) {

	};

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': categories_on_success, 'on_error': categories_on_error } );

}


function archive_item( item_url ) {
	
	/* Action */

	jQuery(document).trigger('archive_item');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	var add_on_success = function ( context ) {
		console.log( 'archived item', context );
	};
	var add_on_error = function ( context ) {
		console.log( 'Error archiving item', context );	
	};

	/* Request */
	
	InDB.trigger( 'InDB_do_row_add', { 'store': 'archive', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}

function check_if_item_is_archived( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_archived');

	var archive_on_success = function ( context) {

		if (typeof item_request.result != 'undefined') {

			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('archived');

		} else {

			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unarchived');

		}

	};

	var archive_on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'archive', 'key': item_url, 'on_success': items_on_success, 'on_error': items_on_error } );

}

function add_item_to_archives_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('add_item_to_archives_database');

	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	var archive_on_success = function ( context ) {

	};

	var archive_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_add', { 'store': 'archive', 'data': data, 'on_success': archive_on_success, 'on_error': archive_on_error } );

}


//TODO: Fix gratuitous args
function unarchive_item( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('unarchive_item');

	var archive_on_success = function ( context ) {

	};

	var archive_on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'archive', 'key': item_url, 'on_success': archive_on_success, 'on_error': archive_on_error } );

}

	
//TODO: Fix gratuitous args
//TODO: remove this function in favor of unarchive_item
function remove_item_from_archives_database( item_url, item_slug, item_type ) {

	jQuery(document).trigger('remove_item_from_archives_database');
	
	unarchive_item( item_url, item_slug, item_type );

}

function get_signin(  ) {

	jQuery(document).trigger('get_signin');

	var session_id = get_local_storage("session_id");
	if (typeof session_id == "undefined" || session_id == null || session_id == "") {
		jQuery("#main").append('<div id="login_prompt"><div id="login_form"><input id="email" type="email" placeholder="Email" name="email" class="defaulttext" required/><br/><input id="password"  type="password" name="password" placeholder="Password" /><br/><br/><a href="#" id="doregistration" class="registrationlink">Register</a> or <a href="#" id="dologinsubmit" class="submitloginform">Login</a></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a></div></div></div>');
	} else {
		jQuery("#main").append("<div id='login_prompt'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
	}
	Buleys.view.loaded = "signin";
}

function get_registration(  ) {
	jQuery(document).trigger('get_registration');

	console.log("get_registration(): ");
}

function get_confirmation(  ) {
	jQuery(document).trigger('get_confirmation');

	console.log("get_confirmation(): ");
}	
	
function submit_registration(  ) {
	jQuery(document).trigger('submit_registration');

	if ($('#password_once').val() == $('#password_twice').val()) {
		var password = $('#password_once').val();
		var first_name = $('#first_name').val();
		var display_name = $('#display_name').val();
		var last_name = $('#last_name').val();
		var address_1 = $('#address_1').val();
		var address_2 = $('#address_2').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var zip = $('#zip').val();
		var country = $('#country').val();
		request_registration(password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country);
	} else {
		alert('Passwords don\'t match');
	}
}

function account_logout(  ) {
	jQuery(document).trigger('account_logout');

	data_to_send = {
		"method": "logout"
	};
	$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {

		if (typeof(data.result) !== 'undefined') {
			delete Buleys.store["session_id"];
			jQuery("#login").fadeIn('fast');
			jQuery("#logout").fadeOut('fast');
		}
	}, "json");
}





function request_login( email, password ) {
	jQuery(document).trigger('request_login');

	password = md5(password);
	var data_to_send;
	data_to_send = {
		"method": "request_login",
		"secret": password,
		"email": email,
		"token": session_token
	};
	$.post("http://api.buleys.com/login", data_to_send, function ( data ) {

		if (data != null && typeof data.result !== 'undefined') {
			if (data.result.toLowerCase() == "failure") {
				console.log('fail');
				send_to_console(data.message);
			} else if (data.result.toLowerCase() == "success") {
				set_local_storage("session_id", data.session_id);
				send_to_console(data.message);
				jQuery("#login_prompt").html('');
				jQuery("#login_prompt").append("Just logged in with session id <code>" + get_local_storage("session_id") + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.");


			}
		} else {
			console.log("request_login(): no data");
		}
	}, "json");


}


function request_registration( password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country ) {
	jQuery(document).trigger('request_registration');


	password = md5(password);

	data_to_send = {
		"method": "request_registration",
		"secret": password,
		"display_name": display_name,
		"first_name": first_name,
		"last_name": last_name,
		"address_1": address_1,
		"address_2": address_2,
		"city": city,
		"state": state,
		"zip": zip,
		"country": country
	};

	$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {

		if (typeof(data.request_status) !== 'undefined') {
			if (data.result.toLowerCase() == "failure") {
				if (typeof(data.message) !== 'undefined') {
					jQuery("#login_status_pane").prepend("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_status_pane").prepend('There was an error. Your account is not confirmed.');
				}
				close_button(jQuery("#login_status_pane"));
			} else if (data.result.toLowerCase() == "success") {
				if (typeof(data.message) !== 'undefined') {
					jQuery("#login_status_pane").html("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_status_pane").html('Your account is confirmed.');
				}
				close_button(jQuery("#login_status_pane"));
			}
		}
	}, "json");


}

function confirm_registration( secret ) {
	jQuery(document).trigger('confirm_registration');


	data_to_send = {
		"method": "confirm_account",
		"secret": secret
	};


	$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {

		if (typeof(data.request_status) !== 'undefined') {
			if (data.result.toLowerCase() == "failure") {
				jQuery("#login_status_pane").html('');


				if (typeof(data.reason) !== 'undefined') {
					jQuery("#login_status_pane").prepend("<p><small>" + data.reason + "<small></p>");
				}

				if (typeof(data.message) !== 'undefined') {
					jQuery("#login_status_pane").prepend("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_status_pane").prepend('There was an error.');
				}

			} else if (data.result.toLowerCase() == "success") {

				if (typeof(data.message) !== 'undefined') {
					jQuery("#login_status_pane").html("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_status_pane").html('Your account is confirmed and logged in.');
				}
/*
				
				*/
				jQuery("#login_status_pane").append('<p><strong>Password</strong>:<input id="password_once"type="password"name="password"/><br/><strong>Password</strong>(again):<input id="password_twice"type="password"name="password_confirm"/></p><p><strong>Public name</strong>:<input id="display_name"type="text"name="display_name"/></p><p id="registration_profile_info"><strong>First Name</strong>: <input id="first_name"type="text"name="first_name"  size="20"/><br/><strong>Last Name</strong>: <input id="last_name"type="text"name="last_name"  size="20"/><br/><strong>Address 1</strong>:<input id="address_1"type="text"name="address_1"/><br/><strong>Apt. #</strong> (optional): <input id="address_2"type="text"name="address_2"/><br/><strong>City</strong>: <input id="city"type="text" name="city" size="20"/><br/><strong>State</strong>: <select id="state" name="state"><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option></select>&nbsp;&nbsp;&nbsp;<strong>Zip</strong>: <input id="zip"type="text"name="zip" size="10"/><br/><strong>Country</strong>: <select id="country" name="country" size="1"><option value="AF">Afghanistan</option><option value="AX">Axland Islands</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua And Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia And Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei Darussalam</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos (Keeling) Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CG">Congo</option><option value="CD">Congo, The Democratic Republic Of The</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote DIvoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value=" Gg">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard Island And Mcdonald Islands</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran, Islamic Republic Of</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle Of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic People\'s Republic Of</option><option value="KR">Korea, Republic Of</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Lao People\'s Democratic Republic</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libyan Arab Jamahiriya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macao</option><option value="MK">Macedonia, The Former Yugoslav Republic Of</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia, Federated States Of</option><option value="MD">Moldova, Republic Of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territory, Occupied</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts And Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint Pierre And Miquelon</option><option value="VC">Saint Vincent And The Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome And Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="CS">Serbia And Montenegro</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia And The South Sandwich Islands</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard And Jan Mayen</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Republic</option><option value="TW">Taiwan, Province Of China</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania, United Republic Of</option><option value="TH">Thailand</option><option value="TL">Timor-Leste</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad And Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks And Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US" selected>United States</option><option value="UM">United States Minor Outlying Islands</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VG">Virgin Islands, British</option><option value="VI">Virgin Islands, U.S.</option><option value="WF">Wallis And Futuna</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select><br/></p>');


				request_registration_confirmation_buttons(jQuery("#login_status_pane"));

			} else {
				jQuery("#login_status_pane").prepend('There was an error.');
			}
		}
	}, "json");

}


function send_confirmation( email, page, context, resend ) {
	jQuery(document).trigger('send_confirmation');


	if (typeof(page) == undefined) {
		page = "";
	}
	if (typeof(context) == undefined) {
		context = "";
	}
	if (typeof(resend) == undefined) {
		resend = false;
	}

	jQuery("body").append("<div id='pending_email' style='display:none;'>" + email + "</div>");

	var data_to_send;
	data_to_send = {};

	if (resend) {
		data_to_send = {
			"method": "account_confirmation_resend",
			"email": email,
			"page": slug,
			"context": context
		};
	} else {
		data_to_send = {
			"method": "account_confirmation",
			"email": email,
			"page": slug,
			"context": context
		};
	}

	$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {

		if (typeof(data.result) !== 'undefined') {
			if (data.result.toLowerCase() == "failure") {
				jQuery("#login_status_pane").html('');
				if (typeof(data.reason) !== 'undefined') {
					if (data.reason.toLowerCase() == "account_pending") {
						pending_confirmation_buttons(jQuery("#login_status_pane"));
					} else {
						ready_to_close_button(jQuery("#login_status_pane"));
					}
				}
				if (typeof(data.message) !== 'undefined') {
					jQuery("#login_status_pane").append("<p>" + data.message + "</p>");
				}

			} else {
				pending_secret_confirmation_buttons(jQuery("#login_status_pane"));
				jQuery("#login_status_pane").html('Thank you. Buley\'s has sent an email to ' + $('#registration_email').val() + '. Please click the verification link in that email or paste its "secret" into the box below:<br/><br/><strong>Secret</strong>: <input id="confirmation_hash" type="text" name="confirmation_hash" />');
			}
		}
	}, "json");
}

function account_login( email, password ) {
	jQuery(document).trigger('account_login');

	var secret = md5(password);
	data_to_send = {
		"method": "email_login",
		"email": email,
		"secret": secret
	};

	$.post("http://api.buleys.com/feedback/", data_to_send, function ( data ) {


		if (typeof data.result !== 'undefined') {
			if (data.result.toLowerCase() == "failure") {

				if (typeof data.message !== 'undefined') {


					send_to_console("<p>" + data.message + "</p>");

				} else {


				}


			} else if (data.result.toLowerCase() == "success") {
				jQuery("#login_status_pane").remove();
				if (typeof(data.message) !== 'undefined' && data.message != null && data.message != '') {
					send_to_console("<p>" + data.message + "</p>");

				} else {
					send_to_console("<p>Logged 	in successfully.</p>");

				}
				jQuery("#register").fadeOut('fast');
				jQuery("#login").fadeOut('fast');
				jQuery("#logout").fadeIn('fast');
				close_button(jQuery("#login_status_pane"));
			}
		}
	}, "json");
}


	

function cancel_confirmation( user_id ) {
	jQuery(document).trigger('cancel_confirmation');


}

function check_login_status(  ) {
	jQuery(document).trigger('check_login_status');


	var session_id = get_local_storage("session_id");
	if (typeof session_id == "undefined" || session_id == null || session_id == "") {
	   	jQuery("#account_dropdown").append('<li><a href="#" id="get_login">Login or Signup</a></li>');
	} else {
	   	jQuery("#account_dropdown").append('<li><a href="/settings" id="get_settings">Settings</a></li>');
	}

}

$(document).bind('logout', function ( event ) {

	account_logout();
});


jQuery(".do_logout").live("click", function ( event ) {

	event.preventDefault();
	account_logout();
});

jQuery(".do_logout").live("click", function ( event ) {

event.preventDefault();
	account_logout();
});

jQuery(".submitthelogin").live("click", function ( event ) {

	alert('submitlogin');
});

$(document).bind('dologin', function ( event ) {

	event.preventDefault();
	$('#dologin').remove();
	$('#login_status_pane').append('<div id="minimize_login_controls"><a href="#" id="dologinboxminimize" class="loginboxminimizelink enter_door_icon"></a></div><div id="login_form"><a href="#" id="doregistration" class="registrationlink">Register</a> or Login:<br/><input id="email" type="text" value="your@email.here" name="email" /><br/><input id="password"  type="password" xxx name="password" /></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a><br/><a href="#" id="dologinsubmit" class="submitloginform">Login</a></div></div>');
});

$(document).bind('dologinboxminimize', function ( event ) {

	event.preventDefault();

	$('#login_status_pane').html('<a href="#" id="dologin" class="getloginform exit_door_link"></a>');
});

$(document).bind('get_login', function ( event ) {

	event.preventDefault();
	console.log(location.pathname);
	console.log("get_login clicked");

	var stateObj = {
		"page": Buleys.view.page,
		"slug": Buleys.view.slug,
		"type": Buleys.view.type,
		"time": new Date().getTime()
	};
	var urlString = "http://www.buleys.com/start";
	history.pushState(stateObj, "login", urlString);
	reload_results();
});


$(document).bind('dologinsubmit', function ( event ) {

	event.preventDefault();
	if (typeof $('[name="password"]') !== undefined && $('[name="password"]').val() !== "") {
		request_login($('[name="email"]').val(), $('[name="password"]').val());
	}
});

function twitter_preflight() {

	var on_success = function( data ) {
		console.log('twitter_preflight', data);
		var oauth_authorization_url = data.response.oauth_authorization_url;
		var oauth_request_state = data.response.oauth_request_state;
		var oauth_token = data.response.oauth_token;
		var oauth_token_secret = data.response.oauth_token_secret;

		set_local_storage_batch( {
			'twitter_oauth_authenticated': "0",
			'twitter_oauth_authorization_url': oauth_authorization_url,
			'twitter_oauth_request_state': oauth_request_state,
			'twitter_oauth_token': oauth_token,
			'twitter_oauth_token_secret': oauth_token_secret
		} );	
	};

	var on_error = function( data ) {

	};

	oauth_preflight( 'twitter', on_success, on_error );

}

function twitter_logout() {
	delete_local_storage_batch(
	[
		'twitter_oauth_authenticated',
		'twitter_oauth_authorization_url',
		'twitter_oauth_request_state',
		'twitter_oauth_token',
		'twitter_oauth_token_secret'
	] );

}



function twitter_validation_detect() {
	var get_vars = get_url_vars();
	if( !isEmpty( get_vars[ 'oauth_token' ] ) && !isEmpty( get_vars[ 'oauth_verifier' ] ) ) {
		console.log( 'twitter_validation_detect()', get_vars );
		twitter_authentication_validate( get_vars );
	}
}

function twitter_authentication_validate( get_vars ) {

	var oauth_token_secret;
	if( get_vars[ 'oauth_verifier' ] ) {
		oauth_token_secret = get_vars[ 'oauth_verifier' ];
	} else {
		return false;
	}

	var oauth_token;
	if( get_vars[ 'oauth_token' ] ) {
		oauth_token = get_vars[ 'oauth_token' ];
	} else {
		return false;
	}

	var request_state = get_local_storage( 'twitter_oauth_request_state' );

	if( 1 == request_state ) {

		var stored_oauth_token = get_local_storage( 'twitter_oauth_token' );
		
		var on_success = function( context ) {
			if( context.success == true ) {
			
				if ( !!Buleys.debug ) {
					console.log( 'Twitter account validated', context.response );
				}

				var response = context.response;
				var access_token = response.access_token;	
				var access_token_secret = response.access_token_secret;
				var request_state = response.oauth_request_state;	
	
				// Set local storage
				var twitter_oauth = {
					'twitter_oauth_authenticated': "1",
					'twitter_oauth_access_token': access_token,
					'twitter_oauth_access_token_secret': access_token_secret
				};

				console.log('batch setting', twitter_oauth );
				set_local_storage_batch( twitter_oauth );

				delete_local_storage_batch( [
					'twitter_oauth_request_state',
					'twitter_oauth_authorization_url',
					'twitter_oauth_token',
					'twitter_oauth_token_secret',
				] );

				// Redirect away from page

				var stateObj = {
				    "page": Buleys.view.page,
				    "slug": Buleys.view.slug,
				    "type": Buleys.view.type,
				    "time": new Date().getTime()
				};

				var loc = window.location;
				var url_string = loc.protocol + "//" + loc.hostname + loc.pathname;
				//console.log('making history', url_string);
				history.replaceState(stateObj, "homepage", url_string);
				reload_results();


			} else {
				console.log( 'Twitter account could not be validated', context );
			}
		};

		var on_error = function( context ) {
			if( context.success == true ) {
				console.log( 'Twitter account validated (but threw an error)', context.response );
			} else {
				console.log( 'Twitter account could not be validated (and threw an error)', context );
			}
		};

		if( stored_oauth_token === oauth_token ) {

			return oauth_validate( 'twitter', request_state, oauth_token, oauth_token_secret, on_success, on_error );

		} 
		return false;

	} else {

		return false;

	}

}

function do_twitter_authentication() {
	var auth_url = get_local_storage( 'twitter_oauth_authorization_url' );
	var req_state = get_local_storage( 'twitter_oauth_request_state' );
	if( 1 == req_state ) {
		window.location = auth_url;
	} else {
		return false;
	}
}

function oauth_preflight( type, on_success, on_error ) {

	/* Actions */

	jQuery(document).trigger('oauth_preflight');

	/* Defaults */

	if( 'function' !== typeof on_success ) {
		on_success = function( context ) {

		}
	}

	if( 'function' === typeof on_error ) {
		on_error = function( context ) {

		}
	}

	/* Setup */

	var data_to_send = {
		"oauth_type": type,
		"oauth_state": 0	
	};

	/* Request */

	jQuery.ajax( {
		'type': 'POST',
		'url': "http://api.buleys.com/oauth", 
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


function oauth_validate( type, request_state, oauth_token, oauth_token_secret, on_success, on_error ) {

	jQuery(document).trigger('oauth_preflight');

	if( 'function' !== typeof on_success ) {
		on_success = function( context ) {
			if( context.success == true ) {
					
			} else {
				on_error( context );
			}
		};
	}

	if( 'function' === typeof on_error ) {
		on_error = function( context ) {
			if( context.success !== true ) {

			} else {
				on_success( context );
			}
		};
	}

	var data_to_send = {
		"oauth_type": type,
		"oauth_state": request_state,
		"oauth_token": oauth_token,
		"oauth_token_secret": oauth_token_secret
	};

	jQuery.ajax( {
		'type': 'POST',
		'url': "http://api.buleys.com/oauth", 
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



/**
 * Categories.js
 **/

function add_category_controls( event_context ) {

	/* Setup */

	var html_snippit;
	var current = jQuery(event_context).html();
	var the_link = jQuery(event_context).attr('link');
	var the_type = jQuery(event_context).attr('type');
	var the_slug = jQuery(event_context).attr('slug');

	/* Action */

	jQuery(document).trigger('add_category_controls');

	/* UI */

	jQuery("#overlay .vote_up_category").remove();
	jQuery("#overlay .vote_down_category").remove();
	jQuery("#overlay .delete_category").remove();
	jQuery("#overlay .selected_category").removeClass('.selected_category');

	var vote_key = the_link.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();

	var vote_req_on_success = function ( context_1 ) {

		//TODO: rename item_request var to event_1
		var item_request = context_1.event;

		if (typeof item_request.result == 'undefined' || item_request.result == "") {

			html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
			html_snippit = html_snippit + "" + current;
			html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
			html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";

		} else {
			if (typeof item_request.target.result != 'undefined') {
				if (item_request.target.result.vote_value == -1) {
					html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
					html_snippit = html_snippit + "" + current;
					html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					html_snippit = html_snippit + "<div class='remove_category_down_vote thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
				} else if (item_request.target.result.vote_value == 1) {
					html_snippit = "<span class='remove_category_up_vote thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
					html_snippit = html_snippit + "" + current;
					html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
				} else {
					html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
					html_snippit = html_snippit + "" + current;
					html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
				}
			} else {
					html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
					html_snippit = html_snippit + "" + current;
					html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
			}
		}
		jQuery(event_context).html(html_snippit);
	};

	var vote_req_on_error = function ( e ) {
	
	};

	InDB.trigger( 'InDB_do_row_get', { 'store': 'votes', 'key': vote_key, 'on_success': vote_req_on_success, 'on_error': vote_req_on_error } );

}

function remove_category_for_item( item_url, item_slug, item_type ) {

	jQuery(document).trigger('remove_category_for_item');

	var on_success = function ( event ) {

	};

	var on_error = function (  ) {

	};

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'categories', 'key': (item_url + item_type + item_slug), 'on_success': on_success, 'on_error': on_error } );

}

	
function add_category_controls_without_vote_status( event_context ) {

	/* Action */

	jQuery(document).trigger('add_category_controls_without_vote_status');

	/* Setup */
	
	var html_snippit;
	var current = jQuery(event_context).html();
	var the_link = jQuery(event_context).attr('link');
	var the_type = jQuery(event_context).attr('type');
	var the_slug = jQuery(event_context).attr('slug');
	
	/* UI */

	jQuery("#overlay .vote_up_category").remove();
	jQuery("#overlay .vote_down_category").remove();
	jQuery("#overlay .delete_category").remove();
	jQuery("#overlay .selected_category").removeClass('.selected_category');

	html_snippit = "<span class='vote_up_category thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	html_snippit = html_snippit + "" + current;
	html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	html_snippit = html_snippit + "<div class='vote_down_category thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	html_snippit = "<div class='vote_block'>" + html_snippit + "</div>";

	jQuery(event_context).html(html_snippit);

}
	
function remove_category_for_item( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_category_for_item');

	var on_success = function ( context ) {
	
	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'categories', 'key': (item_url + item_type + item_slug), 'on_success': on_success, 'on_error': on_error } );

}

function remove_item_from_categories_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_categories_database');

	/* Callbacks */

	var item_on_success = function ( context_1 ) {
	
	};

	var item_on_error = function ( context_1 ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_delete', { 'store': 'categories', 'index': 'link', 'keyRange': InDB.range.only( item_url ), 'on_success': on_success, 'on_error': on_error } );

}

function add_categories_to_categories_database( item_url, categories ) {

	/* Action */

	jQuery(document).trigger( 'add_categories_to_categories_database' );

	jQuery.each(categories, function ( c, the_category ) {

		if (typeof the_category.slug !== 'undefined') {

			var data = {
				"id": item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_category.slug.toLowerCase() + the_category.type.toLowerCase(),
				"link": item_url,
				"slug": the_category.slug,
				"type": the_category.type,
				"value": the_category.display,
				"modified": new Date().getTime()
			};

			/* Callbacks */
			
			var add_on_success = function ( context ) {
				var event = context.event;
				if (typeof the_category.slug !== 'undefined') {
					var topic_key = the_category.type.toLowerCase() + "_" + the_category.slug.toLowerCase();
					if (typeof Buleys.queues.new_items[topic_key] == "undefined") {
						Buleys.queues.new_items[topic_key] = 0;
					}
					Buleys.queues.new_items[topic_key] = Buleys.queues.new_items[topic_key] + 1;
				}
			};
			
			var add_on_error = function ( context ) {
			
			};
			
			/* Request */

			InDB.trigger( 'InDB_do_row_add', { 'store': 'categories', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

		}
	});
}

function get_item_categories_for_overlay( item_url ) {

	/* Action */

	jQuery(document).trigger('get_item_categories_for_overlay');

	/* Callbacks */

	var item_on_success = function( context ) {
		
		var item = context.event.target.result;
	
		var cursor_on_success = function ( context_2 ) {

			var result = context_2.event.target.result;

			if( !result ) {
				return;
			}

			var item = result.value;
			
			if (jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length < 1) {
				var html_snippit = "<ul class='category_list' id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'></ul>";
				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(html_snippit);
			}

			var cat_snippit = "<li id='list_item_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "' class='category_list_item' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "'><a id='" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "'  class='category' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "' href='/" + item.type.toLowerCase() + "/" + item.slug + "'>" + item.value + "</a></li>";

			jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(cat_snippit);

			get_vote_info(item_url, item.type.toLowerCase(), item.slug.toLowerCase());


		};

		var cursor_on_error = function ( event ) {

		};

		/* Request */

		InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'link', 'keyRange': InDB.range.only( item_url ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

	};

	var item_on_error = function( context ) {

	};

	InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': item_on_success, 'on_error': item_on_error } );

}


$('.delete_category').live('click', function ( event ) {
	event.preventDefault();
	var the_url = $(this).attr('link');
	var the_type = $(this).attr('type');
	var the_slug = $(this).attr('slug');
	$(this).parent().parent().remove();
	remove_category_for_item(the_url.replace(/[^a-zA-Z0-9-_]+/g, ""), the_type, the_slug);
	if (!$(this).hasClass('voted')) {
		post_feedback('delete_category', the_url, the_type, the_slug);
	}
});


$('.vote_up_category').live('click', function ( event ) {
	event.preventDefault();
	var the_url = $(this).attr('link');
	var the_type = $(this).attr('type');
	var the_slug = $(this).attr('slug');
	var vote_key = "";
	vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
	jQuery(this).removeClass('empty_thumb_up_icon').addClass('thumb_up_icon');
	jQuery(this).parent().children('.thumb_icon').removeClass('.thumb_icon').addClass('empty_thumb_icon');
	add_or_update_vote(vote_key, 1);
	if (!$(this).hasClass('voted')) {
		post_feedback('category_upvote', the_url, the_type, the_slug);
	}
	$(this).addClass('voted');
	$(this).removeClass('vote_up_category');
	$(this).addClass('remove_category_up_vote');
});


$('.vote_down_category').live('click', function ( event ) {
	event.preventDefault();
	var the_url = $(this).attr('link');
	var the_type = $(this).attr('type');
	var the_slug = $(this).attr('slug');
	var vote_key = "";
	jQuery(this).removeClass('empty_thumb_icon').addClass('thumb_icon');
	jQuery(this).parent().children('.thumb_up_icon').removeClass('.thumb_up_icon').addClass('empty_thumb_up_icon');
	vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
	add_or_update_vote(vote_key, -1);
	if (!$(this).hasClass('voted')) {
		post_feedback('category_downvote', the_url, the_type, the_slug);
	}
	$(this).addClass('voted');
	$(this).removeClass('vote_down_category');
	$(this).addClass('remove_category_down_vote');
});


$('.remove_category_up_vote').live('click', function ( event ) {
	event.preventDefault();
	var the_url = $(this).attr('link');
	var the_type = $(this).attr('type');
	var the_slug = $(this).attr('slug');
	var vote_key = "";
	vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
	jQuery(this).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');
	remove_vote(vote_key);
	if ($(this).hasClass('voted')) {
		post_feedback('remove_category_upvote', the_url, the_type, the_slug);
	}
	$(this).removeClass('voted');
	$(this).removeClass('remove_category_up_vote');
	$(this).addClass('vote_up_category');
});

$('.remove_category_down_vote').live('click', function ( event ) {
	event.preventDefault();
	var the_url = $(this).attr('link');
	var the_type = $(this).attr('type');
	var the_slug = $(this).attr('slug');
	var vote_key = "";
	jQuery(this).removeClass('thumb_icon').addClass('empty_thumb_icon');
	vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
	remove_vote(vote_key);
	if ($(this).hasClass('voted')) {
		post_feedback('remove_category_downvote', the_url, the_type, the_slug);
	}
	$(this).removeClass('voted');
	$(this).removeClass('remove_category_down_vote');
	$(this).addClass('vote_down_category');
});


$('#overlay .category').live('mouseenter', function ( event ) {
	event.preventDefault();
	add_category_controls(jQuery(this));
});


$('#overlay .category').live('mouseleave', function ( event ) {
	event.preventDefault();
	jQuery("#overlay .vote_up_category").remove();
	jQuery("#overlay .vote_down_category").remove();
	jQuery("#overlay .remove_category_up_vote").remove();
	jQuery("#overlay .remove_category_down_vote").remove();
	jQuery("#overlay .delete_category").remove();
});

function flash_console( message ) {
	jQuery(document).trigger('flash_console');

    send_to_console(message);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 1
    }, 500);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0
    }, 500);
}

function send_text_to_console( text_to_send ) {
	jQuery(document).trigger('send_text_to_console');

    jQuery("#console").html('').append("<p>" + text_to_send + "</p>");
}

function send_to_console( text_to_send ) {
	jQuery(document).trigger('send_to_console');

    send_text_to_console(text_to_send);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 1
    }, 500);
}

function fade_console_message(  ) {
	jQuery(document).trigger('fade_console_message');

    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0
    }, 500);
}
	function do_work(  ) {
	jQuery(document).trigger('do_work');

	    if (Buleys.queues.pending_crawls.length > 0) {
	        do_pending_crawl();
	    } else {
	        get_follows();
	    }
	
	
	    var length_of_new = 0;
	    length_of_new = getKeys(Buleys.queues.new_items);
	
	    if (length_of_new > 0) {
	
	        var topic_id = type + "_" + slug;
	
	        if (typeof Buleys.queues.new_items[topic_id] !== "undefined") {
	            delete Buleys.queues.new_items[topic_id];
	        }
	
	        var length_post_delete = getKeys(Buleys.queues.new_items);
	
	        if (length_post_delete > 0) {
	
	
	
	            if (typeof jQuery("#minimize_inbox") !== "undefined" && length_of_new > 0) {
	                jQuery("#get_inbox").removeClass('inbox_icon').addClass('empty_inbox_icon').parent().parent().removeClass('empty_inbox').addClass('waiting_inbox');
	            }
	
	        } else {
	
	            jQuery("#get_inbox img").removeClass('empty_inbox_icon').addClass('inbox_icon').parent().parent().addClass('empty_inbox').removeClass('waiting_inbox');
	
	
	        }
	
	        save_queues();
	        save_settings();
	
	    }
	
	
	
	
	    if (Buleys.mouse.mouse_y_snapshot === Buleys.mouse.mouse_y && Buleys.mouse.mouse_x_snapshot === Buleys.mouse.mouse_x) {
	        if (Buleys.settings.crawl_speed >= Buleys.settings.crawl_min) {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_increment;
	        } else {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_min;
	        }
	    } else {
	        if (Buleys.settings.crawl_speed <= Buleys.settings.crawl_max) {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_deincrement;
	        } else {
	            Buleys.settings.crawl_speed = Buleys.settings.crawl_max;
	        }
	
	        Buleys.mouse.mouse_y_snapshot = Buleys.mouse.mouse_y;
	        Buleys.mouse.mouse_x_snapshot = Buleys.mouse.mouse_x;
	    }
	    if (jQuery(".unseen").length > 0) {
	        window.document.title = window.document.title.replace(/[|\s]*?Buley's/, "");
	        window.document.title = window.document.title.replace(/\(.*?\)[|\s]*?/g, "") + " (" + jQuery(".unseen").length + ") | Buley's";
	    } else {
	        window.document.title = window.document.title.replace(/[\s]?\(.*?\)/g, "");
	    }
	    setTimeout('do_work()', Buleys.settings.crawl_speed);
	
	}
	

	function is_in_cursor_mode(  ) {
	jQuery(document).trigger('is_in_cursor_mode');

	    if (jQuery('.cursor').length > 0) {
	        return true;
	    } else {
	        return false;
	    }
	}
	

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

/**
 * Follows.js
 **/


function get_follows(  ) {

	/* Action */

	jQuery( document ).trigger( 'get_follows' );

	/* Callbacks */

	var on_success = function( context ) {
		console.log( InDB.rows.value( context.event ) );
	}

	var on_error = function( context ) {
		console.log( 'get_follows error', context );
	}

	/* Request */

	InDB.trigger( 'InDB_rows_get', { 'store': 'follows', 'keyRange': InDB.transaction.left_open( '0' ), 'on_success': on_success, 'on_error': on_error } );

}


function getKeys( obj ) {
	
	/* Action */

	jQuery( document ).trigger( 'getKeys' );

	var keys = [];

	if (typeof obj !== "undefined") {

		$.each(obj, function ( key, obj ) {

			keys.push(key);
		});

		return keys.length;

	} else {

		return 0;

	}
}


function get_page_follow_status( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'get_page_follow_status' );

	/* Callback */

	var follows_on_success = function ( context ) {
		var event = context.event;
		if (typeof event.result == 'undefined' || event.result == "") {
			jQuery( "#page_follow_status").html("<div class='follow_topic empty_heart_icon'></div>");
		} else {
			jQuery( "#page_follow_status").html("<div class='unfollow_topic heart_icon'></div>");
		}
	};

	var follows_on_error = function ( e ) {
		console.log( 'Follows error getting status' );
	};

	/* Request */

	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( the_type + "_" + the_key ), 'on_success': follows_on_success, 'on_error': follows_on_error } );

}


function remove_follow( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'remove_follow' );

	/* Callback */

	var on_success = function( context ) {
		console.log( 'Follow removed' );
	}

	var on_error = function( context ) {
		console.log( 'remove_follow error', context );
	}

	/* Request */

	InDB.trigger( 'InDB_row_delete', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}


function add_follow_if_doesnt_exist( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'add_follow_if_doesnt_exist' );

	/* Callback */

	var on_success = function( context ) {
		var item_request = context.event;
		//Not yet following	
		if (typeof item_request.result == 'undefined' ) {
			add_follow_to_follows_database(the_type, the_key);
		}

	}

	var on_error = function( context ) {
		console.log( 'Follow already exists', context );
	}

	InDB.trigger( 'InDB_row_get', { 'store': 'follows', 'key': ( type_type + "_" + the_key ), 'on_success': on_success, 'on_error': on_error } );

}


function add_follow_to_follows_database( the_type, the_key ) {

	/* Action */

	jQuery( document ).trigger( 'add_follow_to_follows_database' );

	/* Setup */

	var data = {
		"key": the_type + "_" + the_key,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function( context ) {
		console.log( 'Added follow to follow database', context );
	}

	var on_error = function( context ) {
		console.log( 'Error adding follow to follow database', context );
	}

	/* Request */

	InDB.trigger( 'InDB_row_add', { 'store': 'follows', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}


jQuery(  'html' ).bind( 'mousemove', function ( e ) {

	/* UI */

	Buleys.mouse.mouse_x = e.pageX;
	Buleys.mouse.mouse_y = e.pageY;

});



jQuery(  '.follow_topic' ).live( 'click', function ( event ) {

	// Prevent clickthrough
	event.preventDefault();

	/* Setup */

	var the_key = jQuery( this ).attr( 'key' );
	var the_type = jQuery( this ).attr( 'type' );

	if (typeof the_key == 'undefined' ) {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}

	if (typeof the_type == 'undefined' || the_type == '' ) {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	/* Methods */

	add_follow_if_doesnt_exist(the_type, the_key);

	post_feedback( 'follow', '', the_key, the_type);

	/* UI */

	jQuery( this ).removeClass( 'empty_heart_icon' ).addClass( 'heart_icon' );
	jQuery( this ).removeClass( 'follow_topic' );
	jQuery( this ).addClass( 'unfollow_topic' );

} );

jQuery(  '.unfollow_topic' ).live( 'click', function ( event ) {

	// Prevent clickthrough
	event.preventDefault();

	/* Setup */

	var the_key = jQuery( this ).attr( 'key' );
	var the_type = jQuery( this ).attr( 'type' );

	if (typeof the_key == 'undefined' ) {
		the_key = Buleys.view.slug;
	} else {
		the_key = the_key;
	}

	if (typeof the_type == 'undefined' || the_type == "") {
		the_type = Buleys.view.type;
	} else {
		the_type = the_type;
	}

	/* Methods */

	remove_follow(the_type, the_key);

	post_feedback( 'unfollow', '', the_key, the_type);

	/* UI */

	jQuery( this ).removeClass( 'heart_icon' ).addClass( 'empty_heart_icon' );
	jQuery( this ).removeClass( 'unfollow_topic' );
	jQuery( this ).addClass( 'follow_topic' );

} );
	
	//Declare a new object child of the Buleys.settings DOM
	//this will be collected by the automatic saving cronjob

	//Buleys.settings is declared in loader.js
	
	function temporarily_disable_hotkeys(  ) {
	jQuery(document).trigger('temporarily_disable_hotkeys');


	} 
	
	function disable_hotkeys(  ) {
	jQuery(document).trigger('disable_hotkeys');

		console.log( "Disabling hotkeys" );
		console.log( Buleys.settings );
		Buleys.settings.hotkeys.disabled = true;
	}
	
	function enable_hotkeys(  ) {
	jQuery(document).trigger('enable_hotkeys');

		delete Buleys.settings.hotkeys.disabled;
	}


    $(document).bind('show_commands', function ( event ) {

        event.preventDefault();

        $('#result_controls').show();
    });


    $(document).bind('hide_commands', function ( event ) {

        event.preventDefault();
        $('#result_controls').hide();
    });


    $(document).bind('show_button', function ( e ) {

        send_notification_to_desktop();
    });

	
    $('html').live('keyup', function ( e ) {

	console.log('disabled?');
	console.log( Buleys.settings.hotkeys.disabled );
		if( (  typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" && typeof Buleys.settings.hotkeys.disabled === "undefined" ) || ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" ) && ( typeof Buleys.settings.hotkeys.disabled !== "undefined" && Buleys.settings.hotkeys.disabled !== true ) ) {
			//
	
	
	        if (e.keyCode == 68) {
	            Buleys.shortcuts.d_depressed = false;
	
	        } else if (e.keyCode == 83) {
	            Buleys.shortcuts.s_depressed = false;
	
	        } else if (e.keyCode == 16) {
	            Buleys.shortcuts.shift_depressed = false;
	
	
	
	
	
	        } else if (e.keyCode == 72) {
	
	            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_index');
	            } else {
	                $(document).trigger('close_item_preview');
	            }
	
	
	        } else if (e.keyCode == 76) {
	
	            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_home');
	            } else {
	                $(document).trigger('preview_item');
	
	                if (jQuery('.cursor').length > 0) {
	                    //alert(jQuery('.cursor').text());
	                }
	
	            }
	
	
	        } else if (e.keyCode == 78) {
	            $(document).trigger('preview_item');
	            if (jQuery('.selected').length > 0) {
	                jQuery('#results li.selected:first').addClass('cursor');
	            } else {
	                jQuery('#results li:first').addClass('cursor');
	            }
	
	
	        } else if (e.keyCode == 74) {
	
	            if (jQuery('.cursor').next().length > 0) {
	                jQuery('.cursor').removeClass('cursor').next().addClass('cursor');
	            } else {
	                jQuery('.cursor').removeClass('cursor');
	                jQuery('#results li:first').addClass('cursor');
	            }
	
	        } else if (e.keyCode == 75) {
	
	            if (jQuery('.cursor').prev().length > 0) {
	                jQuery('.cursor').removeClass('cursor').prev().addClass('cursor');
	            } else {
	                jQuery('.cursor').removeClass('cursor');
	                jQuery('#results li:last').addClass('cursor');
	            }
	
	
	        } else if (e.keyCode == 27) {
	            jQuery('.cursor').removeClass('cursor');
	            $(document).trigger('close_all');
	
	
	        } else if (e.keyCode == 77) {
	            jQuery('.cursor').removeClass('cursor');
	
	
	        } else if (e.keyCode == 219) {
	            $(document).trigger('preview_item');
	
	        } else if (e.keyCode == 221) {
	            $(document).trigger('close_item_preview');
	
	
	        } else if (e.keyCode == 89) {
	            $(document).trigger('show_commands');
	
	
	        } else if (e.keyCode == 85) {
	            $(document).trigger('hide_commands');
	
	
	        } else if (e.keyCode == 65) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_all');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('select_none');
	            } else {}
	
	
	        } else if (e.keyCode == 82) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unread');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unread');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_unread');
	            } else {
	                $(document).trigger('mark_unread');
	            }
	
	
	        } else if (e.keyCode == 13) {
	
	
	
	        } else if (e.keyCode == 73) {
	            $(document).trigger('select');
	
	        } else if (e.keyCode == 79) {
	            $(document).trigger('deselect');
	
	        } else if (e.keyCode == 69) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_read');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_read');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_read');
	            } else {
	                $(document).trigger('mark_read');
	            }
	        	
		} else if (e.keyCode == 88) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_none');
	            } else if (Buleys.shortcuts.d_depressed) {
		    } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_trash');
	            } else {
	                $(document).trigger('delete');
	            }
	
	
	        } else if (e.keyCode == 67) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_archived');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_archived');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_archive');
	            } else {
	                $(document).trigger('archive');
	            }
	
	        } else if (e.keyCode == 86) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unarchived');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unarchived');
	            } else {
	                $(document).trigger('unarchive');
	            }
	
	        } else if (e.keyCode == 70) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_favorites');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_favorites');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_favorites');
	            } else {
	                $(document).trigger('favorite');
	            }
	
	        } else if (e.keyCode == 71) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unfavorite');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unfavorite');
	            } else {
	                $(document).trigger('unfavorite');
	            }
	
	        } else if (e.keyCode == 81) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_seen');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_seen');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_seen');
	            } else {
	                $(document).trigger('mark_seen');
	            }
	
	        } else if (e.keyCode == 87) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unseen');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unseen');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_unseen');
	            } else {
	                $(document).trigger('mark_unseen');
	            }
	
	        } else if (e.keyCode == 90) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_inverse');
	            } else if (Buleys.shortcuts.d_depressed) {
	            
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_index');
	            } else {
	                $(document).trigger('undelete');
	            }
	
	        } else if (e.keyCode == 73) {
	            $(document).trigger('deselect');
	
	        } else if (e.keyCode == 79) {
	
	            $(document).trigger('select');
	        }
			
		}

    });


    $('html').live('keydown', function ( e ) {


		if( ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" && typeof Buleys.settings.hotkeys.disabled === "undefined" ) || ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" ) && ( typeof Buleys.settings.hotkeys.disabled !== "undefined" && Buleys.settings.hotkeys.disabled !== true ) ) {

	        if (e.keyCode == 68) {
	            Buleys.shortcuts.d_depressed = true;
	
	        } else if (e.keyCode == 83) {
	            Buleys.shortcuts.s_depressed = true;
	
	        } else if (e.keyCode == 16) {
	            Buleys.shortcuts.shift_depressed = true;

        	}

		}

    });

function add_topics_to_mini_inbox(  ) {
	jQuery(document).trigger('add_topics_to_mini_inbox');

    jQuery("#mini_inbox_list").html('');
    var item_count = 0;
    if (getKeys(Buleys.queues.new_items) > 0) {
        $.each(Buleys.queues.new_items, function ( topic_id, count ) {

            if (item_count <= Buleys.settings.mini_inbox_topic_count) {
                add_topic_to_mini_inbox(topic_id, count);
                item_count++;
            }
        });
    } else {
        jQuery("#mini_inbox_list").html('<li>No new items</li>');
    }
}

function add_topic_to_mini_inbox( topic_id, count ) {
	jQuery(document).trigger('add_topic_to_mini_inbox');

    new_topics_transaction();
    var item_request = Buleys.objectStore.get(topic_id);
    item_request.onsuccess = function ( event ) {

        if (typeof item_request.result == 'undefined' || item_request.result == "") {
            var split_string = topic_id.split("_", 1);
            var type_to_get = split_string[0];
            var company_to_get = topic_id.replace((split_string[0] + "_"), "");
            jQuery("#mini_inbox_list").append("<li><a href='/" + type_to_get + "/" + company_to_get + "' class='topic_name'>" + topic_id + "</a> (" + count + ")</li>");
        } else {
            if (typeof item_request.result.name != 'undefined') {
                jQuery("#mini_inbox_list").append("<li><a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a> (" + count + ")</li>");
            }
        }
    };
    item_request.onerror = function ( e ) {

    };
}

$(document).bind('get_inbox', function ( event ) {

    event.preventDefault();
    $('#mini_inbox_box').html('<div id="mini_inbox_wrapper" class="service_box_wrapper"><div class="cross_icon" id="minimize_mini_inbox_controls"></div><ul id="mini_inbox_list"><li>Loading...</li></ul></div>');
    add_topics_to_mini_inbox();

});

$(document).bind('minimize_mini_inbox_controls', function ( event ) {

    event.preventDefault();
    if ($('#mini_inbox_box').hasClass('waiting_inbox')) {
        $('#mini_inbox_box').html('<div class="getinbox empty_inbox big_inbox_document_icon" id="get_inbox"></div>');
    } else {
        $('#mini_inbox_box').html('<div class="getinbox empty_inbox big_inbox_icon" id="get_inbox"></div>');
    }
});

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

function md5 ( str ) {
	jQuery(document).trigger('md5 ');

    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function ( lValue, iShiftBits ) {

        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    };

    var addUnsigned = function ( lX,lY ) {

        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function ( x,y,z ) {
 return (x & y) | ((~x) & z); };
    var _G = function ( x,y,z ) {
 return (x & z) | (y & (~z)); };
    var _H = function ( x,y,z ) {
 return (x ^ y ^ z); };
    var _I = function ( x,y,z ) {
 return (y ^ (x | (~z))); };

    var _FF = function ( a,b,c,d,x,s,ac ) {

        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function ( a,b,c,d,x,s,ac ) {

        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function ( a,b,c,d,x,s,ac ) {

        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function ( a,b,c,d,x,s,ac ) {

        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function ( str ) {

        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=new Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    var wordToHex = function ( lValue ) {

        var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
        }
        return wordToHexValue;
    };

    var x=[],
        k,AA,BB,CC,DD,a,b,c,d,
        S11=7, S12=12, S13=17, S14=22,
        S21=5, S22=9 , S23=14, S24=20,
        S31=4, S32=11, S33=16, S34=23,
        S41=6, S42=10, S43=15, S44=21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    
    xl = x.length;
    for (k=0;k<xl;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=addUnsigned(a,AA);
        b=addUnsigned(b,BB);
        c=addUnsigned(c,CC);
        d=addUnsigned(d,DD);
    }

    var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);

    return temp.toLowerCase();
}

function utf8_encode (  argString  ) {
	jQuery(document).trigger('utf8_encode ');

    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

	function post_feedback( event_type, item_url, context_string, context_type_string ) {
	jQuery(document).trigger('post_feedback');

	    var data_to_send;
	    data_to_send = {
	        "event": event_type,
	        "item": item_url,
	        "context": context_string,
	        "type": context_type_string
	    };
	    $.post("http://api.buleys.com/feedback/", data_to_send, function (  ) {

	
	    }, dataType = "json");
	}


    $(document).bind('view_seen', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_seen clicked");

        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/seen";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/seen";
        } else {
            urlString = "http://www.buleys.com/seen";
        }
        history.pushState(stateObj, "view_seen", urlString);
        reload_results();
    });

    $(document).bind('view_unseen', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_unseen clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/unseen";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/unseen";
        } else {
            urlString = "http://www.buleys.com/unseen";
        }
        history.pushState(stateObj, "view_unseen", urlString);
        reload_results();
    });

    $(document).bind('view_read', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_read clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/read";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/read";
        } else {
            urlString = "http://www.buleys.com/read";
        }
        history.pushState(stateObj, "view_read", urlString);
        reload_results();
    });

    $(document).bind('view_unread', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_unread clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/unread";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/unread";
        } else {
            urlString = "http://www.buleys.com/unread";
        }
        history.pushState(stateObj, "view_unread", urlString);
        reload_results();
    });

    $(document).bind('view_trash', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_trash clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/trash";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/trash";
        } else {
            urlString = "http://www.buleys.com/trash";
        }
        history.pushState(stateObj, "view_trash", urlString);
        reload_results();
    });

    $(document).bind('view_archive', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_archive clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/archive";
        } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/archive";
        } else {
            urlString = "http://www.buleys.com/archive";
        }
        history.pushState(stateObj, "view_archive", urlString);
        reload_results();
    });


    $(document).bind('view_index', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_index clicked");
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/";
        } else if (typeof Buleys.view.type != 'undefined' && Buleys.view.type != "") {
            urlString = "http://www.buleys.com/" + Buleys.view.type + "/";
        }
        history.pushState(stateObj, "view_index", urlString);
        reload_results();
    });
    $(document).bind('view_home', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_home clicked");
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = '';
        urlString = "http://www.buleys.com/" + Buleys.view.type + "/";
        history.pushState(stateObj, "view_home", urlString);
        reload_results();
    });

    $(document).bind('view_settings', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_home clicked");
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        history.pushState(stateObj, "view_settings", "http://www.buleys.com/settings/");
        reload_results();
    });
    

    $('.close_item_preview').live('click', function ( event ) {

        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function (  ) {

            jQuery("#overlay").html('');
        });
    });


    $('.sidebar_close_link').live('click', function ( event ) {

        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function (  ) {

            jQuery("#overlay").html('');
        });
    });

    $(document).bind('close_all', function ( event ) {

        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function (  ) {

            jQuery("#overlay").html('');
        });
    });

    $('.mark_item_as_unread').live('click', function ( event ) {

        event.preventDefault();
        $(this).removeClass('empty_star_icon').addClass('star_icon');
        $(this).removeClass('unfav_link');
        $(this).addClass('fav_link');


        var item_to_work_from = jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));


        if (item_to_work_from.hasClass('read')) {
            item_to_work_from.removeClass('read');
            item_to_work_from.addClass('unread');
        }

        remove_item_from_read_database($(this).attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>marked as unread</p>");
        setTimeout('fade_console_message()', 1000);
    });

    $(document).bind('mark_all_items_as_read', function ( event ) {

        event.preventDefault();

        jQuery.each(jQuery(".unread"), function ( k, item_to_mark ) {



            var item_to_work_from = jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));
            if (item_to_work_from.hasClass('unread')) {
                item_to_work_from.removeClass('unread');
                item_to_work_from.addClass('read');
            }

            mark_item_as_read(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
        });

    });

    $(document).bind('mark_seen', function ( event ) {

        event.preventDefault();

        if (!is_in_cursor_mode()) {


            jQuery.each(jQuery(".selected"), function ( k, item_to_mark ) {



                jQuery(item_to_mark).removeClass('unseen');
                jQuery(item_to_mark).addClass('seen');
                if (typeof jQuery(item_to_mark).attr('status') !== 'undefined') {
                    jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unseen', '')));
                }
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' seen'));



                mark_item_as_seen(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            });

        } else {
            jQuery('.cursor').removeClass('seen');
            jQuery('.cursor').addClass('unseen');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' unseen'));
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' seen', '')));


            mark_item_as_unseen(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

        }

    });

    $(document).bind('mark_unseen', function ( event ) {

        event.preventDefault();

        if (!is_in_cursor_mode()) {


            jQuery.each(jQuery(".selected"), function ( k, item_to_mark ) {


                jQuery(item_to_mark).removeClass('seen');
                jQuery(item_to_mark).addClass('unseen');
                var pre_val = jQuery(item_to_mark).attr('status');
                if (typeof pre_val !== "undefined") {
                    jQuery(item_to_mark).attr('status', pre_val.replace(' seen', ''));
                }
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' unseen'));

                mark_item_as_unseen(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            });

        } else {
            jQuery('.cursor').removeClass('seen');
            jQuery('.cursor').addClass('unseen');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' seen'));
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unseen', '')));

            mark_item_as_unseen(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

        }

    });

    $(document).bind('select_all', function ( event ) {

        event.preventDefault();
        $.each($('#results > li'), function ( i, item_to_mark ) {

            if (jQuery(item_to_mark).hasClass('selected')) {} else {
                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            }
        });
    });
    $(document).bind('select_none', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {


                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', jQuery(item_to_mark).attr('status').replace(' selected', ''));
            });

        } else {
            jQuery('.cursor').removeClass('selected');
            jQuery('.cursor').attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        }
    });
    $(document).bind('select_inverse', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('#results li'), function ( i, item_to_mark ) {

                if (jQuery(item_to_mark).hasClass('selected')) {
                    jQuery(item_to_mark).removeClass('selected');

                    jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

                } else {
                    jQuery(item_to_mark).addClass('selected');

                    jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));

                }
            });

        } else {

            if (jQuery('.cursor').hasClass('selected')) {

                jQuery('.cursor').removeClass('selected');

                jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' selected', '')));


            } else {
                jQuery('.cursor').addClass('selected');

                jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' selected'));

            }

        }
    });


	$(document).bind('view_favorites', function ( event ) {

	    event.preventDefault();
	    console.log(location.pathname);
	    console.log("view_favorites clicked")
	    var stateObj = {
	        "page": Buleys.view.page,
	        "slug": Buleys.view.slug,
	        "type": Buleys.view.type,
	        "time": new Date().getTime()
	    };
	    var urlString = '';
	    if (typeof Buleys.view.page != 'undefined' && Buleys.view.page != "") {
	        urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/favorites";
	    } else if (typeof Buleys.view.slug != 'undefined' && Buleys.view.slug != "") {
	        urlString = "http://www.buleys.com/" + Buleys.view.type + "/" + Buleys.view.slug + "/favorites";
	    } else {
	        urlString = "http://www.buleys.com/favorites";
	    }
	    history.pushState(stateObj, "view_favorites", urlString);
	    reload_results();
	});


    $(document).bind('deselect_seen', function ( event ) {

        event.preventDefault();
        $.each($('.seen'), function ( i, item_to_mark ) {



            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });
    $(document).bind('deselect_unseen', function ( event ) {

        event.preventDefault();
        $.each($('.unseen'), function ( i, item_to_mark ) {



            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });

    $(document).bind('deselect_read', function ( event ) {

        event.preventDefault();
        $.each($('.read'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_unread', function ( event ) {

        event.preventDefault();
        $.each($('.unread'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_archived', function ( event ) {

        event.preventDefault();
        $.each($('.archived'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_unarchived', function ( event ) {

        event.preventDefault();
        $.each($('.unarchived'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_unseen', function ( event ) {

        event.preventDefault();
        $.each($('.unseen'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_unread', function ( event ) {

        event.preventDefault();
        $.each($('.unread'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $(document).bind('deselect_unarchived', function ( event ) {

        event.preventDefault();
        $.each($('.unarchived'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });


    $(document).bind('select_seen', function ( event ) {

        event.preventDefault();
        $.each($('.seen'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $(document).bind('select_unseen', function ( event ) {

        event.preventDefault();
        $.each($('.unseen'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $(document).bind('select_read', function ( event ) {

        event.preventDefault();
        $.each($('.read'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $(document).bind('select_unread', function ( event ) {

        event.preventDefault();
        $.each($('.unread'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $(document).bind('select_archived', function ( event ) {

        event.preventDefault();
        $.each($('.archived'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $(document).bind('select_unarchived', function ( event ) {

        event.preventDefault();
        $.each($('.unarchived'), function ( i, item_to_mark ) {


            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });

     $(document).bind('delete', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {


                delete_item(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                jQuery(item_to_mark).remove();
            });
        } else {

            delete_item(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

            if (jQuery('.cursor').next().length > 0) {
                jQuery('.cursor').next().addClass('cursor').prev().remove();
            } else {
                jQuery('.cursor').remove();
                jQuery('#results li:first').addClass('cursor');
            }

        }
    });

    $(document).bind('undelete', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {

		console.log("undeleting");
		console.log(jQuery(item_to_mark).children('a').attr('href'));
                undelete_item(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                jQuery(item_to_mark).remove();
            });
        } else {

            undelete_item(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

            if (jQuery('.cursor').next().length > 0) {
                jQuery('.cursor').next().addClass('cursor').prev().remove();
            } else {
                jQuery('.cursor').remove();
                jQuery('#results li:first').addClass('cursor');
            }

        }
    });

    $(document).bind('select', function ( event ) {

        event.preventDefault();
        if (is_in_cursor_mode()) {

            $.each($('.cursor'), function ( i, item_to_mark ) {


                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            });
        } else {

            $.each($('.selected'), function ( i, item_to_mark ) {


                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            });


        }
    });

    $(document).bind('deselect', function ( event ) {

        event.preventDefault();
        if (is_in_cursor_mode()) {

            $.each($('.cursor'), function ( i, item_to_mark ) {


                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
            });
        } else {

            $.each($('.selected'), function ( i, item_to_mark ) {


                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
            });

        }
    });

    $(document).bind('archive', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {


                archive_item(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                if (Buleys.view.page !== "favorites" && Buleys.view.page !== "archive") {
                    jQuery(item_to_mark).remove();
                }
            });

        } else {

            archive_item(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);

            if (jQuery('.cursor').next().length > 0) {
                jQuery('.cursor').next().addClass('cursor').prev().remove();
                jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' cursor', '')));
            } else {
                jQuery('.cursor').remove();
                jQuery('#results li:first').addClass('cursor');
                jQuery('#results li:first').attr('status', (jQuery(item_to_mark).attr('status').replace(' cursor', '')));

            }

        }
    });


    $(document).bind('read', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {


                var new_window = window.open(jQuery(item_to_mark).children('a').attr('href'), jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));
                mark_item_as_read(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                jQuery(item_to_mark).addClass('read');
                jQuery(item_to_mark).removeClass('unread');

                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read'));
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')));

            });

        } else {

            var new_window = window.open(jQuery('.cursor > a').attr('href'), jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));
            mark_item_as_read(jQuery('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
            jQuery('.cursor').addClass('read');
            jQuery('.cursor').removeClass('unread');

            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' read'));
            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' unread', '')));

        }
    });



    $(document).bind('unarchive', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {
            $.each($('.selected'), function ( i, item_to_mark ) {


                unarchive_item(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                if (Buleys.view.page == "archive") {
                    jQuery(item_to_mark).remove();
                }
            });
        } else {

            unarchive_item(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            jQuery('.cursor').removeClass('archived').addClass('.unarchived');
            if (Buleys.view.page == "archive") {
                jQuery('.cursor').remove();
            }

        }
    });



    $(document).bind('mark_read', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {
            $.each($('.selected'), function ( i, item_to_mark ) {


                mark_item_as_read(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                jQuery(item_to_mark).addClass('read');
                jQuery(item_to_mark).removeClass('unread');

                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read'));
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')));

            });
        } else {

            mark_item_as_read(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            jQuery('.cursor').addClass('read');
            jQuery('.cursor').removeClass('unread');

            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' read'));
            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' unread', '')));

        }
    });

    $(document).bind('mark_unread', function ( event ) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function ( i, item_to_mark ) {



                remove_item_from_read_database(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                jQuery(item_to_mark).addClass('unread');
                jQuery(item_to_mark).removeClass('read');

                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read'));
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')));

            });

        } else {
            remove_item_from_read_database(jQuery('.cursor').children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            jQuery('.cursor').addClass('unread');
            jQuery('.cursor').removeClass('read');

            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' unread'));
            jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' read', '')));

        }
    });


    $(document).bind('mark_all_items_as_unread', function ( event ) {

        event.preventDefault();

        jQuery.each(jQuery(".read"), function ( k, item_to_mark ) {


            var item_to_work_from = jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));
            if (item_to_work_from.hasClass('read')) {
                item_to_work_from.removeClass('read');
                item_to_work_from.addClass('unread');
                jQuery(item_to_work_from).attr('status', (jQuery(item_to_mark).attr('status') + ' unread'));
                jQuery(item_to_work_from).attr('status', (jQuery(item_to_mark).attr('status').replace(' read', '')));

            }

            remove_item_from_read_database(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
        });

    });



    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0
    }, 0, function (  ) {
});

    jQuery("#overlay").stop(true).animate({
        opacity: 0
    }, 0, function (  ) {
}).html('');



    $('.headline a').live('click', function ( event ) {

        var related_cats = new Array();
        var related_tags = new Array();
        var uri_string = $(this).attr('href');

        data_to_send = {
            "event": "click",
            "item": $(this).attr('href'),
            "page": slug
        };

        var data_to_send;

        data_to_send = {
            "event": "clickthrough",
            "item": $(this).attr('href'),
            "context": Buleys.view.slug,
            "type": Buleys.view.type
        };

        $.post("http://api.buleys.com/feedback/", data_to_send, dataType = "json", function ( data ) {

            new_window = window.open(uri_string, click_window);
        });
    });

    $('.sidebar_headline a').live('click', function ( event ) {

        var related_cats = new Array();
        var related_tags = new Array();
        var uri_string = $(this).attr('href');



        var data_to_send;
        data_to_send = {
            "event": "click",
            "item": $(this).attr('href'),
            "context": Buleys.view.slug,
            "type": Buleys.view.type
        };

        $.post("http://api.buleys.com/feedback/", data_to_send, dataType = "json", function ( data ) {

            new_window = window.open(uri_string, click_window);

        });

    });


    jQuery("#results li").live('mouseenter', function ( event ) {


        var item_to_work_from = jQuery(this);

        if (item_to_work_from.hasClass('unseen')) {
            item_to_work_from.removeClass('unseen');
            item_to_work_from.addClass('seen');

        }
        url_to_preview = item_to_work_from.children('a').attr('href');



        mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);


    });

    $(document).bind('preview_item', function ( event ) {

        event.preventDefault();
	if( 0 === $('.selected').length ) {
		console.log(jQuery(event.target).attr('id') );
		open_preview( jQuery(event.target).attr('id') );
        } else if (!is_in_cursor_mode() && $('.selected').length > 0) {

            $.each($('.selected'), function ( i, item_to_mark ) {




                var item_to_work_from = jQuery(item_to_mark);

                if (item_to_work_from.hasClass('unseen')) {
                    item_to_work_from.removeClass('unseen');
                    item_to_work_from.addClass('seen');
                }
                url_to_preview = item_to_work_from.children('a').attr('href');



                mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);
                load_item_to_overlay(url_to_preview);

                jQuery("#overlay").stop(true).animate({
                    opacity: 1
                }, 100, function (  ) {
});



            });

        } else if ($('.selected').length > 0) {

            var item_to_work_from = jQuery('.cursor');

            if (item_to_work_from.hasClass('unseen')) {
                item_to_work_from.removeClass('unseen');
                item_to_work_from.addClass('seen');
            }
            url_to_preview = item_to_work_from.children('a').attr('href');



            mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);
            load_item_to_overlay(url_to_preview);


            jQuery("#overlay").stop(true).animate({
                opacity: 1
            }, 100, function (  ) {
});


        }

    });


    $(document).bind('close_item_preview', function ( event ) {

        event.preventDefault();

        if (!is_in_cursor_mode()) {

            if ($('.selected').length > 0) {
                $.each($('.selected'), function ( i, item_to_mark ) {


                    var item_to_work_from = jQuery(item_to_mark);
                    var url_to_preview = item_to_work_from.children('a').attr('href');

                    if (item_to_work_from.hasClass('unread')) {
                        item_to_work_from.removeClass('unread');
                        item_to_work_from.addClass('read');
						/*
						jQuery("#overlay").stop(true).animate({
							opacity: 0,
						}, 500, function() {
					        jQuery("#overlay").html('');
						});
						*/
                    }
                    var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g, "");

                    if (jQuery(thekey).length > 0) {

                        var item_to_work_from = jQuery(item_to_mark);

                        if (item_to_work_from.hasClass('unseen')) {
                            item_to_work_from.removeClass('unseen');
                            item_to_work_from.addClass('seen');
                        }
                        url_to_preview = item_to_work_from.children('a').attr('href');

                        jQuery("#overlay").stop(true).animate({
                            opacity: 0
                        }, 500, function (  ) {

                            jQuery("#overlay").html('');
                        });

                    }

                });

            } else {

                jQuery("#overlay").stop(true).animate({
                    opacity: 0
                }, 500, function (  ) {

                    jQuery("#overlay").html('');
                });

            }

        } else {

            var item_to_work_from = jQuery('.cursor');

            if (item_to_work_from.hasClass('unseen')) {
                item_to_work_from.removeClass('unseen');
                item_to_work_from.addClass('seen');
            }
            
            url_to_preview = item_to_work_from.children('a').attr('href');

            var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g, "");

            if (jQuery(thekey).length > 0) {

                jQuery("#overlay").stop(true).animate({
                    opacity: 0
                }, 500, function (  ) {

                    jQuery("#overlay").html('');
                });

            }

        }

    });


    $(document).bind('results li:not(.favorite_status)', function ( event ) {

        var item_to_work_from = jQuery(this);
        var url_to_preview = item_to_work_from.children('a').attr('href');

        if (item_to_work_from.hasClass('unread')) {
            item_to_work_from.removeClass('unread');
            item_to_work_from.addClass('read');
			/*
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
			*/
        }
        
        if( jQuery(this).hasClass("star_icon") === false && jQuery(this).hasClass("empty_star_icon") === false) {
	        
	        var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g, "");
	
	        if (jQuery(thekey).length > 0 && jQuery(item_to_work_from).hasClass('selected')) {
	            jQuery("#overlay").stop(true).animate({
	                opacity: 0
	            }, 500, function (  ) {

	                jQuery("#overlay").html('');
	            });
	        } else if (!jQuery(item_to_work_from).hasClass('selected')) {
	
	            jQuery("#overlay").stop(true).animate({
	                opacity: 1
	            }, 100, function (  ) {
});
	
	            load_item_to_overlay(url_to_preview);
	
	        }
	
	        item_to_work_from.addClass('selected');

		}
		
    });

    $(".selected").live('click', function ( event ) {

        $(this).removeClass('selected');
    });

    $("#results li").live('mouseleave', function ( event ) {

		/*
		jQuery("#overlay").stop(true).animate({
			opacity: 0,
						
		
		}, 500, function() {
		} ).html('');
		*/
    });
		if (window.webkitNotifications) {
	
	} else {
	
	}
	
	
	function createNotificationInstance( options ) {
	jQuery(document).trigger('createNotificationInstance');

	    if (options.notificationType == 'simple') {
	        return window.webkitNotifications.createNotification('fire.png', 'Notification Title', 'Notification content...');
	    } else if (options.notificationType == 'html') {
	        return window.webkitNotifications.createHTMLNotification('http://someurl.com');
	    }
	}
	
	function send_notification_to_desktop(  ) {
	jQuery(document).trigger('send_notification_to_desktop');

	
	    if (window.webkitNotifications.checkPermission() == 0) {
	
	        notification_test = createNotificationInstance({
	            notificationType: 'html'
	        });
	        notification_test.ondisplay = function (  ) {
};
	        notification_test.onclose = function (  ) {
};
	        notification_test.show();
	    } else {
	        window.webkitNotifications.requestPermission();
	    }
	
	
	}
	
	function notify_user_of_new_items( number, thetype, thecompany ) {
	jQuery(document).trigger('notify_user_of_new_items');

	
	    if ((Buleys.view.type === thetype && thecompany === Buleys.view.slug) || Buleys.view.type == "home" || typeof Buleys.view.type === "undefined") {
	        flash_console("<p>" + number + " new items added to " + thetype + " " + thecompany + " </p>");
	    }
	
	}
	

		function do_pending_crawl(  ) {
	jQuery(document).trigger('do_pending_crawl');

	
	    var topic_slug = Buleys.queues.pending_crawls.splice(0, 1);
	
	    var split_string = topic_slug[0].split("_", 1);
	
	    var type_to_get = split_string[0];
	    var company_to_get = topic_slug[0].replace((split_string[0] + "_"), "");
	
	
	
	
	    var the_url;
	    the_url = "http://static.buleys.com/js/collections/" + type_to_get + "/" + company_to_get + ".js";
	
	    $.ajax({
	
	        url: the_url,
	        dataType: 'jsonp',
	        jsonpCallback: 'load_collection',
	        error: function (  ) {

	            $("#index").html("<li class='item'>No results.</li>");
	        },
	        success: function ( data ) {

	
	
	            add_items(data.items, type_to_get, company_to_get);
	
	
	
	        }
	    });
	
	
	}
	
	
		
	function check_for_waiting_items(  ) {
	jQuery(document).trigger('check_for_waiting_items');

	
	
	
	    notify_user_of_new_items(Buleys.queues.new_items, type_to_get, company_to_get);
	
	}


function send_text_to_overlay( text_to_send ) {
	jQuery(document).trigger('send_text_to_overlay');

    jQuery("#overlay").html('').append(text_to_send);
}

function send_to_overlay( text ) {
	jQuery(document).trigger('send_to_overlay');
	console.log('send_to_overlay()', text );
    send_text_to_overlay(text);
    jQuery("#overlay").stop(true).animate({
        opacity: 1
    }, 500);
}
function hide_overlay(  ) {
	jQuery(document).trigger('hide_overlay');

    jQuery("#overlay").stop(true).animate({
        opacity: 0
    }, 500);
    jQuery("#overlay").html('').removeClass();
}
	
function load_item_to_overlay( item_key ) {
	jQuery(document).trigger('load_item_to_overlay');

	console.log('load_item_to_overlay()', item_key );
    get_item_for_overlay(item_key);
    check_if_item_is_favorited_for_overlay(item_key);
    check_item_vote_status_for_overlay(item_key);
    get_item_categories_for_overlay(item_key);
}

function get_item_for_overlay( item_url ) {

	jQuery(document).trigger('get_item_for_overlay');

	console.log('get_item_for_overlay()', item_url );
	var on_success = function ( context ) {
	var item_request = context.event;
	var result = item_request.target.result;
        if (typeof result !== 'undefined' && typeof result.link === 'string') {
            var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><div class="close_sidebar_link cross_icon" id="' + item_url + '"></div></div>' + "<div id='overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + result.link + "' class='overlay_headline'>" + result.title + "</a></div></div><div id='overlay_left'></div>";
            send_to_overlay(html_snippit);
            /*
            <div id='overlay_controls'><a href='" + item_url + "' class='favorite_item'>Favorite</a>&nbsp;<a href='" + item_url + "' class='unfavorite_item'>Unfavorite</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_read'>Mark as read</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unread'>Mark as unread</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_seen'>Mark as seen</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + item_url + "' class='archive_item'>Archive</a>&nbsp;<a href='" + item_url + "' class='delete_item'>Delete</a>&nbsp;<a href='" + item_url + "' class='unarchive_item'>Unarchive</a>&nbsp;<a href='" + item_url + "' class='vote_item_up'>Vote up</a>&nbsp;<a href='" + item_url + "' class='vote_item_down'>Vote down</a>&nbsp;<a href='" + item_url + "' class='close_item_preview'>Close preview</a></div>
            */
        }
    };
    var on_error = function ( context ) {
	console.log('Error sending item to overlay', item_url );
    };
    
	InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );
}
function open_preview(  item_to_preview  ) {
	jQuery(document).trigger('open_preview');

		var item_to_work_from = jQuery("#" + item_to_preview);
		console.log(item_to_work_from);
                if (item_to_work_from.hasClass('unseen')) {
                    item_to_work_from.removeClass('unseen');
                    item_to_work_from.addClass('seen');
                }
                url_to_preview = item_to_work_from.children('a').attr('href');
		console.log(url_to_preview);
		console.log(Buleys.view.slug);
		console.log(Buleys.view.type);
                mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);
                load_item_to_overlay(url_to_preview);

                jQuery("#overlay").stop(true).animate({
                    opacity: 1
                }, 100, function (    ) {

		});
}
	
	function save_queues(  ) {
	jQuery(document).trigger('save_queues');

	
	    add_or_update_queue("new_items", Buleys.queues.new_items);
	    add_or_update_queue("pending_crawls", Buleys.queues.pending_crawls);
	
	}

	
	
	function get_queues(  ) {
	jQuery(document).trigger('get_queues');

	
	    try {
	
	        new_queue_transaction();
	        Buleys.index = Buleys.objectStore.index("queue_name");
	
	        var cursorRequest = Buleys.index.openCursor();
	        cursorRequest.onsuccess = function ( event ) {

	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function ( k, item ) {

	
	                });
	            }
	
	        };
	        request.onerror = function ( event ) {

	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	function remove_queue( queue_name ) {
	jQuery(document).trigger('remove_queue');

	
	    new_queue_transaction();
	
	    var request = Buleys.objectStore["delete"](queue_name);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	}
	
	function load_all_queues_into_dom(  ) {
	jQuery(document).trigger('load_all_queues_into_dom');

	
	    new_queue_transaction();
	
	
	    var item_request = Buleys.objectStore.openCursor();
	
	    item_request.onsuccess = function ( event ) {

	        if (typeof item_request.result !== 'undefined') {
	
	
	            if (item_request.result.length >= 0) {
	                jQuery.each(item_request.result, function ( k, item ) {

	
	                    Buleys.queues[item.queue_name] = item.queue_value;
	
	                });
	            }
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_or_update_queue( queue_name, queue_value ) {
	jQuery(document).trigger('add_or_update_queue');

	
	    new_queue_transaction();
	    if (typeof queue_value == 'undefined') {
	        queue_value = '';
	    }
	
	    var item_request = Buleys.objectStore.get(queue_name);
	
	    item_request.onsuccess = function ( event ) {

	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_queue_to_queues_database(queue_name, queue_value);
	        } else {
	
	            update_queue_in_queues_database(queue_name, queue_value);
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_queue_to_queues_database( queue_name, queue_value ) {
	jQuery(document).trigger('add_queue_to_queues_database');

	
	
	    new_queue_transaction();
	
	    var data = {
	        "queue_name": queue_name,
	        "queue_value": queue_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function update_queue_in_queues_database( queue_name, queue_value ) {
	jQuery(document).trigger('update_queue_in_queues_database');

	
	
	    new_queue_transaction();
	
	    var data = {
	        "queue_name": queue_name,
	        "queue_value": queue_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	
	function new_queue_transaction(  ) {
	jQuery(document).trigger('new_queue_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["queue"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	
	        };
	        Buleys.objectStore = transaction.objectStore("queue");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10 ) );
	        request.onsuccess = function ( e ) {

	
	            Buleys.objectStore = Buleys.db.createObjectStore("queue", {
	                "keyPath": "queue_name"
	            }, true);
	
	            Buleys.objectStore.createIndex("queue_value", "queue_value", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function ( e ) {

	
	        };
	
	
	    };
	}
	
	

function get_read( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	/* Action */

	jQuery(document).trigger('get_read');

	/* Defaults */

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Callbacks */

	cursor_on_success = function ( context_1 ) {

		var event_1 = context_1.event;
		var item_1 = InDB.cursor.value( event_1 );
		if ( null === item_1 ) {
			return;
		}
		console.log('got from status db ',event_1,item_1);

		if( !make_inverse ) {
			get_item_raw( item_1.link );
			return;
		} else {

			var seen_on_success = function( context_2 ) { 
				
				var event_2 = context_2.event;
				var item_2 = InDB.cursor.value( event_2 );

				// Proceed if:
				// 1) Item is unseen (isEmpty) but we want to get unseen (make_inverse = true)
				// 2) Item is seen (!isEmpty) and we want to get seen
				console.log('seen_on_success', item_2 );
				if( ( !InDB.isEmpty( item_2 ) && true !== make_inverse ) || ( InDB.isEmpty( item_2 ) && true === make_inverse )  ) { 

					if (jQuery("#" + item_1.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {

						console.log('getting raw item in get_read() > ', item_1.link );
						get_item_raw(item_1.link);

					}

				}

			};

			var seen_on_error = function( context_2 ) {

			};
			
			InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item_1.link, 'on_success': seen_on_success, 'on_error': seen_on_error } );

		}

	};

	cursor_on_error = function ( event ) {

	};

	/* Request */

	if( !!make_inverse ) {	

		InDB.trigger( 'InDB_do_cursor_get', { 'store': 'categories', 'index': 'slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

	} else {

		InDB.trigger( 'InDB_do_cursor_get', { 'store': 'status', 'index': 'topic_slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

	}

}



function mark_item_as_read( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_read');
	
	/* Setup */

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var add_on_success = function ( context ) {
		console.log( 'mark_item_as_read() success', context );
	};

	var add_on_error = function ( context ) {
		console.log( 'mark_item_as_read() error', context );
	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'status', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

};


function remove_item_from_read_database( item_url, item_slug, item_type ) {

	/* Action */
	
	jQuery(document).trigger('remove_item_from_read_database');

	/* Callbacks */

	var add_on_success = function ( event ) {

	};

	var add_on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'status', 'key': item_url, 'on_success': add_on_success, 'on_error': add_on_error } );

}

	
function add_item_to_readstatus_database( item, status ) {

	/* Action */

	jQuery(document).trigger('add_item_to_readstatus_database');

	/* Defaults */

	if (typeof status == 'undefined') {
		status = "unread";
	}

	/* Setup */

	var data = {
		"link": item.link,
		"status": status,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var add_on_success = function ( event ) {

	};

	var add_on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'status', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

}

/**
 * Seen.js
 **/


function get_seen( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {

	/* Debug */

	if( !!InDB.debug ) {
		console.log( 'get_seen', type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse );
	}

	/* Action */

	jQuery(document).trigger('get_seen');

	/* Defaults */

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Callbacks */

	var on_success = function ( context_1 ) {

		/* Setup */

		var event_1 = context_1.event;
		var result = event_1.target.result;
		var item = result.value;

		/* Callbacks */

		var item_on_success = function ( context_2 ) {

			var event_2 = context_2.event;
			if (typeof event_2.target.result !== 'undefined' && make_inverse !== true) {

				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item( item.link );
				}

			} else if (typeof event_2.target.result == 'undefined' && make_inverse == true) {

				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item( item.link );
				}

			}

		};
		
		var item_on_error = function( context_2 ) {
			console.log( 'error in get_seen', context_2 );
		}		

		/* Request */

		InDB.trigger( 'InDB_do_row_get', { 'store': 'items', 'key': item.link, 'on_success': item_on_success, 'on_error': item_on_error } );

	};

	var on_error = function( context ) {
		console.log('Failure in get_seen()', context );
	}

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'status', 'index': 'topic_slug', 'keyRange': InDB.range.only( slug_filter ), 'on_success': on_success, 'on_error': on_error } );
	
}



function mark_item_as_seen( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_seen');

	/* Setup */

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two vars are gratuitous	
function mark_item_as_unseen( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_unseen');

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function add_item_as_seen( item_url ) {

	/* Action */

	jQuery(document).trigger('add_item_as_seen');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	};

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: Function name really descriptive of method
function check_if_item_is_seen( item_url ) {

	/* Action */

	jQuery(document).trigger('check_if_item_is_seen');

	/* Callbacks */

	var on_success = function ( context ) {
		var item_request = context.event;
		if (typeof item_request.result != 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('seen');
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unseen');
		}
	};

	var on_error = function ( e ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}

function add_item_to_seens_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('add_item_to_seens_database');	

	/* Setup */
	
	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( event ) {

	};

	var on_error = function ( e ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'seen', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

//TODO: two gratuitious args	
function remove_item_from_seens_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_seens_database');

	/* Callbacks */

	var on_success = function ( event ) {
	
	};

	var on_error = function (  ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'seen', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}
	//	Buleys.settings = {};
	//  ^ declared in loader.js
	
	function new_settings_transaction(  ) {
	jQuery(document).trigger('new_settings_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["settings"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	        };
	        Buleys.objectStore = transaction.objectStore("settings");
	    } catch (e) {
	        var request = Buleys.db.setVersion( parseInt(Buleys.version) );
	        request.onsuccess = function ( e ) {

	            Buleys.objectStore = Buleys.db.createObjectStore("settings", {
	                "keyPath": "option_name"
	            }, true);
	            Buleys.objectStore.createIndex("option_value", "option_value", {
	                unique: false
	            });
	        };
	        request.onerror = function ( e ) {

	        };
	    };
	}
	
		
	function get_settings(  ) {
	jQuery(document).trigger('get_settings');

	
	    console.log("get_settings(): ");
	    Buleys.view.loaded = "settings";
	    get_settings();
	
	    var session_id = get_local_storage("session_id");
	    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
	        jQuery("#main").append('<div id="account"><input id="password" type="password" value="p4s5w0rd" name="password" /><br/><br/><a href="#" id="update_settings_button" class="update_settings">Update</a> or <a href="#" id="clear_form_button" class="clear_form">Clear</a></div></div></div>');
	    } else {
	        jQuery("#main").append("<div id='account'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
	    }
		
		 jQuery("#main").append('<input type="number" min="0" max="10" step="2" value="6"> <input type="number" min="0" max="10" step="2" value="6">');
		 
	
	}
	
	function get_settings_old(  ) {
	jQuery(document).trigger('get_settings_old');

	
	    try {
	
	        new_settings_transaction();
	        Buleys.index = Buleys.objectStore.index("option_name");
	
	        var cursorRequest = Buleys.index.openCursor();
	        cursorRequest.onsuccess = function ( event ) {

	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }

	            if (objectCursor.length >= 0) {
	                Buleys.view.type = "settings";
	                jQuery.each(objectCursor, function ( k, item ) {

	                    console.log("get_settings(): " + item);
	                });
	            }
	
	        };
	        request.onerror = function ( event ) {

	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	
		
	function save_settings(  ) {
	jQuery(document).trigger('save_settings');

	
	    add_or_update_setting("hotkeys", Buleys.settings);
//	    add_or_update_setting("profile", Buleys.profile);
	
	}


	
	function load_settings_into_dom(  ) {
	jQuery(document).trigger('load_settings_into_dom');

	
	    new_settings_transaction();
	
	    Buleys.index = Buleys.objectStore.index();
	
	
	    var cursorRequest = Buleys.objectStore.openCursor();
	    cursorRequest.onsuccess = function ( event ) {

	
	        new_settings_transaction();
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	
	            return;
	        }
	
	
	
	
	        if (objectCursor.length >= 0) {
	            jQuery.each(objectCursor, function ( k, item ) {

	
	                Buleys.settings[k] = item;
	
	            });
	        }
	
	    };
	    request.onerror = function ( event ) {

	
	    };
	
	
	}
	

	
	function remove_setting( option_name ) {
	jQuery(document).trigger('remove_setting');

	
	    new_settings_transaction();
	
	    var request = Buleys.objectStore["delete"](option_name);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	}
	
	function load_all_settings_into_dom(  ) {
	jQuery(document).trigger('load_all_settings_into_dom');

	
	    new_settings_transaction();
	
	
	    var item_request = Buleys.objectStore.openCursor();
	
	    item_request.onsuccess = function ( event ) {

	        if (typeof item_request.result !== 'undefined') {
	
	
	            if (item_request.result.length >= 0) {
	                jQuery.each(item_request.result, function ( k, item ) {

	
	                    Buleys.settings[item.option_name] = item.option_value;
	
	                });
	            }
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_or_update_setting( option_name, option_value ) {
	jQuery(document).trigger('add_or_update_setting');

	
	    new_settings_transaction();
	    if (typeof option_value == 'undefined') {
	        option_value = '';
	    }
	
	    var item_request = Buleys.objectStore.get(option_name);
	
	    item_request.onsuccess = function ( event ) {

	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_setting_to_settings_database(option_name, option_value);
	        } else {
	
	            update_setting_in_settings_database(option_name, option_value);
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_setting_to_settings_database( option_name, option_value ) {
	jQuery(document).trigger('add_setting_to_settings_database');

	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function update_setting_in_settings_database( option_name, option_value ) {
	jQuery(document).trigger('update_setting_in_settings_database');

	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
function get_settings_page(  ) {
	jQuery(document).trigger('get_settings_page');

    var session_id = get_local_storage("session_id");
    if( typeof session_id === "undefined" || session_id === null ) {
    	jQuery("#main").append("<div od='login_prompt'>Logged in with session id <code>" +  + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
    } else {
    	jQuery("#main").append("<div id='configuration_panel'><h3>Configuration</h3><p><input type='range' min='0' max='10' step='2' value='6'></p><p><input type='number' min='0' max='10' step='2' value='6'></p></div>");
    }

}

function get_setting_type( setting_to_get ) {
	jQuery(document).trigger('get_setting_type');

    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting_type( setting_to_set, setting_value ) {
	jQuery(document).trigger('set_setting_type');

    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}

function get_setting( setting_to_get ) {
	jQuery(document).trigger('get_setting');

    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting( setting_to_set, setting_value ) {
	jQuery(document).trigger('set_setting');

    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}



    $('.get_settings').live('click', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_settings clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = 'http://www.buleys.com/settings';
        console.log(history);
        history.pushState(stateObj, "settings", urlString);
        reload_results();
    });

	function new_social_transaction(    ) {
	jQuery(document).trigger('new_social_transaction');

	jQuery(document).trigger('new_social_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["social"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (  e  ) {


	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (  e  ) {


	
	        };
	        Buleys.objectStore = transaction.objectStore("social");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion( parseInt(Buleys.version, 10 ) );
	        request.onsuccess = function (  e  ) {


	
	            Buleys.objectStore = Buleys.db.createObjectStore("social", {
	                "keyPath": "link"
	            }, true);
	
	            Buleys.objectStore.createIndex("source", "source", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("type", "type", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	
	
	
	        };
	        request.onerror = function (  e  ) {


	
	        };
	
	
	    };
	}
	
Buleys.socket = io.connect('http://localhost:8080');

Buleys.socket.on('connect',function() {
	socket_login();
});

Buleys.socket.on('disconnect',function() {

});

Buleys.socket.on( 'data', function( data ) {
	data= jQuery.parseJSON( data );
	console.log( 'topic',data.topic );
	console.log( 'score', data.score );
	console.log( 'mess', data.data );
});


function socket_login() {
	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'none', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
}

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
	function getURLSlug( rough ) {
	jQuery(document).trigger('getURLSlug');

	    var type = typeof rough;
	    if (type != 'object') {
	        if (rough != null && rough != "undefined" && rough != '') {
	            var itemID = '';
	            rough.toLowerCase();
	            itemID = rough;
	
	            itemID = itemID.replace(/ - /g, "_");
	            itemID = itemID.replace(/ /g, "_");
	            itemID = itemID.replace(/\'s/g, "");
	            itemID = itemID.replace(/ - /g, "_");
	            itemID = itemID.replace(/-/g, "_");
	            itemID = itemID.replace('/%20/g', "_");
	            itemID = itemID.replace(/&/, "and");
	            itemID = itemID.replace('/%26/g', "and");
	            itemID = itemID.replace('.', "");
	
	            return itemID;
	        }
	    }
	}
	
	
	function new_subscriptions_transaction(  ) {
	jQuery(document).trigger('new_subscriptions_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["subscriptions"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	        };
	        Buleys.objectStore = transaction.objectStore("subscriptions");
	    } catch (e) {
	        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10 ) );
	        request.onsuccess = function ( e ) {

	            Buleys.objectStore = Buleys.db.createObjectStore("subscriptions", {
	                "keyPath": "key"
	            }, true);
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	        };
	        request.onerror = function ( e ) {

	        };
	    };
	}
	
	function add_subscription_to_subscriptions_database( the_type, the_key ) {
	jQuery(document).trigger('add_subscription_to_subscriptions_database');

	    new_subscriptions_transaction();
	    var data = {
	        "key": the_type + "_" + the_key,
	        "modified": new Date().getTime()
	    };
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	    };
	}
	
	function get_page_subscription_status( the_type, the_key ) {
	jQuery(document).trigger('get_page_subscription_status');

	    new_subscriptions_transaction();
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	    item_request.onsuccess = function ( event ) {

	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	            jQuery("#page_subscription_status").html("<div class='subscribe_topic empty_mail_icon'></div>");
	        } else {
	            jQuery("#page_subscription_status").html("<div class='unsubscribe_topic mail_icon'></div>");
	        }
	    };
	    item_request.onerror = function ( e ) {

	    };
	}
	
	function remove_subscription( the_type, the_key ) {
	jQuery(document).trigger('remove_subscription');

	
	
	    new_subscriptions_transaction();
	
	    var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	
	
	}
	
	function add_subscription_if_doesnt_exist( the_type, the_key ) {
	jQuery(document).trigger('add_subscription_if_doesnt_exist');

	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	        new_subscriptions_transaction();
	
	        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	        item_request.onsuccess = function ( event ) {

	
	
	
	            if (typeof item_request.result == 'undefined') {
	
	                add_subscription_to_subscriptions_database(the_type, the_key);
	            } else {
	
	            }
	        };
	
	        item_request.onerror = function ( e ) {

	
	
	        };
	    }
	
	}


	function get_subscriptions(  ) {
	jQuery(document).trigger('get_subscriptions');

	
	    new_subscriptions_transaction();
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStoreCategories.index("id");
	
	        var cursorRequest = Buleys.index.openCursor();
	        cursorRequest.onsuccess = function ( event ) {

	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function ( k, item ) {

	
	                });
	            }
	
	        };
	        request.onerror = function ( event ) {

	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	

    $('.subscribe_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined' || the_key == "" ) {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }
        add_subscription_if_doesnt_exist(the_type, the_key);
        post_feedback('subscribe', "", the_key, the_type);

        $(this).removeClass('empty_mail_icon').addClass('mail_icon');
        $(this).removeClass('subscribe_topic');
        $(this).addClass('unsubscribe_topic');
    });

    $('.unsubscribe_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined' || the_key == "" ) {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }

        remove_subscription(the_type, the_key);
        post_feedback('unsubscribe', "", the_key, the_type);

        $(this).removeClass('mail_icon').addClass('empty_mail_icon');
        $(this).removeClass('unsubscribe_topic');
        $(this).addClass('subscribe_topic');
    });

	


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

	/*not mine*/
	
	function minutes_ago( time ) {
	jQuery(document).trigger('minutes_ago');

	
	    var d = Date.parse(time);
	    var dateFunc = new Date();
	    var timeSince = dateFunc.getTime() - d;
	    var inSeconds = timeSince / 1000;
	    var inMinutes = timeSince / 1000 / 60;
	    var inHours = timeSince / 1000 / 60 / 60;
	    var inDays = timeSince / 1000 / 60 / 60 / 24;
	    var inYears = timeSince / 1000 / 60 / 60 / 24 / 365;
	
	    return inMinutes;
	
	}
	

/**
 *  Topic.js
 **/


function parse_single_topic( topic_slug ) {

	/* Action */

	jQuery(document).trigger('parse_single_topic');

	/* Setup */

	var split_string = topic_slug.split("_");
	var type_to_get = split_string[0];
	var company_to_get = split_string[1];
	var item = Buleys.queues.pending_crawls.slice(0, 1);
	
	/* Work */

	Buleys.queues.pending_crawls.push( topic_slug );

}


function update_topic_in_topics_database( topic_key, topic ) {

	/* Action */

	jQuery(document).trigger('update_topic_in_topics_database');

	/* Setup */

	topic.topic_key = topic_key;

	/* Defaults */

	topic.modified = new Date();

	if (typeof topic.last_updated != 'undefined') {
	    topic.last_updated = new Date(parseInt(topic.last_updated) * 1000);
	}
	if (typeof topic.updated != 'undefined') {
	    topic.updated = new Date(parseInt(topic.updated) * 1000);
	}
	if (typeof topic.last_attempt != 'undefined') {
	    topic.last_attempt = new Date(parseInt(topic.last_attempt) * 1000);
	}

	/* Requests */

	InDB.trigger( 'InDB_row_put', { 'store': 'topic', 'data': topic, 'on_success': on_success, 'on_failure': on_failure } );

}



function get_page_topic_info( the_type, the_key ) {

	/* Action */

	jQuery(document).trigger('get_page_topic_info');

	/* Callbacks */

	var on_success = function ( context ) {

	    if (typeof context.event.result !== 'undefined') {
			load_page_title_info( context.event.result);	
			// TODO: Use or lose the commented code below
			/*
			if (typeof item_request.result.name != 'undefined') {
			    jQuery("#page_title").html("<a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a>");
			    window.document.title = window.document.title.replace(/[|\s]*?Buley's/, "");
			    window.document.title = window.document.title + item_request.result.name + " | Buley's";

			} else {
				jQuery("#page_title").html("");
			}

			if (typeof item_request.result.subsector != 'undefined') {
			    jQuery("#subtitle_1").html("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
			} else {
				jQuery("#subtitle_1").html("");
			}

			if (typeof item_request.result.sector != 'undefined') {
			    jQuery("#subtitle_2").html("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
			} else {
				jQuery("#subtitle_2").html("");
			}
			*/	

	    }
	};

	var on_error = function ( e ) {
		console.log('error getting topic', e );
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'topics', 'key': ( the_type + "_" + the_key ), 'index': null, 'on_success': on_success, 'on_error': on_error } );

}


function get_topics( ) {

	/* Action */

	jQuery(document).trigger('get_topics');

	/* Callbacks */

	var on_success = function( context ) {
		console.log( InDB.row.value( context.event ) );
	}

	var on_error = function( context ) {
		console.log( 'There was an error in get_topics()' );
	}

	/* Request */

	InDB.trigger( 'InDB_cursor_get', { 'store': 'topics', 'index': 'topic_key', 'keyRange': InDB.transaction.left_open( '0' ) /* Everything */ } );	

}


function remove_topic( topic_key ) {

	/* Action */

	jQuery(document).trigger('remove_topic');

	/* Callbacks */

	var on_success = function ( context ) {
			console.log( 'Removed topic successfully', context );
	};

	var on_error = function ( context ) {
		console.log( 'There was an error removing the topic', context );
	};

	/* Request */
	
	InDB.trigger( 'InDB_row_delete', { 'store': topic, 'key': topic_key, 'on_success': on_success, 'on_error': on_error } );

}

function add_or_update_topic( topic ) {

	/* Action */
	
	jQuery(document).trigger('add_or_update_topic');

	/* Defaults */

	if (typeof topic == 'undefined') {
		topic = {};
	}

	/* Callbacks */
	
	var on_success = function( context ) {
		console.log( 'Topic added or updated', context );
	}

	var on_error = function( context ) {
		console.log( 'There was an error adding or updating the topic', context );
	}

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'topics', 'data': topic, 'on_success': on_success, 'on_error': on_error } );

}

function add_topic_to_topics_database( topic_key, topic ) {

	/* Action */

	jQuery(document).trigger('add_topic_to_topics_database');

	/* Setup */

	topic.topic_key = topic_key;

	/* Defaults */

	if (typeof topic == "undefined") {
		var topic = {};
	}

	topic.modified = new Date();

	/* Callbacks */

	var on_success = function ( context ) {
		
		/* Debug */
	
		if( !!Buleys.debug ) {
			console.log( 'topic.js > add_topic_to_topics_database() > on_success', context );
		}
	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'topics', 'data': topic, 'on_success': on_success, 'on_error': on_error } );

}

/** 
 * Trash.js
 **/

function get_deleted( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {
	
	/* Action */

	jQuery(document).trigger('get_deleted', { "type_filter": type_filter, "slug_filter": slug_filter, "begin_timeframe":begin_timeframe, "end_timestamp":end_timeframe, "make_inverse": make_inverse } );

	/* Default */

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Request */

	var cursor_on_success = function ( context_1 ) {

		var result = context_1.event.target.result;
		var item = result.value;
		
		var deleted_on_success = function ( context_2 ) {

			/* Setup */

			var event_2 = context_2.event;

			if( typeof event_2.target.result !== 'undefined' ) {

				/* Setup */

				var on_success_2, on_error_2;

				/* Work */

				// TODO: These don't actually handle asc/desc
				if( make_inverse !== true) {
					on_success_2 = function ( event ) {
						if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
							if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
								get_item_raw_no_trash(event.target.result.link);
							}
						} 
					};
	
				} else {
					on_success_2 = function ( event ) {
						if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
							if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
								get_item_raw_no_trash(event.target.result.link);
							}
						} 
					};
				}

				on_error_2 = function( context ) {

				}

				InDB.trigger( 'InDB_do_row_get', { 'context': 'deleted', 'key': item.link, 'on_success': on_success_2, 'on_error': on_error_2 } );

			}

		}

		var deleted_on_error = function ( context ) {

		}
	
		/* Request */

		InDB.trigger( 'InDB_do_row_put', { 'context': 'deleted', 'key': item.link, 'on_success': deleted_on_success, 'on_error': deleted_on_error } );

	};

	var cursor_on_error = function ( context ) {
	
	};

	/* Request */

	InDB.trigger( 'InDB_do_cursor_get', { 'context': 'categories', 'keyRange': InDB.range.only( slug_filter ), 'index': 'slug', 'on_success': cursor_on_success, 'on_error': cursor_on_error } );
	
}

function mark_item_as_deleted( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_deleted');

	/* Setup */

	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( event ) {
	
	};

	var on_error = function ( e ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function mark_item_as_undeleted( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('mark_item_as_undeleted');

	/* Callbacks */

	var on_success = function ( context ) {
		recreate_item( item_url );	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function delete_item( item_url, the_type, the_slug ) {

	/* Action */

	jQuery(document).trigger('delete_item');

	/* Setup */

	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};

	/* Request */

	var on_success = function ( event ) {
		//commenting this out allows for item restoration
		//remove_item_from_items_database(item_url, the_type, the_slug);
		remove_item_from_favorites_database(item_url, the_type, the_slug);
		remove_item_from_categories_database(item_url, the_type, the_slug);
		remove_item_from_archives_database(item_url, the_type, the_slug);
		remove_item_from_seens_database(item_url, the_type, the_slug);
		remove_item_from_read_database(item_url, the_type, the_slug);
	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}


function undelete_item( item_url, the_type, the_slug ) {
	
	/* Action */

	jQuery(document).trigger('undelete_item');

	/* Callbacks */

	var on_success = function ( context ) {
		recreate_item( item_url );	
	};

	var on_error = function ( context ) {

	};
	
	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );
	
}


function check_if_item_is_deleted( item_url ) {

	/* Action */

	jQuery(document).trigger( 'check_if_item_is_deleted', { "item_url": item_url } );

	/* Callbacks */

	var on_success = function ( context ) {
		var item_request = context.event;
		if (typeof item_request.result != 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link star_icon'></a></span>");
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('deleted');
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link empty_star_icon'></a></span>");
		}
	};

	var on_error = function ( e ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}


function add_item_to_deletes_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('add_item_to_deletes_database');

	/* Setup */

	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( context ) {

	}

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'context': 'deleted', 'data': data, 'on_success': on_success, 'on_error': on_error } );
	
}


function remove_item_from_deletes_database( item_url, item_slug, item_type ) {

	/* Action */

	jQuery(document).trigger('remove_item_from_deletes_database');

	/* Callbacks */

	var on_success = function ( context ) {

	}

	var on_error = function ( context ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'context': 'deleted', 'key': item_url, 'on_success': on_success, 'on_error': on_error } );

}
$('body').bind('favorite', function ( event ) {

    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function ( i, item_to_mark ) {

            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
            add_item_to_favorites_database($(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            post_feedback('star', $(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            send_to_console("<p>item favorited</p>");
            setTimeout('fade_console_message()', 1000);
        });
    } else {
        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
        jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
        jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
        add_item_to_favorites_database($('.cursor a').attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('star', $('.cursor a').attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item favorited</p>");
        setTimeout('fade_console_message()', 1000);
    }

});

$('body').bind('favorite', function ( event ) {

    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function ( i, item_to_mark ) {

            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
            remove_item_from_favorites_database($(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            post_feedback('unstar', $(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
            send_to_console("<p>item removed from favorites</p>");
            setTimeout('fade_console_message()', 1000);
        });
    } else {
        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
        jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
        jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
        remove_item_from_favorites_database($('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('unstar', $('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item removed from favorites</p>");
        setTimeout('fade_console_message()', 1000);
    }
});

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




/**
 * Items.js
 **/


function check_item_vote_status_for_overlay( item_url ) {

	/* Action */

	jQuery(document).trigger('check_item_vote_status_for_overlay');

	/* Callbacks */
	var on_success = function ( context_1 ) {

		/* Setup */

		var event = context_1.event;

		/* UI */

		if (typeof event.target.result !== 'undefined') {
			console.log("VOTE VALUE", event.target.result, event.target.result.vote_value );
			if (event.target.result.vote_value == -1) {
				jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down vote thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			} else if (event.target.result.vote_value == 1) {
				jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up vote thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			} else {
				jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
			}

			jQuery("#overlay_left").parent().addClass('voted');

		} else {

			jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');

			jQuery("#overlay_left").parent().addClass('unvoted');

		}

	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_get', { 'store': 'votes', 'key': item_url.replace(/[^a-zA-Z0-9-_]+/g, ""), 'on_success': on_success, 'on_error': on_error } );
	
}

function get_vote_info( the_url, the_type, the_key ) {

	/* Action */

	jQuery(document).trigger('get_vote_info');

	/* Setup */

	var vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_key.toLowerCase();

	/* Callbacks */
	
	var on_success = function ( context ) {

		/* Setup */

		var item_request = context.event;

		/* UI */

		if ( typeof item_request.result !== 'undefined' && item_request.result !== "") {

			if (item_request.result.vote_value == 0) {
				jQuery("#" + vote_key).addClass("voted downvoted");
			} else if (item_request.result.vote_value == 1) {
				jQuery("#" + vote_key).addClass("voted upvoted");
			}

		}
	};

	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'votes', 'key': vote_key, 'on_success': on_success, 'on_error': on_error } );
	
}

// TODO: Do timeframes do anything?
function get_voted( type_filter, slug_filter, vote_value, begin_timeframe, end_timeframe, make_inverse ) {

	/* Action */

	jQuery(document).trigger('get_voted');

	/* Defaults */

	var keyRange;
	if( !!vote_value ) {
		keyRange = InDB.range.left_open( '0' ); // Everything
	} else {
		keyRange = InDB.range.only( vote_value );
	}

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}

	/* Setup */

	var begin_date = 0;
	var end_date = 0;

	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}

	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	/* Callbacks */

	cursor_on_success = function ( context_1 ) {

		var event_1 = context_1.event;
		var item = InDB.cursor.value( event_1 );
	
		if( !InDB.isEmpty( InDB.cursor.value( event_1 ) ) ) { 

			if ( make_inverse !== true) {
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw( item.link );
				}
			} else { 
				if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
					get_item_raw( item.link );
				}
			}
		}

	};

	cursor_on_error = function ( event ) {

	};

	/* Request */
	
	InDB.trigger( 'InDB_do_cursor_get', { 'store': 'voted', 'index': 'vote_value', 'keyRange': keyRange, 'on_success': cursor_on_success, 'on_error': cursor_on_error } );

}


function remove_vote( vote_key ) {
	
	/* Action */

	jQuery( document ).trigger('remove_vote');
	
	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_delete', { 'store': 'votes', 'key': vote_key, 'on_success': on_success, 'on_error': on_error } );

}

function add_or_update_vote( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('add_or_update_vote');

	/* Defaults */
	
	if (typeof vote_value == 'undefined') {
		vote_value = '';
	}

	/* Setup */

	var data = {
		'vote_key': vote_key,
		'vote_value': vote_value,
		"modified": new Date().getTime()
	};
	
	/* Callbacks */

	var on_success = function ( context ) {
		console.log('Successfully updated vote', context );	
	};
	
	var on_error = function ( context ) {
		console.log('Failed to update vote', context );
	};

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

function add_vote_to_votes_database( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('add_vote_to_votes_database');

	/* Setup */

	var data = {
		"vote_key": vote_key,
		"vote_value": vote_value,
		"modified": new Date().getTime()
	};
	
	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_add', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

function update_vote_in_votes_database( vote_key, vote_value ) {

	/* Action */

	jQuery(document).trigger('update_vote_in_votes_database');

	/* Setup */

	var data = {
		"vote_key": vote_key,
		"vote_value": vote_value,
		"modified": new Date().getTime()
	};

	/* Callbacks */

	var on_success = function ( event ) {

	};
	
	var on_error = function ( e ) {

	};

	/* Request */

	InDB.trigger( 'InDB_do_row_put', { 'store': 'votes', 'data': data, 'on_success': on_success, 'on_error': on_error } );

}

$('.vote_up').live('click', function ( event ) {

	event.preventDefault();

	/* Setup */

	var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
	var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (jQuery("#overlay_upvote_" + the_url_slug).hasClass('vote')) {

		/* UI */

		jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().removeClass('voted');

		/* Work */

		post_feedback('item_remove_upvote', the_url, Buleys.view.type, Buleys.view.slug);

		remove_vote(the_url);

	} else {
	
		/* UI */

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');
		jQuery("#overlay_upvote_" + the_url_slug).removeClass('empty_thumb_up_icon').addClass('thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().addClass('voted');
		$(this).addClass('vote');

		/* Work */

		post_feedback('item_upvote', the_url, Buleys.view.type, Buleys.view.slug);

		add_or_update_vote(the_url, 1);

	}
});


$('.vote_down').live('click', function ( event ) {

	event.preventDefault();
	
	/* Setup */

	var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
	var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");

	/* UI */

	if (jQuery("#overlay_downvote_" + the_url_slug).hasClass('vote')) {

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');

		$('.vote').removeClass('vote');
		$(this).parent().removeClass('voted');

		post_feedback('item_remove_downvote', the_url, Buleys.view.type, Buleys.view.slug);
		
		remove_vote(the_url);

	} else {

		jQuery("#overlay_downvote_" + the_url_slug).removeClass('empty_thumb_icon').addClass('thumb_icon');
		jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');

		$('.vote').removeClass('vote');
		$(this).parent().addClass('voted');
		$(this).addClass('vote');

		post_feedback('item_downvote', the_url, Buleys.view.type, Buleys.view.slug);

		add_or_update_vote(the_url, -1);

	}

});
var results = [];

function resultReceiver( event ) {
	jQuery(document).trigger('resultReceiver');

  results.push(parseInt(event.data));
  if (results.length == 2) {
    postMessage(results[0] + results[1]);
  }
}

function errorReceiver( event ) {
	jQuery(document).trigger('errorReceiver');

  throw event.data;
}

onmessage = function(event) {
  var n = parseInt(event.data);

  if (n == 0 || n == 1) {
    postMessage(n);
    return;
  }

  for (var i = 1; i <= 2; i++) {
    var worker = new Worker("worker.js");
    worker.onmessage = resultReceiver;
    worker.onerror = errorReceiver;
    worker.postMessage(n - i);
  }
 };
