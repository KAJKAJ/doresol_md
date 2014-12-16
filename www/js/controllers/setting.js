'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('SettingCtrl', function($scope,ENV, Composite, $firebase, Util, $state, Memorial, User, Auth, $mdSidenav, $mdBottomSheet, $timeout){
  $scope.hostUrl = ENV.HOST;
  $scope.submitted = false;
  $scope.inProgress = false;

  $scope.fileUploading = false;
  $scope.fileAdded = false;

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

  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };

  $scope.showListBottomSheet = function($event) {
    $scope.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'templates/actionset-change-image.html',
      controller: 'SettingCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      $scope.alert = clickedItem.name + ' clicked!';
    });
  };

  var getFileUniqueId = function(file){
    return $scope.user.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getUniqueId();
  }

  $scope.changeProfileImage = function(type){
    var sourceType = null;

    switch(type){
      case 'CAMERA':
        sourceType = Camera.PictureSourceType.CAMERA;
      break;
      case 'GALLERY':
        sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
      break;
    }

    var options = {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        sourceType: sourceType,
        mediaType: Camera.MediaType.PICTURE,
        targetWidth: 1024,
        allowEdit : false,
    }
    
    navigator.camera.getPicture(
      function (imageURI) {
          // console.log(imageURI);
          upload(imageURI);
      },
      function (message) {
          // We typically get here because the use canceled the photo operation. Fail silently.
      }, options);

    // Upload image to server
    var upload = function (imageURI) {
      $timeout(function(){
        $scope.fileUploading = true;
        $scope.fileAdded = false;
        delete $scope.user.profile.file;
      });
      
      var ft = new FileTransfer();
      var options = new FileUploadOptions();

      options.fileKey = "file";

      console.log('---- image URI -----');
      console.log(imageURI);

      var fileName = getFileUniqueId() + imageURI.substr(imageURI.lastIndexOf('/') + 1).replace(/[^\.0-9a-zA-Z_-]/img, '') + '.jpg'; 
      options.fileName = fileName; 
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
      options.params = { 
        // Whatever you populate options.params with, will be available in req.body at the server-side.
        // "description": "Uploaded from my phone"
      };

      ft.upload(imageURI, $scope.hostUrl + "/api/fileuploadsfromapp",
        function (e) {
          $timeout(function(){
            console.log('upload success');
            $scope.user.profile.file = {
              type:'image',
              location:'local',
              url:'/tmp/' + fileName,
              updated_at:moment().toString()
            };
            console.log('------- profile file ------------');
            console.log($scope.user.profile.file);

            Composite.updateUserProfileWithFile($scope.user).then(function(){
              $scope.fileUploading = false;
              $scope.fileAdded = true;
              $scope.profileMessage = '성공적으로 변경되었습니다.';
            }, function(error) {
              $scope.fileUploading = false;
              $scope.fileAdded = true;
              $scope.profileMessage = '변경에 실패하였습니다.';
            });
          });
        },
        function (e) {
          alert("사진 저장 실패");
          $scope.fileUploading = false;
        }, options
      );
    }
  }

});