'use strict';

angular
.module('doresolApp')
.controller('MainCtrl', function($rootScope, $scope, Memorial, ENV, Story, MyStory, Letter, CordovaService, $firebase){

  // // User agent displayed in home page
  // $scope.userAgent = navigator.userAgent;
  
  // // Needed for the loading screen
  // $rootScope.$on('$routeChangeStart', function(){
  //   $rootScope.loading = true;
  // });

  // $rootScope.$on('$routeChangeSuccess', function(){
  //   $rootScope.loading = false;
  // });

  Memorial.setCurrentMemorial(ENV.MEMORIAL_KEY);
  $scope.memorial = Memorial.getCurrentMemorial();

  // console.log($scope.memorial);
  
  CordovaService.ready.then(function() {
    // Cordova is ready
    var platform = device.platform;
    var appVersionEndPoint = ENV.FIREBASE_URI + '/memorials/' + ENV.MEMORIAL_KEY + '/app_version/';

    if(platform === 'Android' || platform === 'android'){
      appVersionEndPoint += 'android';
    }else if(platform === 'iOS' || platform === 'ios'){
      appVersionEndPoint += 'ios';
    }

    var appVersionRef = new Firebase(appVersionEndPoint);

    var appVersion = $firebase(appVersionRef).$asObject();
    appVersion.$loaded().then(function(value){
      //not exist
      if(!value.major){
        $firebase(appVersionRef).$set('major', ENV.APP_VERSION.MAJOR);
        $firebase(appVersionRef).$set('minor', ENV.APP_VERSION.MINOR);
        $firebase(appVersionRef).$set('detail', ENV.APP_VERSION.DETAIL);
      }

      //update if this is new version
      if(ENV.APP_VERSION.MAJOR > value.major){
        $firebase(appVersionRef).$set('major', ENV.APP_VERSION.MAJOR);
        $firebase(appVersionRef).$set('minor', ENV.APP_VERSION.MINOR);
        $firebase(appVersionRef).$set('detail', ENV.APP_VERSION.DETAIL);
      }else if(ENV.APP_VERSION.MAJOR == value.major && ENV.APP_VERSION.MINOR > value.minor){
        $firebase(appVersionRef).$set('minor', ENV.APP_VERSION.MINOR);
        $firebase(appVersionRef).$set('detail', ENV.APP_VERSION.DETAIL);
      }else if(ENV.APP_VERSION.MAJOR == value.major && ENV.APP_VERSION.MINOR == value.minor && ENV.APP_VERSION.DETAIL > value.detail){
        $firebase(appVersionRef).$set('detail', ENV.APP_VERSION.DETAIL);
      }

      //check if this version is old

  });

  

  });

  // if(!$scope.memorial.app_version){
  //   console.log('he');
  // }
  // console.log(appVersionRef);

  // console.log($scope.memorial);
});