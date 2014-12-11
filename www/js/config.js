'use strict';

 angular.module("env", [])

.constant("GOOGLE_API_URI", "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyAR3-1YSkP2LM-HuJshMivhOZuai9L5htM")

.constant("ENV", {
	"FIREBASE_URI": "https://doresol-dev.firebaseio.com/",
	"HOST": "http://doresol.net:8000",
	"MEMORIAL_KEY": "-J_yaUS2gsgyLbDtgzQA"
})

;