Buleys.socket = io.connect('http://api.buleys.com');

Buleys.socket.on('connect',function() {
	socket_login();
});

Buleys.socket.on('disconnect',function() {

});

Buleys.socket.on( 'authorized', function( data ) {
	//data= jQuery.parseJSON( data );
	console.log('PROFILE DATA', data );
});


Buleys.socket.on( 'data', function( activity ) {
	console.log('DATA', activity );
	activity = jQuery.parseJON( activity );
	console.log('JSON!!', activity.verb, activity );
	if( 'publish' === activity.verb || 'tweet' === activity.verb ) {
		console.log( 'new ' + activity.verb + '!', activity );
		Buleys.activity.add( activity.data );
	} 
	
});


function socket_login() {
	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'place_chicago', 'place_milwaukee', 'company_csco', 'company_jnpr', 'company_ebay', 'place_miami', 'place_los_angeles', 'place_hollywood', 'place_sacramento', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl', 'company_nflx', 'company_yhoo', 'company_aol', 'place_new_york', 'place_san_francisco', 'place_austin', 'place_nashville' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
}
