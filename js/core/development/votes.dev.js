
	
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

	
	