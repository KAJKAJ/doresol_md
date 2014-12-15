'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('ProfileCtrl', function($scope,ENV,$firebase, Memorial, User, $mdSidenav){
  $scope.hostUrl = ENV.HOST;

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();

  $scope.copyMemorial = {};
  $scope.role = Memorial.getRole();

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };
    
});