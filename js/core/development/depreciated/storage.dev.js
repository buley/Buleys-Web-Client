
function set_local_storage( set_key, set_value ) {
	jQuery(document).trigger('set_local_storage');
	console.log('set_local_storage', set_key, set_value );
	return Buleys.store.setItem(set_key, set_value);
}
	
function delete_local_storage( key ) {
	jQuery(document).trigger('delete_local_storage');

	return Buleys.store.removeItem( key );
}
	
function get_local_storage( get_key ) {
	jQuery(document).trigger('get_local_storage');

	return Buleys.store.getItem(get_key);
}

function set_local_storage_batch( dictionary ) {
	for( item in dictionary ) {
		//console.log('item', item);
		//console.log('dict', dictionary);
		if( dictionary.hasOwnProperty( item ) ) {	
			//console.log('setting item', item, dictionary[item] );
			set_local_storage( item, dictionary[ item ] );
		}
	}
}

function delete_local_storage_batch( keys ) {
	for( var i = 0; i <= keys.length; i++ ) {
		console.log('deleting', keys[i] );
		delete_local_storage( keys[ i ] );
	}
}
