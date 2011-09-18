	//	Buleys.settings = {};
	//  ^ declared in loader.js
	
	function new_settings_transaction(  ) {
	jQuery(document).trigger('new_settings_transaction');

	    try {
	        var transaction = Buleys.db.transaction(["settings"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function ( e ) {

	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function ( e ) {

	        };
	        Buleys.objectStore = transaction.objectStore("settings");
	    } catch (e) {
	        var request = Buleys.db.setVersion( parseInt(Buleys.version) );
	        request.onsuccess = function ( e ) {

	            Buleys.objectStore = Buleys.db.createObjectStore("settings", {
	                "keyPath": "option_name"
	            }, true);
	            Buleys.objectStore.createIndex("option_value", "option_value", {
	                unique: false
	            });
	        };
	        request.onerror = function ( e ) {

	        };
	    };
	}
	
		
	function get_settings(  ) {
	jQuery(document).trigger('get_settings');

	
	    console.log("get_settings(): ");
	    Buleys.view.loaded = "settings";
	    get_settings();
	
	    var session_id = get_local_storage("session_id");
	    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
	        jQuery("#main").append('<div id="account"><input id="password" type="password" value="p4s5w0rd" name="password" /><br/><br/><a href="#" id="update_settings_button" class="update_settings">Update</a> or <a href="#" id="clear_form_button" class="clear_form">Clear</a></div></div></div>');
	    } else {
	        jQuery("#main").append("<div id='account'>Already logged in with session id <code>" + session_id + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
	    }
		
		 jQuery("#main").append('<input type="number" min="0" max="10" step="2" value="6"> <input type="number" min="0" max="10" step="2" value="6">');
		 
	
	}
	
	function get_settings_old(  ) {
	jQuery(document).trigger('get_settings_old');

	
	    try {
	
	        new_settings_transaction();
	        Buleys.index = Buleys.objectStore.index("option_name");
	
	        var cursorRequest = Buleys.index.openCursor();
	        cursorRequest.onsuccess = function ( event ) {

	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }

	            if (objectCursor.length >= 0) {
	                Buleys.view.type = "settings";
	                jQuery.each(objectCursor, function ( k, item ) {

	                    console.log("get_settings(): " + item);
	                });
	            }
	
	        };
	        request.onerror = function ( event ) {

	
	        };
	
	    } catch (e) {
	
	
	    }
	
	
	}
	
	
		
	function save_settings(  ) {
	jQuery(document).trigger('save_settings');

	
	    add_or_update_setting("hotkeys", Buleys.settings);
//	    add_or_update_setting("profile", Buleys.profile);
	
	}


	
	function load_settings_into_dom(  ) {
	jQuery(document).trigger('load_settings_into_dom');

	
	    new_settings_transaction();
	
	    Buleys.index = Buleys.objectStore.index();
	
	
	    var cursorRequest = Buleys.objectStore.openCursor();
	    cursorRequest.onsuccess = function ( event ) {

	
	        new_settings_transaction();
	
	        var objectCursor = cursorRequest.result;
	        if (!objectCursor) {
	
	            return;
	        }
	
	
	
	
	        if (objectCursor.length >= 0) {
	            jQuery.each(objectCursor, function ( k, item ) {

	
	                Buleys.settings[k] = item;
	
	            });
	        }
	
	    };
	    request.onerror = function ( event ) {

	
	    };
	
	
	}
	

	
	function remove_setting( option_name ) {
	jQuery(document).trigger('remove_setting');

	
	    new_settings_transaction();
	
	    var request = Buleys.objectStore["delete"](option_name);
	    request.onsuccess = function ( event ) {

	
	        delete Buleys.objectId;
	    };
	    request.onerror = function (  ) {

	
	    };
	}
	
	function load_all_settings_into_dom(  ) {
	jQuery(document).trigger('load_all_settings_into_dom');

	
	    new_settings_transaction();
	
	
	    var item_request = Buleys.objectStore.openCursor();
	
	    item_request.onsuccess = function ( event ) {

	        if (typeof item_request.result !== 'undefined') {
	
	
	            if (item_request.result.length >= 0) {
	                jQuery.each(item_request.result, function ( k, item ) {

	
	                    Buleys.settings[item.option_name] = item.option_value;
	
	                });
	            }
	
	        } else {
	
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_or_update_setting( option_name, option_value ) {
	jQuery(document).trigger('add_or_update_setting');

	
	    new_settings_transaction();
	    if (typeof option_value == 'undefined') {
	        option_value = '';
	    }
	
	    var item_request = Buleys.objectStore.get(option_name);
	
	    item_request.onsuccess = function ( event ) {

	
	
	
	        if (typeof item_request.result == 'undefined') {
	
	            add_setting_to_settings_database(option_name, option_value);
	        } else {
	
	            update_setting_in_settings_database(option_name, option_value);
	        }
	    };
	
	    item_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function add_setting_to_settings_database( option_name, option_value ) {
	jQuery(document).trigger('add_setting_to_settings_database');

	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.add(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
	function update_setting_in_settings_database( option_name, option_value ) {
	jQuery(document).trigger('update_setting_in_settings_database');

	
	
	    new_settings_transaction();
	
	    var data = {
	        "option_name": option_name,
	        "option_value": option_value,
	        "modified": new Date().getTime()
	    };
	
	
	    var add_data_request = Buleys.objectStore.put(data);
	    add_data_request.onsuccess = function ( event ) {

	
	        Buleys.objectId = add_data_request.result;
	    };
	    add_data_request.onerror = function ( e ) {

	
	
	    };
	
	}
	
function get_settings_page(  ) {
	jQuery(document).trigger('get_settings_page');

    var session_id = get_local_storage("session_id");
    if( typeof session_id === "undefined" || session_id === null ) {
    	jQuery("#main").append("<div od='login_prompt'>Logged in with session id <code>" +  + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");
    } else {
    	jQuery("#main").append("<div id='configuration_panel'><h3>Configuration</h3><p><input type='range' min='0' max='10' step='2' value='6'></p><p><input type='number' min='0' max='10' step='2' value='6'></p></div>");
    }

}

function get_setting_type( setting_to_get ) {
	jQuery(document).trigger('get_setting_type');

    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting_type( setting_to_set, setting_value ) {
	jQuery(document).trigger('set_setting_type');

    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}

function get_setting( setting_to_get ) {
	jQuery(document).trigger('get_setting');

    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting( setting_to_set, setting_value ) {
	jQuery(document).trigger('set_setting');

    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}



    $('.get_settings').live('click', function ( event ) {

        event.preventDefault();
        console.log(location.pathname);
        console.log("view_settings clicked")
        var stateObj = {
            "page": Buleys.view.page,
            "slug": Buleys.view.slug,
            "type": Buleys.view.type,
            "time": new Date().getTime()
        };
        var urlString = 'http://www.buleys.com/settings';
        console.log(history);
        history.pushState(stateObj, "settings", urlString);
        reload_results();
    });
