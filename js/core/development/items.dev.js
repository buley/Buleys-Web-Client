jQuery('.item').live( 'click', function(){ 
	jQuery(this).addClass('selected');
	jQuery(this).trigger('preview_item');
});

function new_item_transaction(	) {
	jQuery(document).trigger('new_item_transaction');

	try {
		var transaction = Buleys.db.transaction(["items"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );

		transaction.oncomplete = function (  e  ) {
		//console.log("new item trnasction complete");
		//console.log(Buleys.objectStore);
		//console.log(e);
			delete Buleys.objectStore;
		};
		transaction.onabort = function (  e  ) {


	//console.log(e);
	//console.log("new item transaction aborted");
		};
	//console.log("setting objectStore");
	//console.log( transaction.objectStore("items") );
		Buleys.objectStore = transaction.objectStore("items");
	} catch (e) {
	   //console.log("trying to create");
	var request = Buleys.db.setVersion(parseInt(Buleys.version, 10) );
		request.onsuccess = function (  e  ) {


			Buleys.db.objectStore = Buleys.db.createObjectStore("items", {
				"keyPath": "link"
			}, false);
			Buleys.db.objectStore.createIndex("author", "author", {
				unique: false
			});
			Buleys.db.objectStore.createIndex("published_date", "published_date", {
				unique: false
			});
			Buleys.db.objectStore.createIndex("index_date", "index_date", {
				unique: false
			});
			Buleys.db.objectStore.createIndex("modified", "modified", {
				unique: false
			});

		var transaction = Buleys.db.transaction(["items"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );

		transaction.oncomplete = function (  e  ) {
				//console.log("new item trnasction complete");
				//console.log(Buleys.objectStore);
				//console.log(e);
			delete Buleys.objectStore;
		};
		transaction.onabort = function (  e  ) {


		//console.log(e);
		//console.log("new item transaction aborted");
		};
		//console.log("setting objectStore");
		//console.log( transaction.objectStore("items") );
		Buleys.objectStore = transaction.objectStore("items");



		};
		request.onerror = function (  e  ) {
	//console.log("TRANSACTION ERROR");
	//console.log(e);
		};
	}
}

function remove_item_from_items_database(  item_url, item_slug, item_type  ) {
	jQuery(document).trigger('remove_item_from_items_database');
	new_item_transaction();
	var request = Buleys.objectStore["delete"](item_url);
	request.onsuccess = function (  event  ) {
		delete Buleys.objectId;
	};
	request.onerror = function (	) {


	};
}
	
function get_data_object_for_item(  item  ) {
	jQuery(document).trigger('get_data_object_for_item');

	var data = {
		"link": item.link,
		"title": item.title,
		"author": item.author,
		"entities": item.entities,
		"published_date": new Date(item.published_date).getTime(),
		"index_date": new Date(item.index_date).getTime(),
		"modified": new Date().getTime()
	};
	return data;
}

function add_item_to_results(  item  ) {
	jQuery(document).trigger('add_item_to_results');
	//console.log("items.dev.js > adding to results:");
	//console.log(item);
	var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");
	if (!(jQuery("#" + id).length)) {
		//console.log("appending to #" + id);
			jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().appendTo("#results").fadeIn('slow');
		}
}

function prepend_item_to_results(  item  ) {
	jQuery(document).trigger('prepend_item_to_results');
//console.log("adding:");
//console.log(item);
	var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");
	if (!(jQuery("#" + id).length)) {
	//console.log("appending to #" + id);
		jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item magnify_icon' href='#'></a></li>").hide().prependTo("#results").fadeIn('slow');
	}
}

function add_item_to_items_database(  item  ) {

	jQuery(document).trigger('add_item_to_items_database');

	var data = get_data_object_for_item(item);
	var deleted_on_success = function (  context  ) {

	var event = context.event;
		if (typeof item_request.result === 'undefined') {

			var add_on_success = function (  context2  ) {
		var event2 = context2.event;
	console.log(event2);

	//console.log(item);
				if (item.entities.length > 1 && typeof item.entities.type === "undefined" && typeof item.entities.slug === "undefined") {
			 		console.log(item.entities);
			console.log("^ item cats");
			   $.each(item.entities, function (  cat_key, cat  ) {


			//console.log(cat_key, cat);
						if (Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" || ( ( cat.slug !== null && typeof cat.slug !== "null" ) ) ) {
							if (typeof page === "undefined" || ( page !== "favorites" && page !== "seen" && page !== "read" && page !== "archive" && page !== "trash" ) ) {
								prepend_item_to_results(get_data_object_for_item(item));
							}
						}
					});
				} else if (item.entities.length === 1 && typeof item.entities.slug !== "undefined") {
					if (Buleys.view.type === "home" || ( item.entities[0].slug.toLowerCase() === slug && item.categories[0].type.toLowerCase() === type ) ) {
						add_item_to_results(get_data_object_for_item(item));
					}
				}
			};
			add_on_error = function (  e  ) {
		//console.log('there was some error with add_data_request');
	//console.log(e);	
		};

			InDB.trigger( 'InDB_row_add', { 'store': 'items', 'data': data, 'on_success': add_on_success, 'on_error': add_on_error } );

		}
	};
	deleted_on_error = function (  e  ) {
//console.log("cound not add to databaes");
//console.log(e);
	};

	InDB.trigger( 'InDB_do_row_get', { 'store': 'deleted', 'key': item.link, 'on_success': deleted_on_success, 'on_error': deleted_on_error } ); 

}

function check_if_item_is_read(  item_url  ) {

	jQuery(document).trigger('check_if_item_is_read');

	new_status_transaction();
	var item_request = Buleys.objectStore.get(item_url);
	item_request.onsuccess = function (  event  ) {


		if (typeof item_request.result !== 'undefined') {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass("read");
		} else {
			jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass("unread");
		}
	};
	item_request.onerror = function (  e  ) {


	};
}

function recreate_item( item_url, slug, type ) {

   jQuery(document).trigger('recreate_item', { "item_url": item_url } );

	if (typeof item_url !== 'undefined') {
		new_item_transaction();
		var item_request_1 = Buleys.objectStore.get(item_url);
		item_request_1.onsuccess = function (  event  ) {

			if (typeof event.target.result !== 'undefined') {
				var item = event.target.result;   
		console.log("CREATE");
		console.log(event.target.result);
				add_categories_to_categories_database(item.link, item.entities );
		for( category in item.entities ) {
			if( item.entities.hasOwnProperty( category ) ) {
			console.log(category);
				mark_item_as_seen( item.link, category.slug, category.type );
			}
		}
			}
		};
		item_request_1.onerror = function (  e  ) {

		};
	}


}

function get_item_raw_no_trash(  item_url  ) {
	jQuery(document).trigger('get_item_raw_no_trash');

	var on_error = function() {
		console.log( 'Error in get_item_raw', item_url );
	}	

	InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item_url, 'on_success': function( context ) {
		var event = context.event;
		if( InDB.isEmpty( InDB.row.value( event ) ) ) { 
			if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
				add_item_to_results(item_request_1.result);
				check_if_item_is_favorited(item_request_1.result.link);
				check_if_item_is_read(item_request_1.result.link);
				check_if_item_is_seen(item_request_1.result.link);
			}
		}		
	}, 'on_error': on_error } );

}

