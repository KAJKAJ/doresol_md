'use strict';

angular
.module('doresolApp')
.controller('MainCtrl', function($rootScope, $scope, Memorial, ENV, Story, MyStory, Letter, CordovaService){

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
    alert('cordova is ready');
  });

});