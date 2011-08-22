
	function set_local_storage( set_key, set_value ) {
	jQuery(document).trigger('set_local_storage');

	    return Buleys.store.setItem(set_key, set_value);
	}
	
	function get_local_storage( get_key ) {
	jQuery(document).trigger('get_local_storage');

	    return Buleys.store.getItem(get_key);
	}
