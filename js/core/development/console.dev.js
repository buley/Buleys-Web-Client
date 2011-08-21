function flash_console( message ) {
	jQuery(document).trigger('flash_console');

    send_to_console(message);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 1
    }, 500);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0
    }, 500);
}

function send_text_to_console( text_to_send ) {
	jQuery(document).trigger('send_text_to_console');

    jQuery("#console").html('').append("<p>" + text_to_send + "</p>");
}

function send_to_console( text_to_send ) {
	jQuery(document).trigger('send_to_console');

    send_text_to_console(text_to_send);
    jQuery("#console_wrapper").stop(true).animate({
        opacity: 1
    }, 500);
}

function fade_console_message(  ) {
	jQuery(document).trigger('fade_console_message');

    jQuery("#console_wrapper").stop(true).animate({
        opacity: 0
    }, 500);
}
