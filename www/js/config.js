'use strict';

 angular.module("env", [])

.constant("GOOGLE_API_URI", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAR3-1YSkP2LM-HuJshMivhOZuai9L5htM")

.constant("ENV", {
	"FIREBASE_URI": "https://doresol-beta.firebaseio.com/",
	"HOST": "http://doresol.net",
	"MEMORIAL_KEY": "-JWg83I6imBHVjgQs87P",
	"APP_VERSION": {
		"MAJOR": 1,
		"MINOR": 0,
		"DETAIL": 2
	}
})

;