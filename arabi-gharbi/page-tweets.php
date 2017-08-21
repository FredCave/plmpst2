<?php 

require_once('includes/twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '4082019742-mIjxEpCunZWz8kAjj105VW1nczmhbGcvMZcoogK';
$oauth_access_token_secret = 'mC1yutDo5ZZB0ySH9550R1wIwi67NnGozrppI0H4uNVAl';
$consumer_key = 'ZF4lTM9iwZBz2WNPVf77JJOtA';
$consumer_secret = 'HGgHpmRTEE9m1EbhGzgvk1mHkd3pyEZsWDD58ZAY3CR69zTDna';
$user_id = '897454442529914881';
$screen_name = 'WesternArab';
$count = 50;
$twitter_url = 'statuses/user_timeline.json';
$twitter_url .= '?user_id=' . $user_id;
$twitter_url .= '&screen_name=' . $screen_name;
$twitter_url .= '&count=' . $count;

// Create a Twitter Proxy object from our twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
	$oauth_access_token,			// 'Access token' on https://apps.twitter.com
	$oauth_access_token_secret,		// 'Access token secret' on https://apps.twitter.com
	$consumer_key,					// 'API key' on https://apps.twitter.com
	$consumer_secret,				// 'API secret' on https://apps.twitter.com
	$user_id,						// User id (http://gettwitterid.com/)
	$screen_name,					// Twitter handle
	$count							// The number of tweets to pull out
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);
echo $tweets;

?>