'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('SettingCtrl', function($scope,ENV,$firebase, $state, Memorial, User, Auth, $mdSidenav, $mdBottomSheet, $timeout){
  $scope.hostUrl = ENV.HOST;
  $scope.submitted = false;
  $scope.inProgress = false;

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();

  $scope.copyMemorial = {};
  $scope.role = Memorial.getRole();

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

	$scope.password = {};
  $scope.changePassword = function(form) {
    $scope.inProgress = true;
    $scope.submitted = true;
    if(form.$valid) {
      Auth.changePassword($scope.user.email,$scope.user.old_password,$scope.user.new_password)
      .then( function() {
        $scope.inProgress = false;
        $scope.message = '성공적으로 변경되었습니다.';
      })
      .catch( function(error) {
        $scope.inProgress = false;
        form.old_password.$setValidity('firebase', false);
        form.new_password.$setValidity('firebase', false);
        switch (error.code) {
		      case "INVALID_PASSWORD":
		        $scope.message = "입력하신 기존 비밀번호가 잘못되었습니다.";
		        console.log("The specified user account password is incorrect.");
		        break;
		      case "INVALID_USER":
		      	$scope.message = "존재하지 않는 사용자입니다.";
		        console.log("The specified user account does not exist.");
		        break;
		      default:
		      	$scope.message = "비밀번호 변경에 실패하였습니다.";
		        console.log("변경에 실패하였습니다.", error);
		    }
      })
    }
	}

	$scope.changeProfile = function(form){
    $scope.inProgress = true;
		$scope.submitted = true;
	  if(form.$valid){
      User.update($scope.user.uid,{profile:$scope.user.profile}).then(function(){
        $scope.inProgress = false;
        $scope.message = '성공적으로 변경되었습니다.';
      })
      .catch( function(error) {
        $scope.inProgress = false;
        form.name.$setValidity('firebase', false);
        $scope.message = "이름 변경에 실패하였습니다.";
        console.log("변경에 실패하였습니다.", error);
      })
	  };
  }

  $scope.logout = function() {
    Auth.logout();
    $state.go('intro');
  }

  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'templates/bottom-sheet-list-template.html',
      controller: 'ListBottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };

});