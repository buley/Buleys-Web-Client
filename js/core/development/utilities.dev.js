Buleys.utilities = Buleys.utilities || {};

Buleys.utilities.random = function( length, type ) {
	var set;
	if( 'numbers' !== type ) {
		set += 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	} 
	if( 'letters' !== type ) {
		set += '0123456789';
	} 
	var random = '';
	for ( var i=0; i < length; i++ ) {
		var random_pos = Math.floor( Math.random() * set.length );
		random += random.substring( random_pos, random_pos + 1 );
	}
	return random;
}


