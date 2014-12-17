'use strict';

angular
.module('doresolApp')
.controller('LoginCtrl', function ($scope, Auth, User, $window,$state,Memorial,Composite, ENV) {
    $scope.loginUser = {};
    $scope.signupUser = {};
    $scope.passwd = {};

    $scope.inProgress = false;

    //set current memorial
    // Memorial.setCurrentMemorial(ENV.MEMORIAL_KEY);

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider).then(function(value){
        _afterLogin(value.uid);
      });
    }

    var _afterLogin = function(userId){
      // console.log(userId);
      // Memorial.clearMyMemorial();
      // //set current memorial
      // Memorial.setCurrentMemorial(ENV.MEMORIAL_KEY);
      Memorial.setRoleForMemorial();
      $state.go("story");
    }

    var _login = function(){
      // console.log('email login clicked');
      Auth.login({
          email: $scope.loginUser.email,
          password: $scope.loginUser.password
        })
        .then( function (value){
          $scope.inProgress = false;
          _afterLogin(value.uid);
        } ,function(error){
          $scope.inProgress = false;
          var errorCode = error.code;
          switch(errorCode){
            case "INVALID_EMAIL":
            case "INVALID_USER":
              $scope.loginErrors = "등록되어있지 않은 이메일 주소입니다.";
            break;
            case "INVALID_PASSWORD":
              $scope.loginErrors = "잘못된 패스워드입니다.";
            break;
          }
          // console.log($scope.loginErrors);
        });  
    }

    $scope.login = function(form) {
      $scope.loginErrors = '';
      $scope.inProgress = true;
      _login();
    }

    $scope.signup = function(form) {
      $scope.signupErrors = '';
      $scope.inProgress = true;

      if(form.$valid) {
        Auth.register($scope.signupUser).then(function (value){
          $scope.inProgress = false;
          User.setCurrentUser();
          User.getCurrentUserFromFirebase(value.uid).then(function(userData){
            _afterLogin(userData.uid);
          });
        }, function(error){
          $scope.inProgress = false;
          var errorCode = error.code;
          console.log(errorCode);

          switch(errorCode){
            case "EMAIL_TAKEN":
              $scope.signupErrors = '이미 등록된 이메일 주소입니다.';
              break;
            case "INVALID_EMAIL":
              $scope.signupErrors = '잘못된 형식의 이메일 주소입니다.';
              break;
            default:
              $scope.signupErrors = '잘못된 형식의 에러입니다.';
            break;
          }
        });
      }
    };

    $scope.passwdReset = function(form) {
      $scope.inProgress = true;
      if(form.$valid) {
        Auth.resetPassword($scope.passwd.email).then(function () {
          $scope.inProgress = false;
          $scope.passwdErrors = "해당 이메일로 비밀번호 초기화가 발송되었습니다.";
        }, function(error) {
          $scope.inProgress = false;
          switch(error.code){
            case "INVALID_EMAIL":
              $scope.passwdErrors = '잘못된 형식의 이메일 주소입니다.';
              break;
            default:
              $scope.passwdErrors = '등록된 이메일이 없습니다.';
            break;
          }
        }
      )};
    };

  });
