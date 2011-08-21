function new_deleted_transaction(  ) {
	jQuery(document).trigger('new_deleted_transaction');
	try {
		var transaction = Buleys.db.transaction(["deleted"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
		transaction.oncomplete = function ( e ) {
			delete Buleys.objectStoreDeleted;
		};
		transaction.onerror = function ( e ) {

		//console.log("new_deleted_transaction error");
		//console.log(e);
		};
		transaction.onabort = function ( e ) {
		//console.log("new_deleted_transaction abort");
		//console.log(e);
		};
		Buleys.objectStoreDeleted = transaction.objectStore("deleted");
	} catch (e) {
		var request = Buleys.db.setVersion(parseInt(Buleys.version,10) );
		request.onsuccess = function ( e ) {

			Buleys.objectStoreDeleted = Buleys.db.createObjectStore("deleted", {
				"keyPath": "link"
			}, true);
			Buleys.objectStoreDeleted.createIndex("topic_slug", "topic_slug", {
				unique: false
			});
			Buleys.objectStoreDeleted.createIndex("topic_type", "topic_type", {
				unique: false
			});
			Buleys.objectStoreDeleted.createIndex("modified", "modified", {
				unique: false
			});
		};
		request.onerror = function ( e ) {

		};
	};
} /* end new_deleted_transaction() */

function get_deleted( type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse ) {
//console.log("get_deleted!");
	jQuery(document).trigger('get_deleted', { "type_filter": type_filter, "slug_filter": slug_filter, "begin_timeframe":begin_timeframe, "end_timestamp":end_timeframe, "make_inverse": make_inverse } );

	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}
	var begin_date = 0;
	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0
	} else {
		begin_date = parseInt(begin_timeframe);
	}
	var end_date = 0;
	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}
	new_categories_transaction();
	Buleys.indexCategoriesSlug = Buleys.objectStoreCategories.index("slug");
//console.log(Buleys.indexCategoriesSlug);
//console.log(Buleys.objectStoreCategories);
	try {
		var keyRange = IDBKeyRange.lowerBound(slug_filter);
		var cursorRequest = Buleys.indexCategoriesSlug.openCursor( keyRange );
	} catch( error ) {
	//console.log(Buleys.indexCategoriesSlug);
	//console.log(error);
		return;
	}
//console.log('requested Cursor for ' + slug_filter);
//console.log(cursorRequest);
	cursorRequest.onsuccess = function ( event ) {
	//console.log("success in get_trash");
	//console.log(event.target.result);
		var result = event.target.result;
	//console.log(result.value);
	//console.log("^value");
		var item = result.value;
		if (!item) {
		//console.log("bailing");
			return;
		}
	//console.log("done cursor prep");
		//console.log("inside cursor request");
		
				new_deleted_transaction();
				var item_request_2 = Buleys.objectStoreDeleted.get(item.link);
				item_request_2.onsuccess = function ( event ) {
					if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
						new_item_transaction();
					//console.log("trash 1: getting : " + item.link );
						var item_request = Buleys.objectStore.get(item.link);
						item_request.onsuccess = function ( event ) {
					//console.log("BLAH");
							if (typeof event.target.result !== 'undefined' && make_inverse !== true) {
								if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
									get_item_raw_no_trash(event.target.result.link);
								}
							}
						};
					} else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
						new_item_transaction();
					//console.log("trash 2: getting : " + item.link );
						var item_request = Buleys.objectStoreDeleted.get(item.link);
						item_request.onsuccess = function ( event ) {

							if (typeof item_request.result !== 'undefined') {
								if (typeof item_request.result !== 'undefined') {
									if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
										get_item_raw(item_request.result.link);
									}
								} else {
								}
							}
						};
					}
				
				}
			//console.log('result');
			//console.log(result);
				try {
					result.continue();
				} catch(e) {

					item = false;
				}

	};
	cursorRequest.onerror = function ( event ) {
	//console.log('cursor error');
	};
}

