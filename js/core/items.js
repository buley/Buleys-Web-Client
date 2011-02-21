	function new_item_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["items"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("items");
	
	    } catch (e) {
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	
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
	
	
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	    };
	}
	
	

	
	function new_item_transaction_old() {
	    try {
	        var transaction = Buleys.db.transaction(["items"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	
	        };
	        transaction.onabort = function (e) {
	
	        };
	
	        Buleys.db.objectStore = transaction.objectStore("items");
	        console.log("New Transaction", Buleys.db.objectStore);
	    } catch (e) {
	
	        console.log("e", e);
	
	
	
	        console.log("new_item_transaction(): Create object store; db: " + Buleys.db);
	
	        console.log("Fail!", Buleys.db, typeof Buleys.db.setVersion);
	        if (typeof Buleys.db.setVersion == "function") {
	            var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	            request.onsuccess = function (e) {
	                console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
	
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
	
	
	
	            };
	            request.onerror = function (e) {
	
	            };
	        }
	
	    };
	}
	
	function fire_off_request() {
	
	
	    var data_to_send;
	    data_to_send = {
	        "method": "get_users_personal_collection"
	    };
	    var the_url;
	    if (typeof Buleys.view.type == "undefined" || Buleys.view.type == "") {
	        the_url = "/feedback/index.php";
	    } else {
	        the_url = "http://static.buleys.com/js/collections/" + Buleys.view.type + "/" + Buleys.view.slug + ".js";
	    }
	    $.ajax({
	
	        url: the_url,
	        dataType: 'jsonp',
	        /*data: data_to_send,*/
	        jsonpCallback: 'load_collection',
	        error: function () {
	            $("#index").html("<li class='item'>No results.</li>");
	        },
	        success: function (data) {
	            Buleys.view.slug = data.info.key;
	            Buleys.view.type = data.info.type;
	
	            populate_and_maybe_setup_indexeddbs(data.items);
				get_data_for_items(data.items);
	            add_items(data.items, data.info.type, data.info.key);
	            load_page_title_info(data.info);
	            add_or_update_topic((data.info.type + "_" + data.info.key), data.info);
	        }
	    });
	}
	

	
	function get_data_for_items(items) {
	    $.each(items, function (i, item) {
	
	        get_item(item.link);
	
	    });
	}
	
	function add_items(items_to_database, type_to_get, company_to_get) {
	    $.each(items_to_database, function (i, item) {
	
	        add_item_if_new(item, type_to_get, company_to_get);
	    });
	}
	
	
	function populate_and_maybe_setup_indexeddbs(items_to_database) {
	

	    $.each(items_to_database, function (i, item) {
	        add_item_if_doesnt_exist(item);
	
	
	    });
	
	}
	
		
	function remove_item_from_items_database(item_url, item_slug, item_type) {
	
	
	    new_item_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
		
	function get_data_object_for_item(item) {
	    var data = {
	        "link": item.link,
	        "title": item.title,
	        "author": item.author,
	        "published_date": new Date(item.published_date).getTime(),
	        "index_date": new Date(item.index_date).getTime(),
	        "modified": new Date().getTime()
	    };
	    return data;
	}
	
	function add_item_to_items_database(item) {
	
	
	
	    var data = get_data_object_for_item(item);
	
	
	    new_deleted_transaction();
	    var item_request = Buleys.objectStore.get(item.link);
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	
	        } else {
	
	
	            new_item_transaction();
	
	
	
	            var add_data_request = Buleys.objectStore.add(data);
	            add_data_request.onsuccess = function (event) {
	
	
	                if (item.categories.length > 1 && typeof item.categories.type === "undefined" && typeof item.categories.key === "undefined") {
	                    $.each(item.categories, function (cat_key, cat) {
	
	                        if (type === "home" || typeof slug === "undefined" || typeof slug === "" || cat.key !== null && typeof cat.key !== "null" && cat.key === slug) {
	
	                            if (typeof page == "undefined" || page !== "favorites" && page !== "seen" && page !== "read" && page !== "archive") {
	                                add_item_to_results(get_data_object_for_item(item));
	                            }
	                        }
	
	
	                    });
	
	                } else if (item.categories.length == 1 && typeof item.categories.key !== "undefined") {
	
	                    if (type === "home" || item.categories[0].key.toLowerCase() === slug && item.categories[0].type.toLowerCase() === type) {
	
	                        add_item_to_results(get_data_object_for_item(item));
	
	                    }
	                } else {
	
	                }
	
	
	
	
	
	
	            };
	            add_data_request.onerror = function (e) {
	
	
	            };
	
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	
	}


	
	function check_if_item_is_read(item_url) {
	
	    new_status_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass("read");
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass("unread");
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	
	function add_item_if_new(item, type_to_get, company_to_get) {
	
	    new_item_transaction();
	
	    var item_request = Buleys.objectStore.get(item.link);
	
	    item_request.onsuccess = function (event1) {
	
	
	
	        if (typeof event1.target.result == 'undefined') {
	
	
	            new_deleted_transaction();
	
	            var deleted_item_request = Buleys.objectStore.get(item.link);
	
	            deleted_item_request.onsuccess = function (event) {
	
	
	
	                if (typeof event.target.result == 'undefined') {
	
	                    add_item_to_items_database(item);
	                    add_categories_to_categories_database(item.link, item.categories);
	                    send_to_console("<p>Added: <a href='" + item.link + "'>" + item.title + "</a></p>");
	                    var item_key = type_to_get.toLowerCase() + "_" + company_to_get.toLowerCase();
	                    if (typeof Buleys.queues.new_items[item_key] == "undefined") {
	                        Buleys.queues.new_items[item_key] = 0;
	                    }
	                    Buleys.queues.new_items[item_key] = Buleys.queues.new_items[item_key] + 1;
	                } else {
	
	                }
	            };
	
	            item_request.onerror = function (e) {
	
	
	            };
	
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	function add_item_if_doesnt_exist_old(item) {
	
	    new_item_transaction();
	
	    var item_request = Buleys.objectStore.get(item.link);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	
	            add_item_to_items_database(item);
	            add_categories_to_categories_database(item.link, item.categories);
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	function add_item_if_doesnt_exist(item) {
	
	    new_item_transaction();
	
	    var item_request = Buleys.objectStore.get(item.link);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_item_to_items_database(item);
	            add_categories_to_categories_database(item.link, item.categories);
	
	
	            if (item.categories.length > 0) {
	                $.each(item.categories, function (cat_key, cat) {
	
	                    if (Buleys.view.type === "home" || typeof Buleys.view.slug === "undefined" || typeof Buleys.view.slug === "" || cat.key !== null && typeof cat.key !== "null" && cat.key === Buleys.view.slug && cat.type === Buleys.view.type) {
	
	                        add_item_to_results(get_data_object_for_item(item));
	                        check_if_item_is_favorited(item.link);
	                        check_if_item_is_read(item.link);
	                        check_if_item_is_seen(item.link);
	
	                    }
	
	                });
	            } else {
	
	            }
	
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}

	
	function get_item_for_overlay(item_url) {
	
	    new_item_transaction();
	
	
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	
	        if (typeof item_request.result != 'undefined' && typeof item_request.result.link == 'string') {
	
	            var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><a href="#" class="close_sidebar_link" id="' + item_url + '"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div>' + "<h3 id='overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item_request.result.link + "'>" + item_request.result.title + "</a></h3></div><div id='overlay_left'></div><div id='overlay_controls'><a href='" + item_url + "' class='favorite_item'>Favorite</a>&nbsp;<a href='" + item_url + "' class='unfavorite_item'>Unfavorite</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_read'>Mark as read</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unread'>Mark as unread</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_seen'>Mark as seen</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + item_url + "' class='archive_item'>Archive</a>&nbsp;<a href='" + item_url + "' class='delete_item'>Delete</a>&nbsp;<a href='" + item_url + "' class='unarchive_item'>Unarchive</a>&nbsp;<a href='" + item_url + "' class='vote_item_up'>Vote up</a>&nbsp;<a href='" + item_url + "' class='vote_item_down'>Vote down</a>&nbsp;<a href='" + item_url + "' class='close_item_preview'>Close preview</a></div>";
	
	
	            if (typeof item_request.result.author !== 'undefined' && item_request.result.author.length > 0) {
	
	            }
	
	            send_to_overlay(html_snippit);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	function add_item_to_results(item) {
	
	    var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");
	
	    if (!(jQuery("#" + id).length)) {
	
	        jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item' href='http://buleys.com/images/icons/fugue-shadowless/magnifier.png'></a></li>").hide().prependTo("#results").fadeIn('slow');
	
	
	
	    } else {
	
	
	
	    }
	}
	
	
	function get_items(type_filter, slug_filter, begin_timeframe, end_timeframe) {
	
	    console.log("get_items(): type: " + type_filter + " slug: " + slug_filter);
	
	    var begin_date = 0;
	    if (typeof begin_timeframe == "undefined") {
	        begin_date = 0
	    } else {
	        begin_date = parseInt(begin_timeframe);
	    }
	
	    var end_date = 0;
	    if (typeof end_timeframe == "undefined") {
	        end_date = new Date().getTime();
	    } else {
	        end_date = parseInt(end_timeframe);
	    }
	
	
	    if (typeof slug_filter == "undefined" || type_filter == "home") {
	
	
	        Buleys.keyRange = new IDBKeyRange.bound(begin_date, end_date, true, false);
	        console.log("Range Defined", Buleys.keyRange);
	
	        Buleys.db.onCursor = function (callback) {
	            console.log("get_items callback objectStore", callback, Buleys.db.objectStore);
	            new_item_transaction();
	            Buleys.db.indexItem = Buleys.db.objectStore.index("published_date");
	            var request = Buleys.db.indexItem.openCursor(Buleys.keyRange);
	            request.onsuccess = function (event) {
	
	
	                if (typeof request.result !== "undefined") {
	
	                    Buleys.cursor = request.result;
	
	
	                    console.log("get_items() cursor value ", Buleys.cursor.value);
	                    get_item(Buleys.cursor.value.link);
	
	                    if (typeof Buleys.cursor["continue"] == "function") {
	                        Buleys.cursor["continue"]();
	                    }
	
	
	                }
	
	
	            };
	            request.onerror = function (event) {
	
	
	            };
	        };
	        Buleys.db.onCursor(function () {
	
	        });
	
	    } else {
	
	        new_categories_transaction();
	
	        Buleys.index = Buleys.objectStore.index("slug");
	        console.log("get_items db stuff ", Buleys.db, Buleys.index);
	        var cursorRequest = Buleys.index.getAll(slug_filter);
	
	        cursorRequest.onsuccess = function (event) {
	
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	            if (objectCursor.length > 1) {
	                jQuery.each(objectCursor, function (k, item) {
						console.log("get_item(): ",item.link);
	                    get_item(item.link);
	                });
	
	            } else {
	                get_item(objectCursor.link);
	            }
	        };
	        cursorRequest.onerror = function (event) {
	alert('new_categories_transaction() getAll done failure');
	
	        };
	
	
	    }
	
	
	}
	
	
	
	function get_item(item_url) {
	    if (typeof item_url !== 'undefined') {
	
	        new_deleted_transaction();
	        var item_request_0 = Buleys.objectStore.get(item_url);
	        item_request_0.onsuccess = function (event) {
	            if (typeof item_request_0.result == 'undefined') {
	
	                new_item_transaction();
	                var item_request_1 = Buleys.objectStore.get(item_url);
	
	                item_request_1.onsuccess = function (event) {
	
	                    if (typeof item_request_1.result != 'undefined') {
	                    	
	                        new_archived_transaction();
	
	                        var item_request_2 = Buleys.objectStore.get(item_url);
	
	                        item_request_2.onsuccess = function (event) {
	
	                            if (typeof item_request_2.result !== 'undefined') {
	
	
	
	                            } else {
	
	                                get_item_raw_no_trash(item_request_1.result.link);
	
	
	
	                            }
	                        };
	
	                        item_request_2.onerror = function (e) {
	
	
	
	                            if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            alert(item_request_1.result.link;)
	                                add_item_to_results(item_request_1.result);
	                                check_if_item_is_favorited(item_request_1.result.link);
	                                check_if_item_is_read(item_request_1.result.link);
	                                check_if_item_is_seen(item_request_1.result.link);
	                            }
	
	                        };
	
	
	
	
	
	
	
	                    }
	                };
	
	                item_request_1.onerror = function (e) {
	
	
	
	                };
	
	            }
	
	        }
	    };
	
	}
	
	
	function get_item_raw(item_url) {
	
	    if (typeof item_url !== 'undefined') {
	
	        new_item_transaction();
	        var item_request_1 = Buleys.objectStore.get(item_url);
	
	        item_request_1.onsuccess = function (event) {
	
	            if (typeof item_request_1.result != 'undefined') {
	
	                new_deleted_transaction();
	                var item_request_2 = Buleys.objectStore.get(item_url);
	
	                item_request_2.onsuccess = function (event) {
	
	
	                    if (typeof item_request_2.result == 'undefined') {
	
	                        if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            add_item_to_results(item_request_1.result);
	                            check_if_item_is_favorited(item_request_1.result.link);
	                            check_if_item_is_read(item_request_1.result.link);
	                            check_if_item_is_seen(item_request_1.result.link);
	                        }
	                    }
	
	                }
	
	            }
	
	
	        };
	
	        item_request_1.onerror = function (e) {
	
	
	
	        };
	
	
	    }
	
	}
	
	
	function get_item_raw_no_trash(item_url) {
	
	
	    if (typeof item_url !== 'undefined') {
	
	        new_item_transaction();
	        var item_request_1 = Buleys.objectStore.get(item_url);
	
	        item_request_1.onsuccess = function (event) {
	
	
	            if (typeof item_request_1.result != 'undefined') {
	
	
	
	
	
	
	
	                if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                    add_item_to_results(item_request_1.result);
	                    check_if_item_is_favorited(item_request_1.result.link);
	                    check_if_item_is_read(item_request_1.result.link);
	                    check_if_item_is_seen(item_request_1.result.link);
	                }
	            }
	
	        };
	
	        item_request_1.onerror = function (e) {
	
	
	
	            if (jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                add_item_to_results(item_request_1.result);
	                check_if_item_is_favorited(item_request_1.result.link);
	                check_if_item_is_read(item_request_1.result.link);
	                check_if_item_is_seen(item_request_1.result.link);
	            }
	
	        };
	
	
	    }
	
	}
	
	
	
	function get_item_for_console(item_url) {
	
	    new_item_transaction();
	
	
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	
	        if (typeof item_request.result != 'undefined' && typeof item_request.result.id == 'string') {
	            var html_snippit = "<div id='console_" + item_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
	            html_snippit = html_snippit + "<h3><a href='" + item_request.result.id + "'>" + item_request.result.title + "</a></h3>";
	            html_snippit = html_snippit + "<p>" + item_request.result.author + "</p>";
	            html_snippit = html_snippit + "</div>";
	
	            send_to_console(html_snippit);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}

