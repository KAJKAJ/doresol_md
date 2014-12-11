'use strict';

angular
.module('doresolApp')
.controller('LoginCtrl', function ($scope, Auth, User, $window,$state,Memorial,Composite, ENV) {
    $scope.loginUser = {};
    $scope.signupUser = {};
    $scope.passwd = {};

    //set current memorial
    // Memorial.setCurrentMemorial(ENV.MEMORIAL_KEY);

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider).then(function(value){
        _afterLogin(value.uid);
      });
    }

    var _afterLogin = function(userId){
      // console.log(userId);
      Memorial.clearMyMemorial();
      // //set current memorial
      Memorial.setCurrentMemorial(ENV.MEMORIAL_KEY);
      $state.go("story");
    }

    var _login = function(){
      // console.log('email login clicked');
      Auth.login({
          email: $scope.loginUser.email,
          password: $scope.loginUser.password
        })
        .then( function (value){
          // console.log(value);
          _afterLogin(value.uid);
        } ,function(error){
          console.log(error);
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
      _login();
    }

    $scope.signup = function(form) {
      $scope.signupErrors = '';
      if(form.$valid) {
        Auth.register($scope.signupUser).then(function (value){
          User.setCurrentUser();
          User.getCurrentUserFromFirebase(value.uid).then(function(userData){
            _afterLogin(userData.uid);
          });
        }, function(error){
          var errorCode = error.code;
          console.log(error);
          switch(errorCode){
            case "EMAIL_TAKEN":
              $scope.signupErrors = '이미 등록된 이메일 주소입니다.';
            break;
          }
        });
      }
    };

    $scope.passwdReset = function(form) {
      console.log(form);

      if(form.$valid) {
        Auth.resetPassword($scope.passwd.email).then(function () {
          $scope.passwdErrors = "해당 이메일로 비밀번호 초기화가 발송되었습니다.";
        }, function(error) {
          $scope.passwdErrors = '등록되지 않은 이메일 주소입니다.';
        }
      )};
    };

  });
