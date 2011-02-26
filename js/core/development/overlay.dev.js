function send_text_to_overlay(text_to_send) {
    jQuery("#overlay").html('').append(text_to_send);
}

function send_to_overlay(text) {
    send_text_to_overlay(text);
    jQuery("#overlay").stop(true).animate({
        opacity: 1
    }, 500);
}
function hide_overlay() {
    jQuery("#overlay").stop(true).animate({
        opacity: 0
    }, 500);
    jQuery("#overlay").html('').removeClass();
}
	
function load_item_to_overlay(item_key) {
    get_item_for_overlay(item_key);
    check_if_item_is_favorited_for_overlay(item_key);
    check_item_vote_status_for_overlay(item_key);
    get_item_categories_for_overlay(item_key);
}