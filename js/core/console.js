function flash_console(a){send_to_console(a);jQuery("#console_wrapper").stop(true).animate({opacity:1},500);jQuery("#console_wrapper").stop(true).animate({opacity:0},500)}function send_text_to_console(a){jQuery("#console").html("").append("<p>"+a+"</p>")}function send_to_console(a){send_text_to_console(a);jQuery("#console_wrapper").stop(true).animate({opacity:1},500)}function fade_console_message(){jQuery("#console_wrapper").stop(true).animate({opacity:0},500)};