function get_item(  item_url  ) {

	jQuery(document).trigger('get_item');
	
	var on_error = function() {
		console.log( 'Error in get_item', item_url );
	}	

	InDB.trigger( 'InDB_row_get', { 'store': 'deleted', 'key': item_url, 'on_success': function( context ) {
		var event_1 = context.event;
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 
				InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item_url, 'on_success': function( context ) {
				var event2 = context.event;
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 
						InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item_url, 'on_success': function( context ) {
						var event3 = context.event;
						if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 
							if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
								add_item_to_results(item_request_1.result);
								check_if_item_is_favorited(item_request_1.result.link);
								check_if_item_is_read(item_request_1.result.link);
								check_if_item_is_seen(item_request_1.result.link);
							}
						}		
					}, 'on_error': on_error } );
				}
			}, 'on_error': on_error } );
		}
	}, 'on_error': on_error } );

}


function get_item_raw(  item_url  ) {
	jQuery(document).trigger('get_item_raw');

	var on_error = function() {
		console.log( 'Error in get_item_raw', item_url );
	}	

	InDB.trigger( 'InDB_row_get', { 'store': 'deleted', 'key': item_url, 'on_success': function( context ) {
		var event_1 = context.event;
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 
			InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item_url, 'on_success': function( context ) {
				var event2 = context.event;
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 
					if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
						add_item_to_results(item_request_1.result);
						check_if_item_is_favorited(item_request_1.result.link);
						check_if_item_is_read(item_request_1.result.link);
						check_if_item_is_seen(item_request_1.result.link);
					}
				}		
			}, 'on_error': on_error } );
		}
	}, 'on_error': on_error } );

}



