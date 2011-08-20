function new_favorite_transaction() {
    try {
        var transaction = Buleys.db.transaction(["favorites"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
        transaction.oncomplete = function (e) {
            delete Buleys.objectStore;
        };
        transaction.onabort = function (e) {

        };
        Buleys.objectStore = transaction.objectStore("favorites");

    } catch (e) {
        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
        request.onsuccess = function (e) {

            Buleys.objectStore = Buleys.db.createObjectStore("favorites", {
                "keyPath": "item_link"
            }, true);

            Buleys.objectStore.createIndex("topic_slug", "topic_slug", {
                unique: false
            });
            Buleys.objectStore.createIndex("topic_type", "topic_type", {
                unique: false
            });
            Buleys.objectStore.createIndex("modified", "modified", {
                unique: false
            });
        };
        request.onerror = function (e) {
        };
    };
}

function add_favorite_to_results(item) {
    var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");
    if (!(jQuery("#" + id).length)) {
        jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><div class='magnify_icon'></div></li>").hide().prependTo("#results").fadeIn('slow');
    }
}
	
function get_favorites(type_filter, slug_filter, begin_timeframe, end_timeframe) {
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
    new_categories_transaction();
    Buleys.index = Buleys.objectStore.index("slug");
    var cursorRequest = Buleys.index.openCursor(slug_filter);
    cursorRequest.onsuccess = function (event) {
        var objectCursor = cursorRequest.result;
        if (!objectCursor) {
            return;
        }
        if (objectCursor.length > 1) {
            jQuery.each(objectCursor, function (k, item) {
                new_favorite_transaction();
                var item_request_2 = Buleys.objectStore.get(item.link);
                item_request_2.onsuccess = function (event) {
                    if (typeof item_request_2.result !== 'undefined') {
                        new_item_transaction();
                        var item_request = Buleys.objectStore.get(item.link);
                        item_request.onsuccess = function (event) {
                            if (typeof item_request.result !== 'undefined') {
                                if (typeof item_request.result.link !== 'undefined') {
                                    if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
                                        get_item_raw(item_request.result.link);
                                    }
                                }
                            }
                        };
                    }
                };
                item_request_2.onerror = function (e) {
                    if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
                        add_item_to_results(item);
                        check_if_item_is_favorited(item.link);
                        check_if_item_is_read(item.link);
                        check_if_item_is_seen(item.link);
                    }
                };
            });
        } else {
            get_item(objectCursor.link);
        }
    };
    cursorRequest.onerror = function (event) {
    };
}

