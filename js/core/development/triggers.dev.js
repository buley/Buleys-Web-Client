
    jQuery('body').bind('dologin', function (event) {
        event.preventDefault();
        $('#dologin').remove();
        $('#login_status_pane').append('<div id="minimize_login_controls"><a href="#" id="dologinboxminimize" class="loginboxminimizelink"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-in.png"></a></div><div id="login_form"><a href="#" id="doregistration" class="registrationlink">Register</a> or Login:<br/><input id="email" type="text" value="your@email.here" name="email" class="defaulttext" /><br/><input id="password"  class="defaulttext" type="password" value="p4s5w0rd" name="password" /></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a><br/><a href="#" id="dologinsubmit" class="submitloginform">Login</a></div></div>');
    });

    jQuery('body').bind('a#get_inbox', function (event) {
        event.preventDefault();

        $('#mini_inbox_box').html('<div id="mini_inbox_wrapper"><div id="minimize_mini_inbox_controls"><a href="#" id="minimize_inbox"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div><ul id="mini_inbox_list"><li>Loading...</li></ul></div>');
        add_topics_to_mini_inbox();

    });



    jQuery('body').bind('minimize_inbox', function (event) {
        event.preventDefault();
        if ($('#mini_inbox_box').hasClass('waiting_inbox')) {
            $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox-document.png"></a>');
        } else {
            $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox.png"></a>');
        }
    });


    jQuery('body').bind('dologinboxminimize', function (event) {
        event.preventDefault();

        $('#login_status_pane').html('<a href="#" id="dologin" class="getloginform"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-out.png"></a>');
    });


    jQuery('body').bind('show_commands', function (event) {
        event.preventDefault();

        $('#result_controls').show();
    });


    jQuery('body').bind('hide_commands', function (event) {
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
            } else if (Buleys.shortcuts.d_depressed) {
            
            } else if (Buleys.shortcuts.shift_depressed) {
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
        if (!Buleys.session.database_is_open) {
        
        } else {

            reload_results();




            Buleys.session.database_is_open = true;

        }

    });

    jQuery('body').bind('get_settings', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_settings clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = 'http://buleys.com/settings';
        console.log(history);
        history.pushState(stateObj, "settings", urlString);
        reload_results();
    });


    jQuery('body').bind('get_login', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("get_login clicked");

        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = "http://buleys.com/start";
        history.pushState(stateObj, "login", urlString);
        reload_results();
    });


    jQuery('body').bind('view_seen', function (event) {
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

    jQuery('body').bind('view_unseen', function (event) {
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

    jQuery('body').bind('view_read', function (event) {
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

    jQuery('body').bind('view_unread', function (event) {
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

    jQuery('body').bind('view_trash', function (event) {
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

    jQuery('body').bind('view_archive', function (event) {
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

    jQuery('body').bind('view_favorites', function (event) {
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

    jQuery('body').bind('view_index', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_index clicked");
        jQuery("#page_meta").html('');
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        history.pushState(stateObj, "view_index", "http://buleys.com/");
        reload_results();
    });
    jQuery('body').bind('view_home', function (event) {
        event.preventDefault();
        console.log(location.pathname);
        console.log("view_home clicked");
        jQuery("#page_meta").html('');
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
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

    jQuery('body').bind('dologinsubmit', function (event) {
        event.preventDefault();

        if ($('[name="password"]').val()) {

            request_login($('[name="email"]').val(), $('[name="password"]').val());
        } else {

        }
    });


    jQuery('body').bind('unfav_link', function (event) {

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

    jQuery('body').bind('favorite', function (event) {

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

    jQuery('body').bind('unfavorite', function (event) {
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



    jQuery('body').bind('fav_link', function (event) {
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


    jQuery('body').bind('close_item_preview', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });


    jQuery('body').bind('sidebar_close_link', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    jQuery('body').bind('close_all', function (event) {
        event.preventDefault();
        jQuery("#overlay").stop(true).animate({
            opacity: 0
        }, 500, function () {
            jQuery("#overlay").html('');
        });
    });

    jQuery('body').bind('mark_item_as_unread', function (event) {
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

    jQuery('body').bind('mark_all_items_as_read', function (event) {
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

    jQuery('body').bind('mark_seen', function (event) {
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

    jQuery('body').bind('mark_unseen', function (event) {
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

    jQuery('body').bind('select_all', function (event) {
        event.preventDefault();
        $.each($('#results > li'), function (i, item_to_mark) {
            if (jQuery(item_to_mark).hasClass('selected')) {} else {
                jQuery(item_to_mark).addClass('selected');
                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
            }
        });
    });
    jQuery('body').bind('select_none', function (event) {
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
    jQuery('body').bind('select_inverse', function (event) {
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

    jQuery('body').bind('select_favorites', function (event) {
        event.preventDefault();
        $.each($('.favorited'), function (i, item_to_mark) {
            if (jQuery(item_to_mark).hasClass('selected')) {

            } else {
                jQuery(item_to_mark).addClass('selected');

                jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));

            }
        });
    });

    jQuery('body').bind('deselect_seen', function (event) {
        event.preventDefault();
        $.each($('.seen'), function (i, item_to_mark) {


            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });
    jQuery('body').bind('deselect_unseen', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {


            jQuery(item_to_mark).removeClass('selected');

            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));

        });
    });
    jQuery('body').bind('deselect_favorites', function (event) {
        event.preventDefault();
        $.each($('.favorited'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_read', function (event) {
        event.preventDefault();
        $.each($('.read'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_unread', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_archived', function (event) {
        event.preventDefault();
        $.each($('.archived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_unarchived', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_unseen', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_unread', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });
    jQuery('body').bind('deselect_unarchived', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).removeClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')));
        });
    });


    jQuery('body').bind('select_seen', function (event) {
        event.preventDefault();
        $.each($('.seen'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    jQuery('body').bind('select_unseen', function (event) {
        event.preventDefault();
        $.each($('.unseen'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    jQuery('body').bind('select_read', function (event) {
        event.preventDefault();
        $.each($('.read'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    jQuery('body').bind('select_unread', function (event) {
        event.preventDefault();
        $.each($('.unread'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    jQuery('body').bind('select_archived', function (event) {
        event.preventDefault();
        $.each($('.archived'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });
    jQuery('body').bind('select_unarchived', function (event) {
        event.preventDefault();
        $.each($('.unarchived'), function (i, item_to_mark) {

            jQuery(item_to_mark).addClass('selected');
            jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected'));
        });
    });

    jQuery('body').bind('delete', function (event) {
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

    jQuery('body').bind('select', function (event) {
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

    jQuery('body').bind('deselect', function (event) {
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

    jQuery('body').bind('archive', function (event) {
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


    jQuery('body').bind('read', function (event) {
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



    jQuery('body').bind('unarchive', function (event) {
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



    jQuery('body').bind('mark_read', function (event) {
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

    jQuery('body').bind('mark_unread', function (event) {
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


    jQuery('body').bind('mark_all_items_as_unread', function (event) {
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






        jQuery('body').bind('defaulttext', function (event) {
            jQuery(this).val('');
            jQuery(this).removeClass('defaulttext');
        });



    });


/*
		jQuery("#overlay .vote_up_category").remove();    
			jQuery("#overlay .vote_down_category").remove();    
			jQuery("#overlay .delete_category").remove(); 
*/
    jQuery('body').bind('delete_category', function (event) {
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


    jQuery('body').bind('follow_topic', function (event) {
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
    jQuery('body').bind('unfollow_topic', function (event) {
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

    jQuery('body').bind('subscribe_topic', function (event) {
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

    jQuery('body').bind('unsubscribe_topic', function (event) {
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

    jQuery('body').bind('vote_up_category', function (event) {
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
    jQuery('body').bind('vote_down_category', function (event) {
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

    jQuery('body').bind('vote_up', function (event) {
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

    jQuery('body').bind('vote_down', function (event) {
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
        opacity: 0
    }, 0, function () {});

    jQuery("#overlay").stop(true).animate({
        opacity: 0
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


    jQuery('body').bind('headline a', function (event) {
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

        $.post("/feedback/index.php", data_to_send, dataType = "json", function (data) {
            new_window = window.open(uri_string, click_window);
        });
    });

    jQuery('body').bind('sidebar_headline a', function (event) {
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

        $.post("/feedback/index.php", data_to_send, dataType = "json", function (data) {
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

    jQuery('body').bind('preview_item', function (event) {

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


    jQuery('body').bind('close_item_preview', function (event) {
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


    jQuery('body').bind('results li', function (event) {

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

    });

    $('body').bind('selected', function (event) {
        $(this).removeClass('selected');
    });

    $("#results li").live('mouseleave', function (event) {
		/*
		jQuery("#overlay").stop(true).animate({
			opacity: 0
		}, 500, function() {
		} ).html('');
		*/
    });

    $('#show_button').live('click', function (e) {
        send_notification_to_desktop();
    });