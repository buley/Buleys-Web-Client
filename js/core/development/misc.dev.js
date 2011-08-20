

    $('#view_seen').live('click', function (event) {
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

    $('#view_unseen').live('click', function (event) {
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

    $('#view_read').live('click', function (event) {
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

    $('#view_unread').live('click', function (event) {
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

    $('#view_trash').live('click', function (event) {
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

    $('#view_archive').live('click', function (event) {
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


    $('#view_index').live('click', function (event) {
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
    $('#view_home').live('click', function (event) {
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

    $('#view_settings').live('click', function (event) {
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
    

    $('.close_item_preview').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });


    $('.sidebar_close_link').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    $('#close_all').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    $('.mark_item_as_unread').live('click', function (event) {
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

    $('#mark_all_items_as_read').live('click', function (event) {
        event.preventDefault();

        jQuery.each(jQuery(".unread"), function (k, item_to_mark) {


            var item_to_work_from = jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, ""));
            if (item_to_work_from.hasClass('unread')) {
                item_to_work_from.removeClass('unread');
                item_to_work_from.addClass('read');
            }

            mark_item_as_read(jQuery(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
        });

    });

    $('#mark_seen').live('click', function (event) {
        event.preventDefault();

        if (!is_in_cursor_mode()) {


            jQuery.each(jQuery(".selected"), function (k, item_to_mark) {


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

    $('#mark_unseen').live('click', function (event) {
        event.preventDefault();

        if (!is_in_cursor_mode()) {


            jQuery.each(jQuery(".selected"), function (k, item_to_mark) {

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

    $('#select_all').live('click', function (event) {
        event.preventDefault();
        $.each($('#results > li'), function (i, item_to_mark) {
            if (jQuery(item_to_mark).hasClass('selected')) {} else {
                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            }
        });
    });
    $('#select_none').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {

                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', jQuery(item_to_mark).attr('status').replace(' selected', ''));
            });

        } else {
            jQuery('.cursor').removeClass('selected');
            jQuery('.cursor').attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        }
    });
    $('#select_inverse').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('#results li'), function (i, item_to_mark) {
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


	$('#view_favorites').live('click', function (event) {
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


    $('#deselect_seen').live('click', function (event) {
        event.preventDefault();
        $.each($('.seen'), function (i, item_to_mark) {


            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });
    $('#deselect_unseen').live('click', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {


            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });

    $('#deselect_read').live('click', function (event) {
        event.preventDefault();
        $.each($('.read'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_unread').live('click', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_archived').live('click', function (event) {
        event.preventDefault();
        $.each($('.archived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_unarchived').live('click', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_unseen').live('click', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_unread').live('click', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    $('#deselect_unarchived').live('click', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });


    $('#select_seen').live('click', function (event) {
        event.preventDefault();
        $.each($('.seen'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $('#select_unseen').live('click', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $('#select_read').live('click', function (event) {
        event.preventDefault();
        $.each($('.read'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $('#select_unread').live('click', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $('#select_archived').live('click', function (event) {
        event.preventDefault();
        $.each($('.archived'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    $('#select_unarchived').live('click', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });

    $('#delete').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {

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

    $('#select').live('click', function (event) {
        event.preventDefault();
        if (is_in_cursor_mode()) {

            $.each($('.cursor'), function (i, item_to_mark) {

                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            });
        } else {

            $.each($('.selected'), function (i, item_to_mark) {

                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            });


        }
    });

    $('#deselect').live('click', function (event) {
        event.preventDefault();
        if (is_in_cursor_mode()) {

            $.each($('.cursor'), function (i, item_to_mark) {

                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
            });
        } else {

            $.each($('.selected'), function (i, item_to_mark) {

                jQuery(item_to_mark).removeClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
            });

        }
    });

    $('#archive').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {

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


    $('#read').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {

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



    $('#unarchive').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {
            $.each($('.selected'), function (i, item_to_mark) {

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



    $('#mark_read').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {
            $.each($('.selected'), function (i, item_to_mark) {

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

    $('#mark_unread').live('click', function (event) {
        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {


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


    $('#mark_all_items_as_unread').live('click', function (event) {
        event.preventDefault();

        jQuery.each(jQuery(".read"), function (k, item_to_mark) {

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
    }, 0, function () {});

    jQuery("#overlay").stop(true).animate({
        opacity: 0
    }, 0, function () {}).html('');



    $('.headline a').live('click', function (event) {
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

        $.post("http://api.buleys.com/feedback/", data_to_send, dataType = "json", function (data) {
            new_window = window.open(uri_string, click_window);
        });
    });

    $('.sidebar_headline a').live('click', function (event) {
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

        $.post("http://api.buleys.com/feedback/", data_to_send, dataType = "json", function (data) {
            new_window = window.open(uri_string, click_window);

        });

    });


    jQuery("#results li").live('mouseenter', function (event) {

        var item_to_work_from = jQuery(this);

        if (item_to_work_from.hasClass('unseen')) {
            item_to_work_from.removeClass('unseen');
            item_to_work_from.addClass('seen');

        }
        url_to_preview = item_to_work_from.children('a').attr('href');



        mark_item_as_seen(url_to_preview, Buleys.view.slug, Buleys.view.type);


    });

    jQuery("#preview_item").live('click', function (event) {

        event.preventDefault();
        if (!is_in_cursor_mode() && $('.selected').length > 0) {

            $.each($('.selected'), function (i, item_to_mark) {



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
                }, 100, function () {});



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
            }, 100, function () {});


        }

    });


    $('#close_item_preview').live('click', function (event) {
        event.preventDefault();

        if (!is_in_cursor_mode()) {

            if ($('.selected').length > 0) {
                $.each($('.selected'), function (i, item_to_mark) {

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
                        }, 500, function () {
                            jQuery("#overlay").html('');
                        });

                    }

                });

            } else {

                jQuery("#overlay").stop(true).animate({
                    opacity: 0
                }, 500, function () {
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
                }, 500, function () {
                    jQuery("#overlay").html('');
                });

            }

        }

    });


    jQuery("#results li:not(.favorite_status)").live('click', function (event) {
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
	            }, 500, function () {
	                jQuery("#overlay").html('');
	            });
	        } else if (!jQuery(item_to_work_from).hasClass('selected')) {
	
	            jQuery("#overlay").stop(true).animate({
	                opacity: 1
	            }, 100, function () {});
	
	            load_item_to_overlay(url_to_preview);
	
	        }
	
	        item_to_work_from.addClass('selected');

		}
		
    });

    $(".selected").live('click', function (event) {
        $(this).removeClass('selected');
    });

    $("#results li").live('mouseleave', function (event) {
		/*
		jQuery("#overlay").stop(true).animate({
			opacity: 0,
						
		
		}, 500, function() {
		} ).html('');
		*/
    });