function get_favorite(favorite_slug) {
    if (typeof favorite_slug !== 'undefined') {
        new_favorite_transaction();
        var favorite_request_1 = Buleys.objectStore.get(favorite_slug);
        favorite_request_1.onsuccess = function (event) {
            if (typeof favorite_request_1.result != 'undefined') {
                new_archived_transaction();
                var favorite_request_2 = Buleys.objectStore.get(favorite_slug);
                favorite_request_2.onsuccess = function (event) {
                    if (typeof favorite_request_2.result === 'undefined') {
                        if (jQuery("#" + favorite_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
                            add_favorite_to_results(favorite_request_1.result);
                            check_if_favorite_is_favorited(favorite_request_1.result.link);
                            check_if_favorite_is_read(favorite_request_1.result.link);
                            check_if_favorite_is_seen(favorite_request_1.result.link);
                        }
                    }
                };
                favorite_request_2.onerror = function (e) {
                    if (jQuery("#" + favorite_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
                        add_favorite_to_results(favorite_request_1.result);
                        check_if_favorite_is_favorited(favorite_request_1.result.link);
                        check_if_favorite_is_read(favorite_request_1.result.link);
                        check_if_favorite_is_seen(favorite_request_1.result.link);
                    }
                };
            }
        };
        favorite_request_1.onerror = function (e) {
        };
    }
}

function get_favorite_for_console(favorite_slug) {
    new_favorite_transaction();
    var favorite_request = Buleys.objectStore.get(favorite_slug);
    favorite_request.onsuccess = function (event) {
        if (typeof favorite_request.result != 'undefined' && typeof favorite_request.result.id == 'string') {
            var html_snippit = "<div id='console_" + favorite_request.result.id.replace(/[^a-zA-Z0-9-_]+/g, "") + "'>";
            html_snippit = html_snippit + "<h3><a href='" + favorite_request.result.id + "'>" + favorite_request.result.title + "</a></h3>";
            html_snippit = html_snippit + "<p>" + favorite_request.result.author + "</p>";
            html_snippit = html_snippit + "</div>";
            send_to_console(html_snippit);
        }
    };
    favorite_request.onerror = function (e) {
    };
}

function get_favorite_for_overlay(favorited_url) {
    new_favorite_transaction();
    var favorite_request = Buleys.objectStore.get((favorited_url));
    favorite_request.onsuccess = function (event) {
        if (typeof favorite_request.result != 'undefined' && typeof favorite_request.result.link == 'string') {
            var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><div href="#" class="close_sidebar_link close_icon" id="' + favorite_slug + '"></div></div>' + "<h3 id='overlay_" + favorite_slug.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + favorite_request.result.link + "'>" + favorite_request.result.title + "</div></h3></div><div id='overlay_left'></div>";
            send_to_overlay(html_snippit);
        }
    };
    favorite_request.onerror = function (e) {
    };
}

function add_item_as_favorite(item_url) {
    new_status_transaction();
    var data = {
        "link": item_url,
        "status": "favorite",
        "modified": new Date().getTime()
    };
    var add_data_request = Buleys.objectStore.add(data);
    add_data_request.onsuccess = function (event) {
        Buleys.objectId = add_data_request.result;
    };
    add_data_request.onerror = function (e) {
    };
}

function check_if_item_is_favorited_for_overlay(item_url) {
    new_favorite_transaction();
    var item_request = Buleys.objectStore.get(item_url);
    item_request.onsuccess = function (event) {
        if (typeof item_request.result != 'undefined') {
            jQuery("#overlay_left").prepend("<div class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + item_url + "' class='unfav_link star_icon'></div></div>");		
            jQuery("#overlay_left").addClass('favorited');
        } else {
            jQuery("#overlay_left").prepend("<div class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><div href='" + item_url + "' class='fav_link empty_star_icon'></div></div>");
            jQuery("#overlay_left").addClass('unfavorited');
        }
    };
    item_request.onerror = function (e) {
    };
}

function check_if_item_is_favorited(item_url) {
    new_favorite_transaction();
    var item_request = Buleys.objectStore.get(item_url);
    item_request.onsuccess = function (event) {
        if (typeof item_request.result != 'undefined') {
            if(Buleys.settings.show_favorite_status !== false) {
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><div href='" + item_url + "' class='unfav_link star_icon'></div></span>");
	        }
            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('favorited');
        } else {
            if(Buleys.settings.show_favorite_status !== false) {
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><div href='" + item_url + "' class='fav_link empty_star_icon'></div></span>");
			}
            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unfavorited');
        }
    };
    item_request.onerror = function (e) {
    };
}

function add_item_to_favorites_database(item_url, item_slug, item_type) {
    new_favorite_transaction();
    var data = {
        "item_link": item_url,
        "topic_slug": item_slug,
        "topic_type": item_type,
        "modified": new Date().getTime()
    };
    var add_data_request = Buleys.objectStore.add(data);
    add_data_request.onsuccess = function (event) {
        Buleys.objectId = add_data_request.result;
    };
    add_data_request.onerror = function (e) {
    };
}

function remove_item_from_favorites_database(item_url, item_slug, item_type) {
    new_favorite_transaction();
    var request = Buleys.objectStore["delete"](item_url);
    request.onsuccess = function (event) {
        delete Buleys.objectId;
    };
    request.onerror = function () {
    };
}

$('.unfav_link').live('click', function (event) {
    event.preventDefault();
    console.log( jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('.unfav_link') );
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
    jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
    jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
    if(typeof Buleys.view.page !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
    	jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
    }
    
    remove_item_from_favorites_database($(this).attr('href'), Buleys.view.slug, Buleys.view.type);
    post_feedback('unstar', $(this).attr('href'), Buleys.view.slug, Buleys.view.type);
    send_to_console("<p>item removed from favorites</p>");
    setTimeout('fade_console_message()', 1000);
});

$('#favorite').live('click', function (event) {
    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function (i, item_to_mark) {
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

$('#unfavorite').live('click', function (event) {
    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function (i, item_to_mark) {
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
		    if(typeof Buleys.view.type !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
		    	jQuery("#" +  $(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
		    }
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
	    if(typeof Buleys.view.type !== "undefined" && ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs" ) ) {
	    	jQuery("#" + $('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).remove();
	    }
        remove_item_from_favorites_database($('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('unstar', $('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item removed from favorites</p>");
        setTimeout('fade_console_message()', 1000);
    }

});



$('.fav_link').live('click', function (event) {
    event.preventDefault();
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('empty_star_icon').addClass('star_icon');
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
    jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('fav_link').addClass('unfav_link');;
    jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('empty_star_icon').addClass('star_icon');
    jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
    add_item_to_favorites_database($(this).attr('href'), Buleys.view.slug, Buleys.view.type);
    post_feedback('star', $(this).attr('href'), Buleys.view.slug, Buleys.view.type);
    send_to_console("<p>item favorited</p>");
    setTimeout('fade_console_message()', 1000);
});

$('#select_favorites').live('click', function (event) {
    event.preventDefault();
    $.each($('.favorited'), function (i, item_to_mark) {
        if (jQuery(item_to_mark).hasClass('selected')) {

        } else {
            jQuery(item_to_mark).addClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));

        }
    });
});
$('#deselect_favorites').live('click', function (event) {
    event.preventDefault();
    $.each($('.favorited'), function (i, item_to_mark) {

        jQuery(item_to_mark).removeClass('selected');
        jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
    });
});
