	
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
	
	function show_loading() {
	
	    $("#index").html("<div class='loading'>&nbsp;</div>");
	
	}
	
	function hide_loading() {
	
	    $("#index .loading").hide();
	
	}
	
	
	
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
		
	function clear_page() {
	    jQuery("#right").html("<ul id='results'></ul>");
	    jQuery("#main").html('');
	}

	function load_current_page() {

	    set_page_vars();
	    
        //fire_off_request();

        if (Buleys.view.type == "account") {
            load_profile_info();
        }

        if (Buleys.view.type !== "account" && Buleys.view.type !== "home" && Buleys.view.type !== "signin" && Buleys.view.type !== "" && Buleys.view.type !== "start" && Buleys.view.type !== "settings" && Buleys.view.type !== "favorites" && Buleys.view.type !== "read" && Buleys.view.type !== "unread" && Buleys.view.type !== "seen" && Buleys.view.type !== "unseen" && Buleys.view.type !== "unarchived" && Buleys.view.type !== "archived") {
            get_page_follow_status(Buleys.view.type, Buleys.view.key);
            get_page_subscription_status(Buleys.view.type, Buleys.view.key);
            get_page_topic_info(Buleys.view.type, Buleys.view.key);
        }

        check_login_status();
            
	
	    if (Buleys.view.type == "settings" || Buleys.view.type == "account") {
	
	
			//alert('get_settings_page');
	        get_settings_page();
	
	    } else if (Buleys.view.type == "signin" || "signin" == Buleys.view.type || "start" == Buleys.view.type) {
	
	
	        if (Buleys.view.loaded != "signin") {
				//alert('get_signin');
	            get_signin();
	        }
	
	    } else if (Buleys.view.type == "register") {
	
	
			//alert('get_registration');
	        get_registration();
	
	    } else if (Buleys.view.type == "confirm") {
	
	
			//alert('get_confirmation');
	        get_confirmation();
	
	    } else if (Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs") {
	
	
			//alert('get_favorites');
	        get_favorites(Buleys.view.type, Buleys.view.slug);
	
	    } else if (Buleys.view.type == "archive" || Buleys.view.page == "archive" || Buleys.view.page == "archived") {
	
			//alert('get_archived');
	        get_archived(Buleys.view.type, Buleys.view.slug);
	
	    } else if (Buleys.view.type == "trash" || Buleys.view.page == "trash" || Buleys.view.page == "trashed" || Buleys.view.page == "deleted") {
			//alert('get_deleted');
	        get_deleted(Buleys.view.type, Buleys.view.slug);
	    } else if (Buleys.view.type == "read" || Buleys.view.page == "read") {
			//alert('get_read');
	        get_read(Buleys.view.type, Buleys.view.slug, null, null, false);
	    } else if (Buleys.view.type == "unread" || Buleys.view.page == "unread") {
			//alert('get_read');
	        get_read(Buleys.view.type, Buleys.view.slug, null, null, true);
	    } else if (Buleys.view.type == "seen" || Buleys.view.page == "seen") {
			//alert('get_seen');
	        get_seen(Buleys.view.type, Buleys.view.slug, null, null, false);
	    } else if (Buleys.view.type == "unseen" || Buleys.view.page == "unseen") {
			//alert('get_seen');
	        get_seen(Buleys.view.type, Buleys.view.slug, null, null, true);
	    } else if (typeof Buleys.view.page == "undefined" || Buleys.view.page == "" || Buleys.view.page == "home" || Buleys.view.page == "index") {
	        get_items(Buleys.view.type, Buleys.view.slug);
	    } else {
			//alert('get_items');
	        get_items(Buleys.view.type, Buleys.view.slug);
	    }
	
	    Buleys.view.loaded = Buleys.view.type;
	    

            
	
	}
	
	function reload_results() {
	
	    clear_page();
	
	    load_current_page();
	}

	function set_page_vars() {
	
	    console.log("Setting page vars: ", location.pathname);
	
	    var string_for_split = location.pathname;
	    string_for_split = string_for_split.replace(/^\//, "");
	    string_for_split = string_for_split.replace(/\/$/, "");
	
	    var splitted = string_for_split.split("/");
	    Buleys.view.type = splitted[0];
	    Buleys.view.slug = splitted[1];
	    Buleys.view.page = splitted[2];
	
	}