function get_items(  type_filter, slug_filter, begin_timeframe, end_timeframe  ) {
	jQuery(document).trigger('get_items');

	console.log("inside get_items()");  
	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}
	var begin_date = 0;
	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0;
	} else {
		begin_date = parseInt(begin_timeframe);
	}
	var end_date = 0;
	if (typeof end_timeframe == "undefined" || end_timeframe == null) {
		end_date = new Date().getTime();
	} else {
		end_date = parseInt(end_timeframe);
	}

	var cursor_on_success = function ( context ) {
		var event1 = context.event;
		console.log(event1.target.result);
		console.log("successsssss");

		var result = event1.target.result;
		var item = event1.target.result.value;
		if( !!item ) {
			get_item( item.link );
		}
	};
	
	InDB.trigger( 'InDB_rows_get', { 'store': 'categories', 'keyRange': InDB.transaction.only( slug_filter ), 'on_success': cursor_on_success } );	


}


function index_items_by_field(  type_filter, slug_filter, field ) {
	jQuery(document).trigger('get_items');
	if(typeof Buleys.index_view == "undefined" ) {
		Buleys.index_view = {};
	}
	if( typeof Buleys.index_view[field] === "undefined" ) {
		Buleys.index_view[field] = {};
	}
	console.log("inside get_items()");  
	if (typeof make_inverse == "undefined") {
		make_inverse = false;
	}
	var begin_date = 0;
	if (typeof begin_timeframe == "undefined" || begin_timeframe == null) {
		begin_date = 0;
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
	try {
		var keyRange = IDBKeyRange.only(slug_filter);
		var cursorRequest = Buleys.indexCategoriesSlug.openCursor( keyRange );
	} catch( error ) {
		return;
	}

	if( undefined == typeof field ) {
		field = "modified";
	}
	cursorRequest.onsuccess = function ( event1 ) {

		console.log("successsssss");
		console.log(event1);
		var result = event1.target.result;
		var item = event1.target.result.value;

		console.log("#^^^^^");
		if( item ) {
			index_view[ field ][ item[field] ] = item.link;	
		}
		/*
		console.log("SUPER");
		console.log(item);
		new_item_transaction();
		Buleys.indexItem = Buleys.objectStore.index("published_date");
		var keyRange = IDBKeyRange.upperBound( new Date().getTime() );
		var request = Buleys.indexItem.openCursor( keyRange );
		request.onsuccess = function (  event2  ) {

			if (typeof event2.target.result !== "undefined") {
				Buleys.cursor = event2.target.result.value;
				console.log("get_items() cursor value ", Buleys.cursor.value);
				get_item(Buleys.cursor.link);
				if (typeof Buleys.cursor["continue"] === "function") {
					Buleys.cursor["continue"]();
				}
			}
		};
		request.onerror = function (  event2  ) {


		};
		*/
		result["continue"]();
	};

}

function get_item_for_console(  item_url  ) {
	jQuery(document).trigger('get_item_for_console');

	item_on_success = function ( context  ) {
	var event = context.event;

		if (typeof item_request.result !== 'undefined' && typeof item_request.result.id === 'string') {
			var html_snippit = "<div id='console_" + item_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
			html_snippit = html_snippit + "<h3><a href='" + item_request.result.id + "'>" + item_request.result.title + "</a></h3>";
			html_snippit = html_snippit + "<p>" + item_request.result.author + "</p>";
			html_snippit = html_snippit + "</div>";
			send_to_console(html_snippit);
		}
	};
	item_on_error = function (  e  ) {
	console.log('Error gettng item', e );
	};
	InDB.trigger( 'InDB_row_get', { 'store': 'items', 'key': item_url, 'on_success': item_on_success, 'on_error': item_on_error } );

}

function fire_off_request(	) {
	jQuery(document).trigger('fire_off_request');


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
	$.ajax({
		url: the_url,
		dataType: 'jsonp',
		/*data: data_to_send,*/
		jsonpCallback: 'load_collection',
		error: function (	) {


			$("#index").html("<li class='item'>No results.</li>");
		},
		success: function (  data  ) {

//console.log("the results are in");
			Buleys.view.slug = data.info.key;
			Buleys.view.type = data.info.type;
			//populate_and_maybe_setup_indexeddbs(data.items);
			
		//get_data_for_items(data.items);
			add_items(data.items, data.info.type, data.info.key);
		console.log('load_page_title_info(data.info)');
			load_page_title_info(data.info);
		console.log('add_or_update_topic');
			add_or_update_topic((data.info.type + "_" + data.info.key), data.info);
		}
	});
}

function get_data_for_items(  items  ) {
	jQuery(document).trigger('get_data_for_items');

	$.each(items, function (  i, item  ) {

	//console.log("getting data for item");
	//console.log(item);
		get_item(item.link);
	});
}

function add_items(  items_to_database, type_to_get, company_to_get  ) {
	jQuery(document).trigger('add_items');


	$.each(items_to_database, function (  i, item  ) {


		add_item_if_new(item, type_to_get, company_to_get);
	});
}

function populate_and_maybe_setup_indexeddbs(  items_to_database  ) {
	jQuery(document).trigger('populate_and_maybe_setup_indexeddbs');


	$.each(items_to_database, function (  i, item  ) {


		add_item_if_doesnt_exist(item);
	});
}

function add_item_if_new(  item, type_to_get, company_to_get  ) {
	jQuery(document).trigger('add_item_if_new');
	if( !item.link ) {
		return;
	}
//console.log("add_item_if_new");
//console.log( new Array( item, type_to_get, company_to_get ) );
//console.log(item.link);

	
	var on_error = function() {
		console.log( 'Error in get_item', item.link );
	}	

	InDB.trigger( 'InDB_row_get', { 'store': 'deleted', 'key': item.link, 'on_success': function( context ) {
		var event_1 = context.event;
		if( InDB.isEmpty( InDB.row.value( event_1 ) ) ) { 
			InDB.trigger( 'InDB_row_get', { 'store': 'archive', 'key': item.link, 'on_success': function( context2 ) {
				var event2 = context2.event;
				if( InDB.isEmpty( InDB.row.value( event_2 ) ) ) { 
					add_item_to_items_database(item);
					send_to_console("<p>Added: <a href='" + item.link + "'>" + item.title + "</a></p>");
					add_categories_to_categories_database(item.link, item.entities );
					var item_key = type_to_get.toLowerCase() + "_" + company_to_get.toLowerCase();
					if (typeof Buleys.queues.new_items[item_key] === "undefined") {
						Buleys.queues.new_items[item_key] = 0;
					}
					Buleys.queues.new_items[item_key] = Buleys.queues.new_items[item_key] + 1;
				}		
			}, 'on_error': on_error } );
		}
	}, 'on_error': on_error } );

}


function add_item_if_doesnt_exist_deleteme(  item  ) {
	jQuery(document).trigger('add_item_if_doesnt_exist');
//console.log("items.js > add_item_if_doesnt_exist");

	new_item_transaction();
	var item_request = Buleys.objectStore.get(item.link);
	item_request.onsuccess = function (  event  ) {


		if (typeof item_request.result === 'undefined') {
			add_item_to_items_database(item);
			add_categories_to_categories_database(item.link, item.entities);
			if (item.categories.length > 0) {
				$.each(item.categories, function (  cat_key, cat  ) {


					if (Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" || ( cat.key !== null && typeof cat.key !== "null" && cat.key === Buleys.view.slug && cat.type === Buleys.view.type ) ) {
						add_item_to_results(get_data_object_for_item(item));
						check_if_item_is_favorited(item.link);
						check_if_item_is_read(item.link);
						check_if_item_is_seen(item.link);
					}
				});
			}
		}
	};
	item_request.onerror = function (  e  ) {


	};
}
