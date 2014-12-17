'use strict';

angular.module('doresolApp')
  .controller('SideMenuLeftCtrl', function ($scope, $location, User, Auth, Composite) {
   
    $scope.user = User.getCurrentUser();
    
    $scope.logout = function() {
      // console.log('logout');
      Auth.logout();
      $scope.user = null;
      User.setCurrentUser();
      $location.path('/intro');
    }

    $scope.isActive = function(route) {
      // console.log('isactive');
      var location = $location.path();
      if(location.indexOf(route) > -1) return true;
      else return false;
    }
  });