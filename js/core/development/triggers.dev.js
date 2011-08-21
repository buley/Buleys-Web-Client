$('body').bind('favorite', function ( event ) {

    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function ( i, item_to_mark ) {

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

$('body').bind('favorite', function ( event ) {

    event.preventDefault();
    if (!is_in_cursor_mode()) {
        $.each($('.selected'), function ( i, item_to_mark ) {

            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
            jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.favorite_status').children('div').removeClass('unfav_link');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('star_icon').addClass('empty_star_icon');
            jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g, "")).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
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
        remove_item_from_favorites_database($('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        post_feedback('unstar', $('.cursor > a').attr('href'), Buleys.view.slug, Buleys.view.type);
        send_to_console("<p>item removed from favorites</p>");
        setTimeout('fade_console_message()', 1000);
    }
});

