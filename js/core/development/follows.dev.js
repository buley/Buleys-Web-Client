function new_follows_transaction(  ) {
	jQuery(document).trigger('new_follows_transaction');

    try {
        var transaction = Buleys.db.transaction(["follows"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
        transaction.oncomplete = function ( e ) {

            delete Buleys.objectStore;
        };
        transaction.onabort = function ( e ) {

        };
        Buleys.objectStore = transaction.objectStore("follows");
    } catch (e) {
        var request = Buleys.db.setVersion(parseInt(Buleys.version, 10));
        request.onsuccess = function ( e ) {

            Buleys.objectStore = Buleys.db.createObjectStore("follows", {
                "keyPath": "key"
            }, true);
            Buleys.objectStore.createIndex("modified", "modified", {
                unique: false
            });

        var transaction = Buleys.db.transaction(["follows"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
        transaction.oncomplete = function ( e ) {

            delete Buleys.objectStore;
        };
        transaction.onabort = function ( e ) {

        };
        Buleys.objectStore = transaction.objectStore("follows");

        };
        request.onerror = function ( e ) {

        };
    };
}

function get_follows(  ) {
	jQuery(document).trigger('get_follows');

    try {
        new_follows_transaction();
        Buleys.index = Buleys.objectStore;
        var cursorRequest = Buleys.index.openCursor();
        cursorRequest.onsuccess = function ( event ) {

            var objectCursor = cursorRequest.result;
            if (!objectCursor) {
                return;
            }
            if (objectCursor.length >= 0) {
                jQuery.each(objectCursor, function ( k, item ) {

                    parse_single_topic(item.key);
                });
            }
        };
        request.onerror = function ( event ) {

        };
    } catch (e) {
    }
}

$('html').bind('mousemove', function ( e ) {

    Buleys.mouse.mouse_x = e.pageX;
    Buleys.mouse.mouse_y = e.pageY;
});

function getKeys( obj ) {
	jQuery(document).trigger('getKeys');

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

function get_follows_deleteme(  ) {
	jQuery(document).trigger('get_follows_deleteme');

    new_follows_transaction();
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

                    send_to_console("get_follows(): " + item);
                });
            }
        };
        request.onerror = function ( event ) {

        };

    } catch (e) {
    }
}

function get_page_follow_status( the_type, the_key ) {

	jQuery(document).trigger('get_page_follow_status');

	var on_complete = function(e) { console.log( "follow transaction completed" ); }
	var on_error = function(e) { console.log( "follow transaction errored" ); }
	var on_abort = function(e) { console.log( "follow transaction aborted" ); }
	var transaction = InDB.new_transaction( "follows", IDBTransaction.READ_WRITE, on_complete, on_error, on_abort ); 

    	var item_request = follows_transaction.get( the_type + "_" + the_key );

	item_request.onsuccess = function ( event ) {

		if (typeof item_request.result == 'undefined' || item_request.result == "") {
		    jQuery("#page_follow_status").html("<div class='follow_topic empty_heart_icon'></div>");
		} else {
		    jQuery("#page_follow_status").html("<div class='unfollow_topic heart_icon'></div>");
		}
	};
	item_request.onerror = function ( e ) {

	};
}

function remove_follow( the_type, the_key ) {
	jQuery(document).trigger('remove_follow');

    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
        new_follows_transaction();
        var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
        request.onsuccess = function ( event ) {

            delete Buleys.objectId;
        };
        request.onerror = function (  ) {

        };
    }
}

function add_follow_if_doesnt_exist( the_type, the_key ) {
	jQuery(document).trigger('add_follow_if_doesnt_exist');

    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
        new_follows_transaction();
        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
        item_request.onsuccess = function ( event ) {

            if (typeof item_request.result == 'undefined') {
                add_follow_to_follows_database(the_type, the_key);
            } else {
            }
        };
        item_request.onerror = function ( e ) {

        };
    }
}

function add_follow_to_follows_database( the_type, the_key ) {
	jQuery(document).trigger('add_follow_to_follows_database');

    new_follows_transaction();
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

    $('.follow_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == '') {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }

        add_follow_if_doesnt_exist(the_type, the_key);
        post_feedback('follow', '', the_key, the_type);

        $(this).removeClass('empty_heart_icon').addClass('heart_icon');
        $(this).removeClass('follow_topic');
        $(this).addClass('unfollow_topic');

    });
    $('.unfollow_topic').live('click', function ( event ) {

        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = Buleys.view.slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = Buleys.view.type;
        } else {
            the_type = the_type;
        }

        remove_follow(the_type, the_key);
        post_feedback('unfollow', '', the_key, the_type);

        $(this).removeClass('heart_icon').addClass('empty_heart_icon');
        $(this).removeClass('unfollow_topic');
        $(this).addClass('follow_topic');
    });
