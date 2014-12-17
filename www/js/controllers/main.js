'use strict';

angular
.module('doresolApp')
.controller('MainCtrl', function($rootScope, $scope, Memorial, ENV, Story, MyStory, Letter, CordovaService, $firebase, $mdDialog){

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
    var appURLEndPoint = ENV.FIREBASE_URI + '/memorials/' + ENV.MEMORIAL_KEY + '/market_url/';

    if(platform === 'Android' || platform === 'android'){
      appVersionEndPoint += 'android';
      appURLEndPoint += 'android';
    }else if(platform === 'iOS' || platform === 'ios'){
      appVersionEndPoint += 'ios';
      appURLEndPoint += 'ios';
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
      var update = false;
      if(ENV.APP_VERSION.MAJOR < value.major){
        update = true;
      }else if(ENV.APP_VERSION.MAJOR == value.major && ENV.APP_VERSION.MINOR < value.minor){
        update = true;
      }else if(ENV.APP_VERSION.MAJOR == value.major && ENV.APP_VERSION.MINOR == value.minor && ENV.APP_VERSION.DETAIL < value.detail){
        update = true;
      }

      // alert(update);
      if(update){
        var confirm = $mdDialog.confirm()
          .title('업데이트')
          .content('최신버전이 있습니다. 최신버전을 이용하시지 않을 경우에는 기능에 제한이 있을 수 있습니다. 업데이트 하시겠습니까?')
          .ok('업데이트')
          .cancel('취소');

        $mdDialog.show(confirm).then(function() {
          var appURLRef = new Firebase(appURLEndPoint);
          var appURL = $firebase(appURLRef).$asObject();
          appURL.$loaded().then(function(value){
            if(value.$value){
              window.open(value.$value, '_system');  
            }else{
              alert("마켓 등록 대기 중입니다.");
            }
          });
        }, function() {
          // $scope.alert = 'You decided to keep your debt.';
        });
      }
    });
  });

});