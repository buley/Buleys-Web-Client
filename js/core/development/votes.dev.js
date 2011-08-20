function new_votes_transaction() {
    try {
        var transaction = Buleys.db.transaction(["votes"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
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

function check_item_vote_status_for_overlay(item_url) {
    new_votes_transaction();
    var item_request = Buleys.objectStore.get(item_url.replace(/[^a-zA-Z0-9-_]+/g, ""));
    item_request.onsuccess = function (event) {
        checker = item_request;
        if (typeof event.target.result !== 'undefined') {
            if (event.target.result.vote_value == -1) {
                jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down vote thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
            } else if (event.target.result.vote_value == 1) {
                jQuery("#overlay_left").prepend('<div class="vote_context voted"><div class="vote_up vote thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
            } else {
                jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
            }
            jQuery("#overlay_left").parent().addClass('voted');
        } else {
            jQuery("#overlay_left").prepend('<div class="vote_context"><div class="vote_up empty_thumb_up_icon" alt="' + Buleys.view.slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '"></div><div href="#" class="vote_down empty_thumb_icon" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + '" link="' + item_url + '" alt="' + Buleys.view.slug + '" ></div></div>');
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
        var cursorRequest = Buleys.index.openCursor();
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

    $('.vote_up').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g, "");
        var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g, "");
        if (jQuery("#overlay_upvote_" + the_url_slug).hasClass('vote')) {

            jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');
            $('.vote').removeClass('vote');
            $(this).parent().removeClass('voted');
            post_feedback('item_remove_upvote', the_url, Buleys.view.type, Buleys.view.slug);
            remove_vote(the_url);

        } else {

            jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');
            jQuery("#overlay_upvote_" + the_url_slug).removeClass('empty_thumb_up_icon').addClass('thumb_up_icon');
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

            jQuery("#overlay_downvote_" + the_url_slug).removeClass('thumb_icon').addClass('empty_thumb_icon');

            $('.vote').removeClass('vote');
            $(this).parent().removeClass('voted');

            post_feedback('item_remove_downvote', the_url, Buleys.view.type, Buleys.view.slug);
            remove_vote(the_url);

        } else {

            jQuery("#overlay_downvote_" + the_url_slug).removeClass('empty_thumb_icon').addClass('thumb_icon');
            jQuery("#overlay_upvote_" + the_url_slug).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');

            $('.vote').removeClass('vote');
            $(this).parent().addClass('voted');
            $(this).addClass('vote');

            post_feedback('item_downvote', the_url, Buleys.view.type, Buleys.view.slug);
            add_or_update_vote(the_url, -1);

        }

    });
