
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
	
