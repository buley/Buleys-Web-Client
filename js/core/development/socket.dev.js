/** 
 * Socket.js
 **/

Buleys.socket = Buleys.socket = {};
Buleys.websocket = Buleys.websocket = {};

Buleys.socket = io.connect('http://api.buleys.com');

Buleys.socket.on('connect',function() {
	Buleys.websocket.login();
});

Buleys.socket.on('disconnect',function() {

});

Buleys.socket.on( 'authorized', function( data ) {
	//data= jQuery.parseJSON( data );
	console.log('PROFILE DATA', data );
});

Buleys.socket.on( 'data', function( response ) {

	console.log('DATA', response );
	//response = jQuery.parseJSON( response );
	console.log('JSON!!', response.type, response );

	if( 'news' === response.type ) {
		console.log( 'news!!', response.data );
		if( 'undefined' !== typeof response.data ) {
			console.log('adding item data', response.data);
			add_item_to_items_database( response.data );
		} else {
			console.log('undefined, yo', response);
			add_item_to_items_database( response );
		}
	} else if( 'tweet' === response.type ) {
		console.log( 'tweet', response.data.user, response.data.text );
		add_tweet_to_items_database( response.data );
	} 
	
});


Buleys.websocket.login = function ( ) {

	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'place_chicago', 'place_milwaukee', 'company_csco', 'company_jnpr', 'company_ebay', 'place_miami', 'place_los_angeles', 'place_hollywood', 'place_sacramento', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl', 'company_nflx', 'company_yhoo', 'company_aol', 'place_new_york', 'place_san_francisco', 'place_austin', 'place_nashville' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
};

