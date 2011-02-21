$(document).ready(function () {

	if(typeof Buleys.db == "object") {
    console.log('database not yet loaded');
	    open_database();
    } else if(typeof Buleys.db == "IDBDatabase") {
    console.log('database loaded');
	    reload_results();
    } else if(typeof Buleys.db != "undefined") {
    
    }
    set_page_vars();

    send_to_console("Loading...");



    $('#dologin').live('click', function (event) {
        event.preventDefault();
        $('#dologin').remove();
        $('#login_status_pane').append('<div id="minimize_login_controls"><a href="#" id="dologinboxminimize" class="loginboxminimizelink"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-in.png"></a></div><div id="login_form"><a href="#" id="doregistration" class="registrationlink">Register</a> or Login:<br/><input id="email" type="text" value="your@email.here" name="email" class="defaulttext" /><br/><input id="password"  class="defaulttext" type="password" value="p4s5w0rd" name="password" /></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a><br/><a href="#" id="dologinsubmit" class="submitloginform">Login</a></div></div>');
    });

    $('a#get_inbox').live('click', function (event) {
        event.preventDefault();

        $('#mini_inbox_box').html('<div id="mini_inbox_wrapper"><div id="minimize_mini_inbox_controls"><a href="#" id="minimize_inbox"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div><ul id="mini_inbox_list"><li>Loading...</li></ul></div>');
        add_topics_to_mini_inbox();

    });



    $('#minimize_inbox').live('click', function (event) {
        event.preventDefault();
        if ($('#mini_inbox_box').hasClass('waiting_inbox')) {
            $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox-document.png"></a>');
        } else {
            $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox.png"></a>');
        }
    });


    $('#dologinboxminimize').live('click', function (event) {
        event.preventDefault();

        $('#login_status_pane').html('<a href="#" id="dologin" class="getloginform"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-out.png"></a>');
    });


    $('#show_commands').live('click', function (event) {
        event.preventDefault();

        $('#result_controls').show();
    });


    $('#hide_commands').live('click', function (event) {
        event.preventDefault();
        $('#result_controls').hide();
    });


    $('html').live('keyup', function (e) {
        if (e.keyCode == 68) {
            Buleys.shortcuts.d_depressed = false;

        } else if (e.keyCode == 83) {
            Buleys.shortcuts.s_depressed = false;

        } else if (e.keyCode == 16) {
            Buleys.shortcuts.shift_depressed = false;





        } else if (e.keyCode == 72) {

            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
                $('#view_index').click();
            } else {
                $('#close_item_preview').click();
            }


        } else if (e.keyCode == 76) {

            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
                $('#view_home').click();
            } else {
                $('#preview_item').click();

                if (jQuery('.cursor').length > 0) {
                    //alert(jQuery('.cursor').text());
                }

            }


        } else if (e.keyCode == 78) {
            $('#preview_item').click();
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
            $('#close_all').click();


        } else if (e.keyCode == 77) {
            jQuery('.cursor').removeClass('cursor');


        } else if (e.keyCode == 219) {
            $('#preview_item').click();

        } else if (e.keyCode == 221) {
            $('#close_item_preview').click();


        } else if (e.keyCode == 89) {
            $('#show_commands').click();


        } else if (e.keyCode == 85) {
            $('#hide_commands').click();


        } else if (e.keyCode == 65) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_all').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#select_none').click();
            } else {}


        } else if (e.keyCode == 82) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_unread').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_unread').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_unread').click();
            } else {
                $('#mark_unread').click();
            }


        } else if (e.keyCode == 13) {



        } else if (e.keyCode == 73) {
            $('#select').click();

        } else if (e.keyCode == 79) {
            $('#deselect').click();

        } else if (e.keyCode == 69) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_read').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_read').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_read').click();
            } else {
                $('#mark_read').click();
            }

        } else if (e.keyCode == 88) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_none').click();
            } else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
                $('#view_trash').click();
            } else {
                $('#delete').click();
            }


        } else if (e.keyCode == 67) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_archived').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_archived').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_archive').click();
            } else {
                $('#archive').click();
            }

        } else if (e.keyCode == 86) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_unarchived').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_unarchived').click();
            } else {
                $('#unarchive').click();
            }

        } else if (e.keyCode == 70) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_favorites').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_favorites').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_favorites').click();
            } else {
                $('#favorite').click();
            }

        } else if (e.keyCode == 71) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_unfavorite').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_unfavorite').click();
            } else {
                $('#unfavorite').click();
            }

        } else if (e.keyCode == 81) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_seen').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_seen').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_seen').click();
            } else {
                $('#mark_seen').click();
            }

        } else if (e.keyCode == 87) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_unseen').click();
            } else if (Buleys.shortcuts.d_depressed) {
                $('#deselect_unseen').click();
            } else if (Buleys.shortcuts.shift_depressed) {
                $('#view_unseen').click();
            } else {
                $('#mark_unseen').click();
            }

        } else if (e.keyCode == 90) {

            if (Buleys.shortcuts.s_depressed) {
                $('#select_inverse').click();
            } else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
                $('#view_index').click();
            } else {
                $('#refresh').click();
            }

        } else if (e.keyCode == 73) {
            $('#deselect').click();

        } else if (e.keyCode == 79) {

            $('#select').click();
        }





    });


    $('html').live('keydown', function (e) {
        if (e.keyCode == 68) {
            Buleys.shortcuts.d_depressed = true;

        } else if (e.keyCode == 83) {
            Buleys.shortcuts.s_depressed = true;

        } else if (e.keyCode == 16) {
            Buleys.shortcuts.shift_depressed = true;

        }



    });



    $(window).bind("popstate", function (e) {
        console.log(location.pathname);
        if(!Buleys.session.database_is_open) {
        } else {
        
        reload_results();

        fire_off_request();

        if (Buleys.view.type == "account") {
            load_profile_info();
        }

        if (Buleys.view.type !== "account" && Buleys.view.type !== "home" && Buleys.view.type !== "signin" && Buleys.view.type !== "" && Buleys.view.type !== "start" && Buleys.view.type !== "settings" && Buleys.view.type !== "favorites" && Buleys.view.type !== "read" && Buleys.view.type !== "unread" && Buleys.view.type !== "seen" && Buleys.view.type !== "unseen" && Buleys.view.type !== "unarchived" && Buleys.view.type !== "archived") {
            get_page_follow_status(Buleys.view.type, Buleys.view.key);
            get_page_subscription_status(Buleys.view.type, Buleys.view.key);
            get_page_topic_info(Buleys.view.type, Buleys.view.key);
        }

        check_login_status();


        Buleys.session.database_is_open = true;
       
        }
        
    });

    $('.get_settings').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_settings clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = 'http://buleys.com/settings';
        console.log(history);
        history.pushState(stateObj, "settings", urlString);
        reload_results();
    });


    $('#get_login').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("get_login clicked");

        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = "http://buleys.com/start";
        history.pushState(stateObj, "login", urlString);
        reload_results();
    });


    $('#view_seen').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_seen clicked");

        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/seen";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/seen";
        } else {
            urlString = "http://buleys.com/seen";
        }
        history.pushState(stateObj, "view_seen", urlString);
        reload_results();
    });

    $('#view_unseen').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_unseen clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/unseen";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/unseen";
        } else {
            urlString = "http://buleys.com/unseen";
        }
        history.pushState(stateObj, "view_unseen", urlString);
        reload_results();
    });

    $('#view_read').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_read clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/read";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/read";
        } else {
            urlString = "http://buleys.com/read";
        }
        history.pushState(stateObj, "view_read", urlString);
        reload_results();
    });

    $('#view_unread').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_unread clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/unread";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/unread";
        } else {
            urlString = "http://buleys.com/unread";
        }
        history.pushState(stateObj, "view_unread", urlString);
        reload_results();
    });

    $('#view_trash').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_trash clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/trash";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/trash";
        } else {
            urlString = "http://buleys.com/trash";
        }
        history.pushState(stateObj, "view_trash", urlString);
        reload_results();
    });

    $('#view_archive').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_archive clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/archive";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/archive";
        } else {
            urlString = "http://buleys.com/archive";
        }
        history.pushState(stateObj, "view_archive", urlString);
        reload_results();
    });

    $('#view_favorites').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_favorites clicked")
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof page != 'undefined' && page != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/favorites";
        } else if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/favorites";
        } else {
            urlString = "http://buleys.com/favorites";
        }
        history.pushState(stateObj, "view_favorites", urlString);
        reload_results();
    });

    $('#view_index').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_index clicked");
        jQuery("#page_meta").html('');
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        history.pushState(stateObj, "view_index", "http://buleys.com/");
        reload_results();
    });
    $('#view_home').live('click', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_home clicked");
        jQuery("#page_meta").html('');
        var stateObj = {
            "page": page,
            "slug": slug,
            "type": type,
            "time": new Date().getTime()
        };
        var urlString = '';
        if (typeof slug != 'undefined' && slug != "") {
            urlString = "http://buleys.com/" + type + "/" + slug + "/";
        } else if (typeof type != 'undefined' && type != "") {
            urlString = "http://buleys.com/" + type + "/";
        }
        history.pushState(stateObj, "view_home", urlString);
        reload_results();
    });

    $('#dologinsubmit').live('click', function (event) {
        event.preventDefault();

        if ($('[name="password"]').val()) {

            request_login($('[name="email"]').val(), $('[name="password"]').val());
        } else {

        }
    });








    $('.unfav_link').live('click', function (event) {

        event.preventDefault();

        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('unfav_link').addClass('fav_link');

        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');


        remove_item_from_favorites_database($(this).attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('unstar', $(this).attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item removed from favorites</p>");
        setTimeout('fade_console_message()', 1000);
    });

    $('#favorite').live('click', function (event) {

        event.preventDefault();
        if (!is_in_cursor_mode()) {

            $.each($('.selected'), function (i, item_to_mark) {



                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('unfav_link');


                jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
                jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');


                add_item_to_favorites_database($(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                post_feedback('star', $(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                send_to_console("<p>item favorited</p>");
                setTimeout('fade_console_message()', 1000);


            });

        } else {

            jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

            jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('unfav_link');


            jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
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


                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
                jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('unfav_link');

                jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
                jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');

                remove_item_from_favorites_database($(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                post_feedback('unstar', $(item_to_mark).children('a').attr('href'), Buleys.view.slug, Buleys.view.type);
                send_to_console("<p>item removed from favorites</p>");
                setTimeout('fade_console_message()', 1000);



            });

        } else {

            jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
            jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('unfav_link');

            jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
            jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');


            remove_item_from_favorites_database($('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
            post_feedback('unstar', $('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
            send_to_console("<p>item removed from favorites</p>");
            setTimeout('fade_console_message()', 1000);

        }
    });



    $('.fav_link').live('click', function (event) {
        event.preventDefault();

        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('a').removeClass('fav_link').addClass('unfav_link');;


        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.fav_link').removeClass('fav_link').addClass('unfav_link');

        add_item_to_favorites_database($(this).attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('star', $(this).attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item favorited</p>");
        setTimeout('fade_console_message()', 1000);
    });


    $('.close_item_preview').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0,
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });


    $('.sidebar_close_link').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0,
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    $('#close_all').live('click', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0,
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    $('.mark_item_as_unread').live('click', function (event) {
        event.preventDefault();
        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
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
    $('#deselect_favorites').live('click', function (event) {
        event.preventDefault();
        $.each($('.favorited'), function (i, item_to_mark) {

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



        jQuery("#logout").live("click", function (event) {

            account_logout();

        });


        jQuery(".do_logout").live("click", function (event) {

            account_logout();

        });

        jQuery(".do_logout").live("click", function (event) {

            account_logout();

        });

        jQuery(".submitthelogin").live("click", function (event) {


        });






        jQuery('.defaulttext').live('click', function (event) {
            jQuery(this).val('');
            jQuery(this).removeClass('defaulttext');
        });



    });


/*
		jQuery("#overlay .vote_up_category").remove();    
			jQuery("#overlay .vote_down_category").remove();    
			jQuery("#overlay .delete_category").remove(); 
*/
    $('.delete_category').live('click', function (event) {
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


    $('.follow_topic').live('click', function (event) {
        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == '') {
            the_type = type;
        } else {
            the_type = the_type;
        }

        add_follow_if_doesnt_exist(the_type, the_key);
        post_feedback('follow', '', the_key, the_type);

        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/heart.png");
        $(this).removeClass('follow_topic');
        $(this).addClass('unfollow_topic');

    });
    $('.unfollow_topic').live('click', function (event) {
        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = type;
        } else {
            the_type = the_type;
        }

        remove_follow(the_type, the_key);
        post_feedback('unfollow', '', the_key, the_type);

        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/heart-empty.png");
        $(this).removeClass('unfollow_topic');
        $(this).addClass('follow_topic');
    });

    $('.subscribe_topic').live('click', function (event) {
        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = type;
        } else {
            the_type = the_type;
        }
        add_subscription_if_doesnt_exist(the_type, the_key);
        post_feedback('subscribe', "", the_key, the_type);

        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox-document.png");
        $(this).removeClass('subscribe_topic');
        $(this).addClass('unsubscribe_topic');
    });

    $('.unsubscribe_topic').live('click', function (event) {
        event.preventDefault();
        var the_key = $(this).attr('key');
        var the_type = $(this).attr('type');

        if (typeof the_key == 'undefined') {
            the_key = slug;
        } else {
            the_key = the_key;
        }
        if (typeof the_type == 'undefined' || the_type == "") {
            the_type = type;
        } else {
            the_type = the_type;
        }

        remove_subscription(the_type, the_key);
        post_feedback('subscribe', "", the_key, the_type);

        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox.png");
        $(this).removeClass('unsubscribe_topic');
        $(this).addClass('subscribe_topic');
    });

    $('.vote_up_category').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();

        add_or_update_vote(vote_key, 1);
        if (!$(this).hasClass('voted')) {
            post_feedback('category_upvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
    });
    $('.vote_down_category').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
        add_or_update_vote(vote_key, -1);
        if (!$(this).hasClass('voted')) {
            post_feedback('category_downvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
    });

    $('.vote_up').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
        if (jQuery("#overlay_upvote_" + the_url).hasClass('vote')) {

            jQuery("#overlay_upvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up-empty.png');
            $('.vote').removeClass('vote');
            $(this).parent().removeClass('voted');
            post_feedback('item_remove_upvote', the_url, Buleys.view.type, Buleys.view.slug);
            remove_vote(the_url);

        } else {

            jQuery("#overlay_downvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-empty.png');
            jQuery("#overlay_upvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up.png');
            $('.vote').removeClass('vote');
            $(this).parent().addClass('voted');
            $(this).addClass('vote');

            post_feedback('item_upvote', the_url, Buleys.view.type, Buleys.view.slug);
            add_or_update_vote(the_url, 1);

        }
    });

    $('.vote_down').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
        var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");

        if (jQuery("#overlay_downvote_" + the_url_slug).hasClass('vote')) {

            jQuery("#overlay_downvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-empty.png');
            $('.vote').removeClass('vote');
            $(this).parent().removeClass('voted');

            post_feedback('item_remove_downvote', the_url, Buleys.view.type, Buleys.view.slug);
            remove_vote(the_url);

        } else {

            jQuery("#overlay_downvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb.png');
            jQuery("#overlay_upvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up-empty.png');

            $('.vote').removeClass('vote');
            $(this).parent().addClass('voted');
            $(this).addClass('vote');

            post_feedback('item_downvote', the_url, Buleys.view.type, Buleys.view.slug);
            add_or_update_vote(the_url, -1);

        }


    });

    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0,
    }, 0, function () {});

    jQuery("#overlay").stop(true).animate({
        opacity: 0,
    }, 0, function () {}).html('');


    $('#overlay .category').live('mouseenter', function (event) {
        event.preventDefault();
        add_category_controls(jQuery(this));
    });

    $('#overlay .category').live('mouseleave', function (event) {
        event.preventDefault();
        jQuery("#overlay .vote_up_category").remove();
        jQuery("#overlay .vote_down_category").remove();
        jQuery("#overlay .delete_category").remove();
    });


	
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
	        "context": '<?php echo $itemID; ?>',
	        "type": '<?php echo $typeID; ?>'
	    };
	
	
	    $.post("/feedback/index.php", data_to_send, dataType = "json", function (data) {
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
	        "context": '<?php echo $itemID; ?>',
	        "type": '<?php echo $typeID; ?>'
	    };
	
	    $.post("/feedback/index.php", data_to_send, dataType = "json", function (data) {
	        new_window = window.open(uri_string, click_window);
	
	    });
	
	});

	
});


	
	function load_profile_info() {
	
	    var data_to_send;
	    data_to_send = {
	        "method": "get_user_attributes"
	    };
	
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
	        jQuery("#small_profile").show();
	        if (typeof data.display_name != "undefined" && data.display_name != null) {
	            jQuery("#small_profile").append("<div id='small_profile_image'><a href='/profile/'><img src='http://www.gravatar.com/avatar/" + data.email_hash + "?s=42'></a></div><div><div id='small_profile_display_name'><a href='/profile/'>" + data.display_name + "</a></div>" + "</div>");
	            jQuery.each(data, function (key, val) {
	                add_or_update_setting(key, val);
	            });
	        }
	    }, dataType = "json");
	
	}
	
	
	function post_feedback(event_type, item_url, context_string, context_type_string) {
	    var data_to_send;
	    data_to_send = {
	        "event": event_type,
	        "item": item_url,
	        "context": context_string,
	        "type": context_type_string
	    };
	    $.post("/feedback/index.php", data_to_send, function () {
	
	    }, dataType = "json");
	}
	
	function database_is_open(open_result) {
	    Buleys.db = open_result;
	
	    if (!Buleys.session.database_is_open) {
	    console.log("open!", Buleys.db, Buleys.session.database_is_open);
	
	
	        check_login_status();
	
	        fire_off_request();
	
	        if (Buleys.view.type == "account") {
	            load_profile_info();
	        }
	
	        if (Buleys.view.type !== "account" && Buleys.view.type !== "home" && Buleys.view.type !== "signin" && Buleys.view.type !== "" && Buleys.view.type !== "start" && Buleys.view.type !== "settings" && Buleys.view.type !== "favorites" && Buleys.view.type !== "read" && Buleys.view.type !== "unread" && Buleys.view.type !== "seen" && Buleys.view.type !== "unseen" && Buleys.view.type !== "unarchived" && Buleys.view.type !== "archived") {
	            get_page_follow_status(Buleys.view.type, Buleys.view.slug);
	            get_page_subscription_status(Buleys.view.type, Buleys.view.slug);
	            get_page_topic_info(Buleys.view.type, Buleys.view.slug);
	        }
	
	        Buleys.session.database_is_open = true;
	
	    } else {
	
	    }
	
	/*
	      var $container = $('#results');
	
	      $container.isotope({
	        itemSelector : 'li',
	        getSortData : {
	          published : function( $elem ) {
	            return parseInt( $elem.attr('published-date') );
	          },
	          modified : function( $elem ) {
	            return parseInt( $elem.attr('modified') );
	          },
	          name : function ( $elem ) {
	            return $elem.text();
	          }
	        }
	      });*/
	
	
	
	
	}
	
	
	

	
	function show_loading() {
	
	    $("#index").html("<div class='loading'>&nbsp;</div>");
	
	}
	
	function hide_loading() {
	
	    $("#index .loading").hide();
	
	}
	
	
	function is_in_cursor_mode() {
	    if (jQuery('.cursor').length > 0) {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	
	function get_data_for_items(items) {
	    $.each(items, function (i, item) {
	
	        get_item(item.link);
	
	    });
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
	
	function new_categories_transaction() {
	
	    try {
	        var transaction = Buleys.db.transaction(["categories"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("categories");
	
	    } catch (e) {
	        console.log("new_categories_transaction(): Could not open objectStore. You may have to create it first");
	
	
	
	
	        var ver_to_set = 0;
	        if (!(Buleys.db.version > 0)) {
	            ver_to_set = ver_to_set + 1;
	        } else {
	            ver_to_set = 1;
	        }
	
	        console.log(Buleys.db);
	        var request = Buleys.db.setVersion(ver_to_set);
	        request.onsuccess = function (e) {
	
	
	            Buleys.objectStore = Buleys.db.createObjectStore("categories", {
	                "keyPath": "id"
	            }, true);
	
	            Buleys.objectStore.createIndex("link", "link", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("slug", "slug", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("type", "type", {
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
	
	
	function new_favorite_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["favorites"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
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
	
	function new_status_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["status"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("status");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("status", {
	                "keyPath": "link"
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
	
	function new_deleted_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["deleted"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("deleted");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("deleted", {
	                "keyPath": "link"
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
	
	function new_seen_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["seen"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("seen");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("seen", {
	                "keyPath": "link"
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
	
	function new_archived_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["archive"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("archive");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("archive", {
	                "keyPath": "link"
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
	
	
	
	function new_votes_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["votes"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("votes");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("votes", {
	                "keyPath": "vote_key"
	            }, false);
	
	            Buleys.objectStore.createIndex("vote_value", "vote_value", {
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
	
	function new_subscriptions_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["subscriptions"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("subscriptions");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("subscriptions", {
	                "keyPath": "key"
	            }, true);
	
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
	    };
	}
	
	function new_follows_transaction() {
	    try {
	
	        var transaction = Buleys.db.transaction(["follows"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	
	        transaction.onabort = function (e) {
	
	        };
	
	        Buleys.objectStore = transaction.objectStore("follows");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("follows", {
	                "keyPath": "key"
	            }, true);
	
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
	    };
	}
	
	function new_settings_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["settings"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("settings");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("settings", {
	                "keyPath": "option_name"
	            }, true);
	
	            Buleys.objectStore.createIndex("option_value", "option_value", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
	    };
	}
	
	function new_topics_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["topic"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("topic");
	
	    } catch (e) {
	
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
	            Buleys.objectStore = Buleys.db.createObjectStore("topic", {
	                "keyPath": "topic_key"
	            }, true);
	
	            Buleys.objectStore.createIndex("slug", "slug", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("type", "type", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("last_updated", "last_updated", {
	                unique: false
	            });
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	
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
	
	function new_social_transaction() {
	    try {
	        var transaction = Buleys.db.transaction(["social"], 1 /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("social");
	
	    } catch (e) {
	
	
	
	
	        var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
	        request.onsuccess = function (e) {
	
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
	        request.onerror = function (e) {
	
	        };
	
	
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
	                opacity: 1,
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
	            opacity: 1,
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
	                        opacity: 0,
	                    }, 500, function () {
	                        jQuery("#overlay").html('');
	                    });
	
	                }
	
	
	            });
	
	        } else {
	
	
	
	            jQuery("#overlay").stop(true).animate({
	                opacity: 0,
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
	                opacity: 0,
	            }, 500, function () {
	                jQuery("#overlay").html('');
	            });
	
	        }
	
	
	
	    }
	
	
	
	
	
	});
	
	
	jQuery("#results li").live('click', function (event) {
	
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
	    var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g, "");
	
	
	
	
	    if (jQuery(thekey).length > 0 && jQuery(item_to_work_from).hasClass('selected')) {
	        jQuery("#overlay").stop(true).animate({
	            opacity: 0,
	        }, 500, function () {
	            jQuery("#overlay").html('');
	        });
	    } else if (!jQuery(item_to_work_from).hasClass('selected')) {
	
	        jQuery("#overlay").stop(true).animate({
	            opacity: 1,
	        }, 100, function () {});
	
	        load_item_to_overlay(url_to_preview);
	
	
	    }
	
	    item_to_work_from.addClass('selected');
	
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



	
	function load_item_to_console(item_key) {
	
	    get_item_for_console(item_key);
	
	}
	
	function load_item_to_overlay(item_key) {
	
	    get_item_for_overlay(item_key);
	    check_if_item_is_favorited_for_overlay(item_key);
	    check_item_vote_status_for_overlay(item_key);
	
	
	
	
	
	}
	
	
	function send_to_console(text_to_send) {
	
	    send_text_to_console(text_to_send);
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 1,
	
	
	    }, 500);
	
	}
	
	
	function fade_console_message() {
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 0,
	    }, 500);
	
	}
	
	function send_to_overlay(text) {
	
	    send_text_to_overlay(text);
	    jQuery("#overlay").stop(true).animate({
	        opacity: 1,
	    }, 500);
	
	}
	
	function get_item_categories_for_overlay(item_url) {
	
	    new_categories_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStore.index("link");
	
	        var cursorRequest = Buleys.index.getAll(item_url);
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	                    if (jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length < 1) {
	                        var html_snippit = "<ul class='category_list' id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'></ul>";
	                        jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(html_snippit);
	                    }
	                    var cat_snippit = "<li id='list_item_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "' class='category_list_item' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "'><a id='" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "'  class='category' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "' href='/" + item.type.toLowerCase() + "/" + item.slug + "'>" + item.value + "</a></li>";
	                    jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(cat_snippit);
	
	                    get_vote_info(item_url, item.type.toLowerCase(), item.slug.toLowerCase());
	
	
	                });
	
	            }
	/*
						 else {
							if(jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).length < 1) {
								var html_snippit = "<ul id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'></ul>";
								jQuery( "#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( html_snippit );
							}
							debug = cursorRequest.result;
					
							var cat_snippit = "<li class='category_list_item' link='" + item_url + "' type='" + cursorRequest.result.type.toLowerCase() + "' slug='" + cursorRequest.result.slug.toLowerCase() + "'><a href='/" + cursorRequest.result.type.toLowerCase() + "/" + cursorRequest.result.slug + "'>" + cursorRequest.result.value + "</a></li>";
							jQuery( "#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( cat_snippit );
						}
						*/
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	/*
			item_request.onsuccess = function(event){
			
			
				if(typeof item_request.result != 'undefined') {
				
				
					if(jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).length < 1) {
						var html_snippit = "<div id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'></div>";
						jQuery( "#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( html_snippit );
					}
					var cat_snippit = "<a href='/" + item_request.result.type + "/" + item_request.result.slug + "'>" + item_request.result.value + "</a>";
					jQuery( "#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( cat_snippit );
				} else {
				
					
				}
			};
		
			item_request.onerror = function(e){
			
			
			};
		*/
	}
	
	
	function get_follows_deleteme() {
	
	    new_follows_transaction();
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStore.index("id");
	
	        var cursorRequest = Buleys.index.getAll();
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	                    send_to_console("get_follows(): " + item);
	                });
	            }
	
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	
	function get_page_follow_status(the_type, the_key) {
	
	    new_follows_transaction();
	
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	
	    item_request.onsuccess = function (event) {
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	            jQuery("#page_meta").append("<a href='#' class='follow_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/heart-empty.png'/></a>");
	        } else {
	
	            jQuery("#page_meta").append("<a href='#' class='follow_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/heart.png'/></a>");
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	    };
	
	}
	
	
	function remove_follow(the_type, the_key) {
	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	
	        new_follows_transaction();
	
	        var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
	        request.onsuccess = function (event) {
	
	            delete Buleys.objectId;
	        };
	        request.onerror = function () {
	
	        };
	    }
	
	
	}
	
	function add_follow_if_doesnt_exist(the_type, the_key) {
	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	        new_follows_transaction();
	
	        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	        item_request.onsuccess = function (event) {
	
	
	
	            if (typeof item_request.result == 'undefined') {
	
	                add_follow_to_follows_database(the_type, the_key);
	            } else {
	
	            }
	        };
	
	        item_request.onerror = function (e) {
	
	
	        };
	    }
	
	}
	
	function add_follow_to_follows_database(the_type, the_key) {
	
	
	    new_follows_transaction();
	
	    var data = {
	        "key": the_type + "_" + the_key,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function get_subscriptions() {
	
	    new_subscriptions_transaction();
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStore.index("id");
	
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
	
	
	function get_page_subscription_status(the_type, the_key) {
	
	    new_subscriptions_transaction();
	
	
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	            jQuery("#page_meta").append("<a href='#' class='subscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail.png'/></a>");
	        } else {
	
	            jQuery("#page_meta").append("<a href='#' class='unsubscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail-send.png'/></a>");
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	function remove_subscription(the_type, the_key) {
	
	
	    new_subscriptions_transaction();
	
	    var request = Buleys.objectStore["delete"](the_type + "_" + the_key);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	function add_subscription_if_doesnt_exist(the_type, the_key) {
	
	    if (typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
	        new_subscriptions_transaction();
	
	        var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	        item_request.onsuccess = function (event) {
	
	
	
	            if (typeof item_request.result == 'undefined') {
	
	                add_subscription_to_subscriptions_database(the_type, the_key);
	            } else {
	
	            }
	        };
	
	        item_request.onerror = function (e) {
	
	
	        };
	    }
	
	}
	
	function add_subscription_to_subscriptions_database(the_type, the_key) {
	
	
	    new_subscriptions_transaction();
	
	    var data = {
	        "key": the_type + "_" + the_key,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
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
	
	
	function add_categories_to_categories_database(item_url, categories) {
	
	
	
	    jQuery.each(categories, function (c, the_category) {
	
	        if (typeof the_category.key !== 'undefined') {
	
	
	
	
	            new_categories_transaction();
	
	
	            var data = {
	                "id": item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_category.key.toLowerCase() + the_category.type.toLowerCase(),
	                "link": item_url,
	                "slug": the_category.key,
	                "type": the_category.type,
	                "value": the_category.value,
	                "modified": new Date().getTime()
	            };
	
	
	
	            var add_data_request = Buleys.objectStore.add(data);
	            add_data_request.onsuccess = function (event) {
	
	
	                if (typeof the_category.key !== 'undefined') {
	                    var topic_key = the_category.type.toLowerCase() + "_" + the_category.key.toLowerCase();
	                    if (typeof Buleys.queues.new_items[topic_key] == "undefined") {
	
	
	                        Buleys.queues.new_items[topic_key] = 0;
	                    }
	                    Buleys.queues.new_items[topic_key] = Buleys.queues.new_items[topic_key] + 1;
	                }
	            };
	            add_data_request.onerror = function (e) {
	
	
	            };
	
	        }
	
	
	    });
	
	}
	
	function add_item_to_readstatus_database(item, status) {
	
	    if (typeof status == 'undefined') {
	        status = "unread";
	    }
	
	    new_status_transaction();
	
	    var data = {
	        "link": item.link,
	        "status": status,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	
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
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#overlay_left").prepend("<span class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
	
	            jQuery("#overlay_left").addClass('favorited');
	
	
	        } else {
	
	            jQuery("#overlay_left").prepend("<span class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
	
	
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
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('favorited');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='favorite_status'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
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
	
	function remove_item_from_archives_database(item_url, item_slug, item_type) {
	
	
	    new_archived_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
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
	
	
	
	
	function add_item_as_seen(item_url) {
	
	
	    new_seen_transaction();
	
	    var data = {
	        "link": item_url,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function check_if_item_is_seen(item_url) {
	
	
	    new_seen_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('seen');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unseen');
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	}
	
	function add_item_to_seens_database(item_url, item_slug, item_type) {
	
	
	    new_seen_transaction();
	
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
	
	
	function remove_item_from_seens_database(item_url, item_slug, item_type) {
	
	
	    new_seen_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	function archive_item(item_url) {
	
	
	    new_archived_transaction();
	
	    var data = {
	        "link": item_url,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function check_if_item_is_archived(item_url) {
	
	
	    new_archived_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('archived');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('unarchived');
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	}
	
	function add_item_to_archives_database(item_url, item_slug, item_type) {
	
	
	    new_archived_transaction();
	
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
	
	function unarchive_item(item_url, item_slug, item_type) {
	
	
	    new_archived_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	function remove_item_from_categories_database(item_url, item_slug, item_type) {
	
	
	
	    new_categories_transaction();
	    Buleys.index = Buleys.objectStore.index("link");
	
	    var request_for_item = Buleys.index.get(item_url);
	    request_for_item.onsuccess = function (event) {
	        if (typeof request_for_item.result !== 'undefined') {
	
	            if (typeof request_for_item.result !== 'undefined') {
	
	                var slug_string = "";
	                slug_string = request_for_item.result.link.replace(/[^a-zA-Z0-9-_]+/g, "") + request_for_item.result.slug.toLowerCase() + request_for_item.result.type.toLowerCase();
	
	                new_categories_transaction();
	
	                var request_2 = Buleys.objectStore["delete"](slug_string);
	                request_2.onsuccess = function (event) {
	
	                    delete Buleys.objectId;
	                };
	                request_2.onerror = function () {
	
	                };
	
	
	            } else {
	
	                $.each(request_for_item.result, function (i, item) {
	
	
	
	                    var slug_string = "";
	                    slug_string = item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + item.slug.toLowerCase() + item.type.toLowerCase();
	
	                    new_categories_transaction();
	
	                    var request_2 = Buleys.objectStore["delete"](slug_string);
	                    request_2.onsuccess = function (event) {
	
	                        delete Buleys.objectId;
	                    };
	                    request_2.onerror = function () {
	
	                    };
	
	
	
	                });
	
	            }
	        }
	    };
	    request_for_item.onerror = function () {
	
	    };
	
	
	}
	
	
	
	
	function delete_item(item_url, the_type, the_slug) {
	
	
	    new_deleted_transaction();
	
	    var data = {
	        "link": item_url,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	/*
				
				
		
				remove_item_from_items_database(item_url, the_type, the_slug);
			
				remove_item_from_favorites_database(item_url, the_type, the_slug);
			
				remove_item_from_categories_database(item_url, the_type, the_slug);
			
				remove_item_from_archives_database(item_url, the_type, the_slug);
			
				remove_item_from_seens_database(item_url, the_type, the_slug);
			
				remove_item_from_read_database(item_url, the_type, the_slug);
	
	
				*/
	    };
	    add_data_request.onerror = function (e) {
	
	
	
	    };
	
	
	
	
	
	    remove_item_from_favorites_database(item_url, the_type, the_slug);
	
	    remove_item_from_categories_database(item_url, the_type, the_slug);
	
	    remove_item_from_archives_database(item_url, the_type, the_slug);
	
	    remove_item_from_seens_database(item_url, the_type, the_slug);
	
	    remove_item_from_read_database(item_url, the_type, the_slug);
	
	
	
	}
	
	function check_if_item_is_deleted(item_url) {
	
	
	    new_deleted_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;
	
	
	        if (typeof item_request.result != 'undefined') {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).addClass('deleted');
	
	        } else {
	
	            jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	}
	
	function add_item_to_deletes_database(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
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
	
	function remove_item_from_deletes_database(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	
	
	
	function mark_item_as_read(item_url, item_slug, item_type) {
	
	
	    new_status_transaction();
	
	    var data = {
	        "link": item_url,
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
	
	function remove_item_from_read_database(item_url, item_slug, item_type) {
	
	
	    new_status_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	function mark_item_as_seen(item_url, item_slug, item_type) {
	
	
	    new_seen_transaction();
	
	    var data = {
	        "link": item_url,
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
	
	function mark_item_as_unseen(item_url, item_slug, item_type) {
	
	
	    new_seen_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	function mark_item_as_deleted(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	    var data = {
	        "link": item_url,
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
	
	function mark_item_as_undeleted(item_url, item_slug, item_type) {
	
	
	    new_deleted_transaction();
	
	
	    var request = Buleys.objectStore["delete"](item_url);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	
	function remove_category_for_item(item_url, item_slug, item_type) {
	
	
	    new_categories_transaction();
	
	    var request = Buleys.objectStore["delete"](item_url + item_type + item_slug);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	
	
	}
	
	
	function check_for_waiting_items() {
	
	
	
	    notify_user_of_new_items(Buleys.queues.new_items, type_to_get, company_to_get);
	
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
	
	
	function open_database() {
	
	    var database_open_request = window.indexedDB.open("Buleys-317");
	    database_open_request.onsuccess = function (event) {
	        console.log("!!!", database_open_request.result);
	        database_is_open(database_open_request.result);
	    };
	
	    database_open_request.onerror = function (e) {
	
	    };
	
	
	}
	
	function send_text_to_console(text_to_send) {
	
	    jQuery("#console").html('').append("<p>" + text_to_send + "</p>");
	
	
	
	
	}
	
	function send_text_to_overlay(text_to_send) {
	
	    jQuery("#overlay").html('').append(text_to_send);
	
	
	
	
	}
	
	function add_category_controls(event_context) {
	    jQuery("#overlay .vote_up_category").remove();
	    jQuery("#overlay .vote_down_category").remove();
	    jQuery("#overlay .delete_category").remove();
	    jQuery("#overlay .selected_category").removeClass('.selected_category');
	
	
	
	    var html_snippit;
	    var current = jQuery(event_context).html();
	    var the_link = jQuery(event_context).attr('link');
	    var the_type = jQuery(event_context).attr('type');
	    var the_slug = jQuery(event_context).attr('slug');
	    html_snippit = "<span class='vote_up_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/thumb-up.png'>&nbsp;</span>";
	    html_snippit = html_snippit + "<span class='vote_down_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/thumb.png'>&nbsp;&nbsp;</span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/cross-button.png'></div>";
	    jQuery(event_context).html(html_snippit);
	
	}
	
	
	
	function get_settings() {
	
	    try {
	
	        new_settings_transaction();
	        Buleys.index = Buleys.objectStore.index("option_name");
	
	        var cursorRequest = Buleys.index.getAll();
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                Buleys.view.type == "account";
	                jQuery.each(objectCursor, function (k, item) {
	                    console.log("get_settings(): " + item);
	                });
	            }
	
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	
	function remove_setting(option_name) {
	
	    new_settings_transaction();
	
	    var request = Buleys.objectStore["delete"](option_name);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	}
	
	function load_all_settings_into_dom() {
	
	    new_settings_transaction();
	
	
	    var item_request = Buleys.objectStore.getAll();
	
	    item_request.onsuccess = function (event) {
	        if (typeof item_request.result !== 'undefined') {
	
	
	            if (item_request.result.length >= 0) {
	                jQuery.each(item_request.result, function (k, item) {
	
	                    Buleys.settings[item.option_name] = item.option_value;
	
	                });
	            }
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_or_update_setting(option_name, option_value) {
	
	    new_settings_transaction();
	    if (typeof option_value == 'undefined') {
	        option_value = '';
	    }
	
	    var item_request = Buleys.objectStore.get(option_name);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_setting_to_settings_database(option_name, option_value);
	        } else {
	
	            update_setting_in_settings_database(option_name, option_value);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_setting_to_settings_database(option_name, option_value) {
	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function update_setting_in_settings_database(option_name, option_value) {
	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
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
	
	
	
	
	function check_item_vote_status_for_overlay(item_url) {
	
	
	    new_votes_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url.replace(/[^a-zA-Z0-9-_]+/g, ""));
	
	    item_request.onsuccess = function (event) {
	
	        checker = item_request;

	
	        if (typeof event.target.result !== 'undefined') {
	
	            if (event.target.result.vote_value == -1) {
	                jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ><img src="/images/icons/fugue-shadowless/thumb.png"/></a></div>');
	
	            } else if (event.target.result.vote_value == 1) {
	                jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
	
	            } else {
	                jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
	            }
	            jQuery("#overlay_left").parent().addClass('voted');
	
	
	        } else {
	            jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
	            jQuery("#overlay_left").parent().addClass('unvoted');
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	
	}
	
	
	
	
	function get_vote_info(the_url, the_type, the_key) {
	
	    new_votes_transaction();
	
	    var vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_key.toLowerCase();
	
	    var item_request = Buleys.objectStore.get(vote_key);
	
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	        } else {
	
	            if (typeof item_request.result != 'undefined') {
	
	
	                if (item_request.result.vote_value == 0) {
	                    jQuery("#" + vote_key).addClass("voted downvoted");
	                } else if (item_request.result.vote_value == 1) {
	                    jQuery("#" + vote_key).addClass("voted upvoted");
	                }
	
	            }
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	function get_votes() {
	
	    try {
	
	        new_votes_transaction();
	        Buleys.index = Buleys.objectStore.index("vote_key");
	
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
	
	
	function remove_vote(vote_key) {
	
	    new_votes_transaction();
	
	    var request = Buleys.objectStore["delete"](vote_key);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	}
	
	function add_or_update_vote(vote_key, vote_value) {
	
	
	    new_votes_transaction();
	    if (typeof vote_value == 'undefined') {
	        vote_value = '';
	    }
	    var item_request = Buleys.objectStore.get(vote_key);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_vote_to_votes_database(vote_key, vote_value);
	        } else {
	
	            update_vote_in_votes_database(vote_key, vote_value);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_vote_to_votes_database(vote_key, vote_value) {
	
	
	    new_votes_transaction();
	
	    var data = {
	        "vote_key": vote_key,
	        "vote_value": vote_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function update_vote_in_votes_database(vote_key, vote_value) {
	
	
	    new_votes_transaction();
	
	    var data = {
	        "vote_key": vote_key,
	        "vote_value": vote_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function load_page_title_info(page_info) {
	    if (typeof page_info.name != 'undefined' && jQuery("a .topic_name").length > 0) {
	        jQuery("#page_meta").append("<a href='/" + page_info.type + "/" + page_info.key + "' class='topic_name'>" + page_info.name + "</a>");
	    }
	    if (typeof page_info.subsector != 'undefined' && jQuery("a .sector_name").length > 0) {
	        jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(page_info.subsector).toLowerCase() + "' class='sector_name'>" + page_info.subsector + "</a>");
	    }
	
	    if (typeof page_info.sector != 'undefined' && jQuery("a .subsector_name").length > 0) {
	        jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(page_info.sector).toLowerCase() + "' class='subsector_name'>" + page_info.sector + "</a>");
	    }
	}
	
	
	
	function get_page_topic_info(the_type, the_key) {
	
	    new_topics_transaction();
	
	
	    var item_request = Buleys.objectStore.get(the_type + "_" + the_key);
	
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	        } else {
	
	            if (typeof item_request.result.name != 'undefined') {
	                jQuery("#page_meta").append("<a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a>");
	                window.document.title = window.document.title.replace(/[|\s]*?Buley's/, "");
	                window.document.title = window.document.title + item_request.result.name + " | Buley's";
	
	
	            }
	            if (typeof item_request.result.subsector != 'undefined') {
	                jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
	            }
	
	            if (typeof item_request.result.sector != 'undefined') {
	                jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
	            }
	
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	function get_topics() {
	
	    try {
	
	        new_topics_transaction();
	        Buleys.index = Buleys.objectStore.index("topic_key");
	
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
	
	
	function remove_topic(topic_key) {
	
	    new_topics_transaction();
	
	    var request = Buleys.objectStore["delete"](topic_key);
	    request.onsuccess = function (event) {
	
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	
	    };
	}
	
	function add_or_update_topic(topic_key, topic) {
	
	    new_topics_transaction();
	    if (typeof topic == 'undefined') {
	        topic = {};
	    }
	
	    var item_request = Buleys.objectStore.get(topic_key);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_topic_to_topics_database(topic_key, topic);
	        } else {
	
	            update_topic_in_topics_database(topic_key, topic);
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function add_topic_to_topics_database(topic_key, topic) {
	
	
	    new_topics_transaction();
	
	    if (typeof topic == "undefined") {
	        var topic = {};
	    }
	    topic.topic_key = topic_key;
	    topic.modified = new Date();
	
	
	    var add_data_request = Buleys.objectStore.add(topic);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	function update_topic_in_topics_database(topic_key, topic) {
	
	
	    new_topics_transaction();
	
	    topic.topic_key = topic_key;
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
	
	
	    var add_data_request = Buleys.objectStore.put(topic);
	    add_data_request.onsuccess = function (event) {
	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	function getURLSlug(rough) {
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
	
	
	/*not mine*/
	
	function minutes_ago(time) {
	
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
	
	
	
	function cancel_confirmation(user_id) {
	
	}
	
	
	function set_local_storage(set_key, set_value) {
	    return Buleys.store.setItem(set_key, set_value);
	}
	
	function get_local_storage(get_key) {
	    return Buleys.store.getItem(get_key);
	}
	
	
	function request_login(email, password) {
	
	    password = md5(password);
	    var data_to_send;
	    data_to_send = {
	        "method": "request_login",
	        "secret": password,
	        "email": email,
	        "token": session_token
	    };
	    $.post("/api/index.php", data_to_send, function (data) {
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
	
	
	function request_registration(password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country) {
	
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
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
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
	
	function confirm_registration(secret) {
	
	    data_to_send = {
	        "method": "confirm_account",
	        "secret": secret
	    };
	
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
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
	
	
	function send_confirmation(email, page, context, resend) {
	
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
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
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
	
	function account_login(email, password) {
	    var secret = md5(password);
	    data_to_send = {
	        "method": "email_login",
	        "email": email,
	        "secret": secret
	    };
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
	
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
	                    send_to_console("<p>Logged in successfully.</p>");
	
	                }
	                jQuery("#register").fadeOut('fast');
	                jQuery("#login").fadeOut('fast');
	                jQuery("#logout").fadeIn('fast');
	                close_button(jQuery("#login_status_pane"));
	            }
	        }
	    }, "json");
	}
	
	function account_logout() {
	
	    data_to_send = {
	        "method": "logout"
	    };
	
	    $.post("/feedback/index.php", data_to_send, function (data) {
	        if (typeof(data.result) !== 'undefined') {
	            delete Buleys.store["session_id"];
	            jQuery("#login").fadeIn('fast');
	            jQuery("#logout").fadeOut('fast');
	        }
	    }, "json");
	}
	
	
	function submit_registration() {
	
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
	
	
	/*$(this).dialog("close");
				$("#register").fadeIn('slow');
	
	*/
	
	/* send_confirmation(jQuery("#pending_email").html(), "", "", true);
				jQuery("#pending_email").remove(); */
	/* $(this).dialog("close");
				$("#register").fadeIn('slow'); */
	
	
	/* $(this).dialog("close");
				$("#register").fadeIn('slow'); */
	/* if($('#login_email').val() != '' && $('#login_password').val() != '') {
					account_login($('#login_email').val(),$('#login_password').val());
				}*/
	
	
	function md5(str) {
	
	    str = str + "Buleys";
	
	
	
	
	
	
	
	
	
	
	
	
	    var xl;
	
	    var rotateLeft = function (lValue, iShiftBits) {
	        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	    };
	
	    var addUnsigned = function (lX, lY) {
	        var lX4, lY4, lX8, lY8, lResult;
	        lX8 = (lX & 0x80000000);
	        lY8 = (lY & 0x80000000);
	        lX4 = (lX & 0x40000000);
	        lY4 = (lY & 0x40000000);
	        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
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
	
	    var _F = function (x, y, z) {
	        return (x & y) | ((~x) & z);
	    };
	    var _G = function (x, y, z) {
	        return (x & z) | (y & (~z));
	    };
	    var _H = function (x, y, z) {
	        return (x ^ y ^ z);
	    };
	    var _I = function (x, y, z) {
	        return (y ^ (x | (~z)));
	    };
	
	    var _FF = function (a, b, c, d, x, s, ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	
	    var _GG = function (a, b, c, d, x, s, ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	
	    var _HH = function (a, b, c, d, x, s, ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	
	    var _II = function (a, b, c, d, x, s, ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	
	    var convertToWordArray = function (str) {
	        var lWordCount;
	        var lMessageLength = str.length;
	        var lNumberOfWords_temp1 = lMessageLength + 8;
	        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
	        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
	        var lWordArray = new Array(lNumberOfWords - 1);
	        var lBytePosition = 0;
	        var lByteCount = 0;
	        while (lByteCount < lMessageLength) {
	            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
	            lBytePosition = (lByteCount % 4) * 8;
	            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
	            lByteCount++;
	        }
	        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
	        lBytePosition = (lByteCount % 4) * 8;
	        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
	        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
	        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
	        return lWordArray;
	    };
	
	    var wordToHex = function (lValue) {
	        var wordToHexValue = "",
	            wordToHexValue_temp = "",
	            lByte, lCount;
	        for (lCount = 0; lCount <= 3; lCount++) {
	            lByte = (lValue >>> (lCount * 8)) & 255;
	            wordToHexValue_temp = "0" + lByte.toString(16);
	            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
	        }
	        return wordToHexValue;
	    };
	
	    var x = [],
	        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
	        S12 = 12,
	        S13 = 17,
	        S14 = 22,
	        S21 = 5,
	        S22 = 9,
	        S23 = 14,
	        S24 = 20,
	        S31 = 4,
	        S32 = 11,
	        S33 = 16,
	        S34 = 23,
	        S41 = 6,
	        S42 = 10,
	        S43 = 15,
	        S44 = 21;
	
	    str = this.utf8_encode(str);
	    x = convertToWordArray(str);
	    a = 0x67452301;
	    b = 0xEFCDAB89;
	    c = 0x98BADCFE;
	    d = 0x10325476;
	
	    xl = x.length;
	    for (k = 0; k < xl; k += 16) {
	        AA = a;
	        BB = b;
	        CC = c;
	        DD = d;
	        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
	        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
	        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
	        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
	        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
	        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
	        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
	        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
	        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
	        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
	        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
	        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
	        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
	        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
	        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
	        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
	        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
	        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
	        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
	        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
	        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
	        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
	        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
	        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
	        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
	        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
	        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
	        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
	        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
	        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
	        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
	        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
	        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
	        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
	        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
	        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
	        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
	        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
	        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
	        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
	        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
	        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
	        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
	        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
	        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
	        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
	        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
	        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
	        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
	        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
	        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
	        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
	        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
	        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
	        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
	        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
	        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
	        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
	        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
	        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
	        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
	        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
	        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
	        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
	        a = addUnsigned(a, AA);
	        b = addUnsigned(b, BB);
	        c = addUnsigned(c, CC);
	        d = addUnsigned(d, DD);
	    }
	
	    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
	
	    return temp.toLowerCase();
	}
	
	function utf8_encode(argString) {
	
	
	
	
	
	
	
	
	
	
	
	
	    var string = (argString + '');
	
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
	            start = end = n + 1;
	        }
	    }
	
	    if (end > start) {
	        utftext += string.substring(start, string.length);
	    }
	
	    return utftext;
	}
	
	
	
	
	if (window.webkitNotifications) {
	
	} else {
	
	}
	
	
	function createNotificationInstance(options) {
	    if (options.notificationType == 'simple') {
	        return window.webkitNotifications.createNotification('icon.png', 'Notification Title', 'Notification content...');
	    } else if (options.notificationType == 'html') {
	        return window.webkitNotifications.createHTMLNotification('http://someurl.com');
	    }
	}
	
	function send_notification_to_desktop() {
	
	    if (window.webkitNotifications.checkPermission() == 0) {
	
	        notification_test = createNotificationInstance({
	            notificationType: 'html'
	        });
	        notification_test.ondisplay = function () {};
	        notification_test.onclose = function () {};
	        notification_test.show();
	    } else {
	        window.webkitNotifications.requestPermission();
	    }
	
	
	}
	
	$('#show_button').live('click', function (e) {
	    send_notification_to_desktop();
	});
	
	
	/*
	    var worker = new Worker("worker.js");
	
	    worker.onmessage = function(event) {
	      document.getElementById("body").textContent = event.data;
	     
	    };
	
	    worker.onerror = function(error) {
	     
	      throw error;
	    };
	
	    worker.postMessage("5");
	*/
	
	
	function get_follows() {
	    try {
	
	        new_follows_transaction();
	        Buleys.index = Buleys.objectStore;
	
	        var cursorRequest = Buleys.index.getAll();
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	
	
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	
	                    parse_single_topic(item.key);
	
	                });
	            }
	
	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	$('html').bind('mousemove', function (e) {
	    Buleys.mouse.mouse_x = e.pageX;
	    Buleys.mouse.mouse_y = e.pageY;
	});
	
	function getKeys(obj) {
	    var keys = [];
	    if (typeof obj !== "undefined") {
	        $.each(obj, function (key, obj) {
	            keys.push(key);
	        });
	        return keys.length;
	    } else {
	        return 0;
	    }
	}
	
	function do_work() {
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
	                jQuery("#get_inbox img").attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox-document.png").parent().parent().removeClass('empty_inbox').addClass('waiting_inbox');
	            }
	
	        } else {
	
	            jQuery("#get_inbox img").attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox.png").parent().parent().addClass('empty_inbox').removeClass('waiting_inbox');
	
	
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
	
	function do_pending_crawl() {
	
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
	        error: function () {
	            $("#index").html("<li class='item'>No results.</li>");
	        },
	        success: function (data) {
	
	
	            add_items(data.items, type_to_get, company_to_get);
	
	
	
	        }
	    });
	
	
	}
	
	
	function parse_single_topic(topic_slug) {
	
	    var split_string = topic_slug.split("_");
	    var type_to_get = split_string[0];
	    var company_to_get = split_string[1];
	
	
	    var item = Buleys.queues.pending_crawls.slice(0, 1);
	    Buleys.queues.pending_crawls.push(topic_slug);
	
	
	
	}
	
	
	function notify_user_of_new_items(number, thetype, thecompany) {
	
	    if ((Buleys.view.type === thetype && thecompany === Buleys.view.slug) || Buleys.view.type == "home" || typeof Buleys.view.type === "undefined") {
	        flash_console("<p>" + number + " new items added to " + thetype + " " + thecompany + " </p>");
	    }
	
	}
	
	function flash_console(message) {
	
	    send_to_console(message);
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 1,
	
	
	    }, 500);
	
	    jQuery("#console_wrapper").stop(true).animate({
	        opacity: 0,
	
	
	    }, 500);
	
	
	}
	
	
	
	function load_settings_into_dom() {
	
	    new_settings_transaction();
	
	    Buleys.index = Buleys.objectStore.index();
	
	
	    var cursorRequest = Buleys.objectStore.getAll();
	    cursorRequest.onsuccess = function (event) {
	
	        new_settings_transaction();
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	
	            return;
	        }
	
	
	
	
	        if (objectCursor.length >= 0) {
	            jQuery.each(objectCursor, function (k, item) {
	
	                Buleys.settings[k] = item;
	
	            });
	        }
	
	    };
	    request.onerror = function (event) {
	
	    };
	
	
	}
	
	
	
	function add_topics_to_mini_inbox() {
	
	
	
	    jQuery("#mini_inbox_list").html('');
	    var item_count = 0;
	    if (getKeys(Buleys.queues.new_items) > 0) {
	        $.each(Buleys.queues.new_items, function (topic_id, count) {
	            if (item_count <= Buleys.settings.mini_inbox_topic_count) {
	
	
	                add_topic_to_mini_inbox(topic_id, count);
	                item_count++;
	
	            } else {
	
	            }
	        });
	    } else {
	        jQuery("#mini_inbox_list").html('<li>No new items</li>');
	    }
	
	
	
	}
	
	
	function add_topic_to_mini_inbox(topic_id, count) {
	
	    new_topics_transaction();
	
	
	    var item_request = Buleys.objectStore.get(topic_id);
	
	    item_request.onsuccess = function (event) {
	
	
	
	        if (typeof item_request.result == 'undefined' || item_request.result == "") {
	
	            var split_string = topic_id.split("_", 1);
	
	            var type_to_get = split_string[0];
	            var company_to_get = topic_id.replace((split_string[0] + "_"), "");
	
	            jQuery("#mini_inbox_list").append("<li><a href='/" + type_to_get + "/" + company_to_get + "' class='topic_name'>" + topic_id + "</a> (" + count + ")</li>");
	
	        } else {
	
	            if (typeof item_request.result.name != 'undefined') {
	                jQuery("#mini_inbox_list").append("<li><a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a> (" + count + ")</li>");
	            }
	/*
					if(typeof item_request.result.subsector != 'undefined') {
						jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
					}
	
					if(typeof item_request.result.sector != 'undefined') {
						jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
					}
					*/
	
	
	        }
	    };
	
	    item_request.onerror = function (e) {
	
	
	    };
	
	
	}
	
	
	function save_queues() {
	
	    add_or_update_queue("new_items", Buleys.queues.new_items);
	    add_or_update_queue("pending_crawls", Buleys.queues.pending_crawls);
	
	}
	
	function save_settings() {
	
	    add_or_update_setting("profile", Buleys.profile);
	
	}
	
	
	/*
	var font_percent = .014;
	
	function runit(){
	
	  msg='';
	  msg=document.body.clientWidth;
	  	var font_math = Math.round(font_percent*msg*1);
	  
	    jQuery("body").css("font-size",font_math);
	}
	
	var nn4_prev_width, nn4_prev_height, is_nn4 = false;
	window.onload=function(){addWinResizeListener(runit);runit();}
	
	function addWinResizeListener(fn){
	  if(window.addEventListener){
	    window.addEventListener('resize', fn, false);
	  }else if(window.attachEvent){
	    window.attachEvent('onresize', fn);
	  }else if(document.layers && typeof(window.innerWidth)!='undefined'){
	    nn4_prev_width=window.innerWidth;
	    nn4_prev_height=window.innerHeight;
	    is_nn4=true;
	    setTimeout("nn_resize()", 500);
	  }else{
	    window.onresize=fn;
	  }
	}
	
	function nn_resize(){
	  if(window.innerWidth != nn4_prev_width || window.innerHeight != nn4_prev_height){
	    runit();
	  }else {
	    setTimeout("nn_resize()", 500);
	  }
	}
	*/
	
	
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
	    var cursorRequest = Buleys.index.getAll(slug_filter);
	
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
	
	                                } else {
	
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
	
	
	/*
				
			
			Buleys.keyRange = new IDBKeyRange.bound(begin_date, end_date, true, false);
		
			
			Buleys.onCursor = function(callback){
				new_favorite_transaction();
			
				Buleys.index = Buleys.objectStore.index("modified");
				var favorite_item_request = Buleys.index.openCursor(Buleys.keyRange);
				
				favorite_item_request.onsuccess = function(event){
	
				
				
					
					if(typeof favorite_item_request.result !== "undefined") {
					
					
						Buleys.cursor = favorite_item_request.result;
					
						
					
					
						
						if (typeof type_filter !== 'undefined' && typeof slug_filter !== 'undefined' && type_filter == Buleys.cursor.value.topic_type && slug_filter == Buleys.cursor.value.topic_slug) { 
					
							get_item( Buleys.cursor.value.item_link );
							
						} else if (typeof type !== 'undefined' && type_filter == "favorites") {
					
							get_item( Buleys.cursor.value.item_link );
						
					
						} else if (typeof type_filter == 'undefined' && slug_filter == 'undefined') {
					
							get_item( Buleys.cursor.value.item_link );
						
						}  else {
						
						}
	
						Buleys.cursor["continue"]();
					}
				};
								    
				favorite_item_request.onerror = function(event){
				
				
				};
				
				
			Buleys.onCursor(function(){
			
			});
			
			
			};
				*/
	
	
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
	
	                    if (typeof favorite_request_2.result !== 'undefined') {
	
	
	
	                    } else {
	
	
	
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
	
	            var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><a href="#" class="close_sidebar_link" id="' + favorite_slug + '"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div>' + "<h3 id='overlay_" + favorite_slug.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + favorite_request.result.link + "'>" + favorite_request.result.title + "</a></h3></div><div id='overlay_left'></div>";
	/*
				<div id='overlay_controls'><a href='" + favorite_slug + "' class='favorite_favorite'>Favorite</a>&nbsp;<a href='" + favorite_slug + "' class='unfavorite_favorite'>Unfavorite</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_read'>Mark as read</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unread'>Mark as unread</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_seen'>Mark as seen</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + favorite_slug + "' class='archive_favorite'>Archive</a>&nbsp;<a href='" + favorite_slug + "' class='delete_favorite'>Delete</a>&nbsp;<a href='" + favorite_slug + "' class='unarchive_favorite'>Unarchive</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_up'>Vote up</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_down'>Vote down</a>&nbsp;<a href='" + favorite_slug + "' class='close_favorite_preview'>Close preview</a></div>
				*/
	
	            if (typeof favorite_request.result.author !== 'undefined' && favorite_request.result.author.length > 0) {
	
	            }
	
	            send_to_overlay(html_snippit);
	        }
	    };
	
	    favorite_request.onerror = function (e) {
	
	
	    };
	
	}
	
	
	
	function add_favorite_to_results(item) {
	
	
	    var id = item.link.replace(/[^a-zA-Z0-9-_]+/g, "");
	
	    if (!(jQuery("#" + id).length)) {
	
	
	        jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item' href='http://buleys.com/images/icons/fugue-shadowless/magnifier.png'></a></li>").hide().prependTo("#results").fadeIn('slow');
	
	
	
	    } else {
	
	
	
	    }
	}
	
	
	
	
	function get_archived(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	    Buleys.index = Buleys.objectStore.index("slug");
	    var cursorRequest = Buleys.index.getAll(slug_filter);
	
	    cursorRequest.onsuccess = function (event) {
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	            return;
	        }
	
	
	
	        if (objectCursor.length > 1) {
	            jQuery.each(objectCursor, function (k, item) {
	
	
	
	
	
	
	                new_archived_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item_request_2.result.link);
	
	                        item_request.onsuccess = function (event) {
	
	                            if (typeof item_request.result !== 'undefined') {
	
	
	                                if (typeof item_request.result.link !== 'undefined') {
	
	
	                                    if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                                        get_item_raw(item_request.result.link);
	                                    }
	
	                                } else {
	
	                                }
	                            }
	
	                        };
	                    } else if (make_inverse == true) {
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item.link);
	
	                        item_request.onsuccess = function (event) {
	
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
	
	                };
	
	
	
	
	
	
	
	
	            });
	
	        } else {
	            get_item(objectCursor.link);
	        }
	    };
	    cursorRequest.onerror = function (event) {
	
	    };
	
	
	
	}
	
	
	
	function get_deleted(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	    Buleys.index = Buleys.objectStore.index("slug");
	    var cursorRequest = Buleys.index.getAll(slug_filter);
	
	    cursorRequest.onsuccess = function (event) {
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	            return;
	        }
	
	
	
	        if (objectCursor.length > 1) {
	            jQuery.each(objectCursor, function (k, item) {
	
	
	
	
	
	
	                new_deleted_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item_request_2.result.link);
	
	                        item_request.onsuccess = function (event) {
	
	                            if (typeof item_request.result !== 'undefined' && make_inverse !== true) {
	
	
	                                if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                                    get_item_raw_no_trash(item_request.result.link);
	                                }
	
	                            }
	
	                        };
	                    } else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
	
	                        new_item_transaction();
	
	                        var item_request = Buleys.objectStore.get(item.link);
	
	                        item_request.onsuccess = function (event) {
	
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
	
	                };
	
	
	
	
	
	
	
	
	            });
	
	        } else {
	            get_item(objectCursor.link);
	        }
	    };
	    cursorRequest.onerror = function (event) {
	
	    };
	
	
	
	}
	
	
	function get_read(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	    Buleys.index = Buleys.objectStore.index("slug");
	    var cursorRequest = Buleys.index.getAll(slug_filter);
	
	    cursorRequest.onsuccess = function (event) {
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	            return;
	        }
	
	
	
	        if (objectCursor.length > 1) {
	            jQuery.each(objectCursor, function (k, item) {
	
	
	
	
	
	
	                new_status_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item_raw(item_request_2.result.link);
	                        }
	
	                    } else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item_raw(item.link);
	                        }
	
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
	
	
	function get_seen(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
	
	
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
	
	    Buleys.index = Buleys.objectStore.index("slug");
	    var cursorRequest = Buleys.index.getAll(slug_filter);
	
	    cursorRequest.onsuccess = function (event) {
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	            return;
	        }
	
	
	
	        if (objectCursor.length > 1) {
	            jQuery.each(objectCursor, function (k, item) {
	
	
	
	
	
	
	                new_seen_transaction();
	
	                var item_request_2 = Buleys.objectStore.get(item.link);
	                item_request_2.onsuccess = function (event) {
	                    if (typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item(item_request_2.result.link);
	                        }
	
	
	                    } else if (typeof item_request_2.result == 'undefined' && make_inverse == true) {
	
	
	
	                        if (jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g, "")).length <= 0) {
	                            get_item(item.link);
	                        }
	
	
	
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
	
	function get_settings() {
	
	    console.log("get_settings(): ");
	    Buleys.view.loaded = "account";
	    get_settings();
	
	    var session_id = get_local_storage("session_id");
	    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
	        jQuery("#main").append('<div id="account"><input id="password"  class="defaulttext" type="password" value="p4s5w0rd" name="password" /><br/><br/><a href="#" id="update_settings_button" class="update_settings">Update</a> or <a href="#" id="clear_form_button" class="clear_form">Clear</a></div></div></div>');
	    } else {
	        jQuery("#main").append("<div id='account'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
	    }
	
	    Buleys.view.loaded = "signin";
	
	
	
	}
	
	function get_signin() {
	    var session_id = get_local_storage("session_id");
	    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
	        jQuery("#main").append('<div id="login_prompt"><div id="login_form"><input id="email" type="text" value="your@email.here" name="email" class="defaulttext" /><br/><input id="password"  class="defaulttext" type="password" value="p4s5w0rd" name="password" /><br/><br/><a href="#" id="doregistration" class="registrationlink">Register</a> or <a href="#" id="dologinsubmit" class="submitloginform">Login</a></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a></div></div></div>');
	    } else {
	        jQuery("#main").append("<div id='login_prompt'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
	    }
	
	    Buleys.view.loaded = "signin";
	
	}
	
	function get_registration() {
	
	    console.log("get_registration(): ");
	
	}
	
	function get_confirmation() {
	
	    console.log("get_confirmation(): ");
	
	}	