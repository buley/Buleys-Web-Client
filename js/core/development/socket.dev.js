Buleys.socket = Buleys.socket || {};
Buleys.websocket = Buleys.websocket || {};

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


Buleys.websocket.cache = {};

Buleys.socket.on( 'data', function( response ) {
	
	if( response == Buleys.websocket.cache ) {
		return;
	} else {
		Buleys.websocket.cache = response;
	}
	
	response = JSON.parse( response );
//	console.log('DATA type', response.type );

	if( 'tweet' === response.type || 'news' === response.type ) {

		var on_success = function( activity_id ) {
			console.log( 'Buleys.socket.on data success', activity_id );
		};
	
		var on_error = function( error ) {
			console.log( 'Buleys.socket.on data error', error );
		};

		Buleys.activity.add( response.data, on_success, on_error );
	} 
	
} );


Buleys.websocket.login = function() {

	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'place_chicago', 'place_milwaukee', 'company_csco', 'company_jnpr', 'company_ebay', 'place_miami', 'place_los_angeles', 'place_hollywood', 'place_sacramento', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl', 'company_nflx', 'company_yhoo', 'company_aol', 'place_new_york', 'place_san_francisco', 'place_austin', 'place_nashville' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
};
