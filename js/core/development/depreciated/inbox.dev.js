function add_topics_to_mini_inbox(  ) {
	jQuery(document).trigger('add_topics_to_mini_inbox');

    jQuery("#mini_inbox_list").html('');
    var item_count = 0;
    if (getKeys(Buleys.queues.new_items) > 0) {
        $.each(Buleys.queues.new_items, function ( topic_id, count ) {

            if (item_count <= Buleys.settings.mini_inbox_topic_count) {
                add_topic_to_mini_inbox(topic_id, count);
                item_count++;
            }
        });
    } else {
        jQuery("#mini_inbox_list").html('<li>No new items</li>');
    }
}

function add_topic_to_mini_inbox( topic_id, count ) {
	jQuery(document).trigger('add_topic_to_mini_inbox');

    new_topics_transaction();
    var item_request = Buleys.objectStore.get(topic_id);
    item_request.onsuccess = function ( event ) {

        if (typeof item_request.result == 'undefined' || item_request.result == "") {
            var split_string = topic_id.split("_", 1);
            var type_to_get = split_string[0];
            var company_to_get = topic_id.replace((split_string[0] + "_"), "");
            jQuery("#mini_inbox_list").append("<li><a href='/" + type_to_get + "/" + company_to_get + "' class='topic_name'>" + topic_id + "</a> (" + count + ")</li>");
        } else {
            if (typeof item_request.result.name != 'undefined') {
                jQuery("#mini_inbox_list").append("<li><a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a> (" + count + ")</li>");
            }
        }
    };
    item_request.onerror = function ( e ) {

    };
}

$(document).bind('get_inbox', function ( event ) {

    event.preventDefault();
    $('#mini_inbox_box').html('<div id="mini_inbox_wrapper" class="service_box_wrapper"><div class="cross_icon" id="minimize_mini_inbox_controls"></div><ul id="mini_inbox_list"><li>Loading...</li></ul></div>');
    add_topics_to_mini_inbox();

});

$(document).bind('minimize_mini_inbox_controls', function ( event ) {

    event.preventDefault();
    if ($('#mini_inbox_box').hasClass('waiting_inbox')) {
        $('#mini_inbox_box').html('<div class="getinbox empty_inbox big_inbox_document_icon" id="get_inbox"></div>');
    } else {
        $('#mini_inbox_box').html('<div class="getinbox empty_inbox big_inbox_icon" id="get_inbox"></div>');
    }
});
