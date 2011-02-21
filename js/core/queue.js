	
	function save_queues() {
	
	    add_or_update_queue("new_items", Buleys.queues.new_items);
	    add_or_update_queue("pending_crawls", Buleys.queues.pending_crawls);
	
	}

	
	
	function get_queues() {
	
	    try {
	
	        new_queue_transaction();
	        Buleys.index = Buleys.objectStore.index("queue_name");
	
	        var cursorRequest = Buleys.index.getAll();
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	
	                });
	            }
	
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	function remove_queue(queue_name) {
	
	    new_queue_transaction();
	
	    var request = Buleys.objectStore["delete"](queue_name);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	}
	
	function load_all_queues_into_dom() {
	
	    new_queue_transaction();
	
	
	    var item_request = Buleys.objectStore.getAll();
	
	    item_request.onsuccess = function (event) {
	        if (typeof item_request.result !== 'undefined') {
	
	
	            if (item_request.result.length >= 0) {
	                jQuery.each(item_request.result, function (k, item) {
	
	                    Buleys.queues[item.queue_name] = item.queue_value;
	
	                });
	            }
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_or_update_queue(queue_name, queue_value) {
	
	    new_queue_transaction();
	    if (typeof queue_value == 'undefined') {
	        queue_value = '';
	    }
	
	    var item_request = Buleys.objectStore.get(queue_name);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_queue_to_queues_database(queue_name, queue_value);
	        } else {
	
	            update_queue_in_queues_database(queue_name, queue_value);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_queue_to_queues_database(queue_name, queue_value) {
	
	
	    new_queue_transaction();
	
	    var data = {
	        "queue_name": queue_name,
	        "queue_value": queue_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function update_queue_in_queues_database(queue_name, queue_value) {
	
	
	    new_queue_transaction();
	
	    var data = {
	        "queue_name": queue_name,
	        "queue_value": queue_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	function new_queue_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["queue"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("queue");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("queue", {
	                "keyPath": "queue_name"
	            }, true);
	
	            Buleys.objectStore.createIndex("queue_value", "queue_value", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
	    };
	}
	
	