function mark_item_as_deleted( item_url, item_slug, item_type ) {
	jQuery(document).trigger('mark_item_as_deleted');

	new_deleted_transaction();
	var data = {
		"link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};
	var add_data_request = Buleys.objectStoreDeleted.add(data);
	add_data_request.onsuccess = function ( event ) {

		Buleys.objectId = add_data_request.result;
	};
	add_data_request.onerror = function ( e ) {

	};
} /* end mark_item_as_deleted() */

function mark_item_as_undeleted( item_url, item_slug, item_type ) {
	jQuery(document).trigger('mark_item_as_undeleted');

	new_deleted_transaction();
	var request = Buleys.objectStoreDeleted["delete"](item_url);
	request.onsuccess = function ( event ) {

		delete Buleys.objectId;
	};
	request.onerror = function (  ) {

	};
} /* end mark_item_as_undeleted() */

function delete_item( item_url, the_type, the_slug ) {
	jQuery(document).trigger('delete_item');

	new_deleted_transaction();
	var data = {
		"link": item_url,
		"modified": new Date().getTime()
	};
	var add_data_request = Buleys.objectStoreDeleted.add(data);
	add_data_request.onsuccess = function ( event ) {

		Buleys.objectId = add_data_request.result;
			//allows for item restoration
		   //remove_item_from_items_database(item_url, the_type, the_slug);
		   remove_item_from_favorites_database(item_url, the_type, the_slug);
		   remove_item_from_categories_database(item_url, the_type, the_slug);
		   remove_item_from_archives_database(item_url, the_type, the_slug);
		   remove_item_from_seens_database(item_url, the_type, the_slug);
		   remove_item_from_read_database(item_url, the_type, the_slug);
	};
	add_data_request.onerror = function ( e ) {

	};
} /* end delete_item() */

function undelete_item( item_url, the_type, the_slug ) {
	jQuery(document).trigger('undelete_item');
	console.log("UNDELETING ITEM!");
	console.log(Array( item_url, the_type, the_slug ));
	new_deleted_transaction();
	var remove_data_request = Buleys.objectStoreDeleted.delete(item_url);
	remove_data_request.onsuccess = function ( event ) {

		Buleys.objectId = event.target.result;
		console.log(event.target.result);
		   //allows for item restoration
		   //remove_item_from_items_database(item_url, the_type, the_slug);
		recreate_item( item_url );	
	};
	remove_data_request.onerror = function ( e ) {

	};
} /* end delete_item() */

function check_if_item_is_deleted( item_url ) {
	jQuery(document).trigger('check_if_item_is_deleted');

	jQuery( 'document' ).trigger( 'check_if_item_is_deleted', { "item_url": item_url } );
	new_deleted_transaction();
	var item_request = Buleys.objectStoreDeleted.get(item_url);
	item_request.onsuccess = function ( event ) {

		checker = item_request;
		if (typeof item_request.result != 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link star_icon'></a></span>");
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('deleted');
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link empty_star_icon'></a></span>");
		}
	};
	item_request.onerror = function ( e ) {

	};
} /* end check_if_item_is_deleted */

function add_item_to_deletes_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('add_item_to_deletes_database');

	new_deleted_transaction();
	var data = {
		"item_link": item_url,
		"topic_slug": item_slug,
		"topic_type": item_type,
		"modified": new Date().getTime()
	};
	var add_data_request = Buleys.objectStoreDeleted.add(data);
	add_data_request.onsuccess = function ( event ) {

		Buleys.objectId = add_data_request.result;
	};
	add_data_request.onerror = function ( e ) {

	};
}
function remove_item_from_deletes_database( item_url, item_slug, item_type ) {
	jQuery(document).trigger('remove_item_from_deletes_database');

	new_deleted_transaction();
	var request = Buleys.objectStoreDeleted["delete"](item_url);
	request.onsuccess = function ( event ) {

		delete Buleys.objectId;
	};
	request.onerror = function (  ) {

	};
}
