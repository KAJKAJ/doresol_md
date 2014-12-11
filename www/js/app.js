// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('doresolApp', ['ngMaterial','ui.router', 'firebase', 'env'])

.run(function($location,  $rootScope, $state, Auth, User ,Composite) {

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    console.log(event);
    console.log(toState);
    var _getUserAuth = function(){
      return Auth.getCurrentUserFromFirebase().then(function(value){
        return value.uid;
      });
    };

    var _getUserData = function(userId){
      return User.getCurrentUserFromFirebase(userId).then(function(value){
        return value.uid;
      });
    };

    // 인증해야 되는 경우
    // if (toState.authenticate){
    //   // 사용자가 계정이 없을 때
    //   if(!User.getCurrentUser()){
    //     event.preventDefault();
    //     _getUserAuth().then(_getUserData).then(Composite.setMyMemorials).then(function(value){
    //       $state.go(toState, toParams);
    //     },function(error){
    //       $state.go('intro');
    //     });
    //   }
    // }
  });

});


