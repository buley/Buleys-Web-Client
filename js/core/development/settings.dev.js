
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
	
	function get_settings_old() {
	
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
	                Buleys.view.type = "settings";
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
	
	
		
	function save_settings() {
	
	    add_or_update_setting("profile", Buleys.profile);
	
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
	
	function get_settings_page() {
    console.log("get_settings_page()");
    jQuery("#main").append("<div od='login_prompt'>Logged in with session id <code>" + get_local_storage("session_id") + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");

}

function get_setting_type(setting_to_get) {
    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting_type(setting_to_set, setting_value) {
    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}

function get_setting(setting_to_get) {
    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting(setting_to_set, setting_value) {
    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}

