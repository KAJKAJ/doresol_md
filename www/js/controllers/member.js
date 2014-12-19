'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('MemberCtrl', function($scope,ENV,$firebase,$state,Composite,Memorial, User, Member, Auth, Util,$mdSidenav,$mdDialog){
  $scope.hostUrl = ENV.HOST;

  // inviteUrl 처리
  // $scope.$watch( function(){ return Memorial.getInviteUrl();}, function(newValue){
  //   $scope.inviteUrl = newValue;
  // });


  $scope.$watch( function(){ return Memorial.getLeader();}, function(newValue){
    $scope.leader = newValue;
  });

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();
  $scope.users = User.getUsersObject();

  $scope.members = Member.getMembers();
  $scope.waitings = Member.getWaitings();
  
  $scope.role = Memorial.getRole();

  $scope.gotoAppStore = function(store) {
    if(store === 'ios') {
      window.open($scope.memorial.market_url.ios, '_system');  
    } else if(store === 'android') {
      window.open($scope.memorial.market_url.android, '_system');  
    }
  }
 
  // remove member from member list
    $scope.removeMember = function(event, uid, logout) {
      var title = "탈퇴하시겠습니까?";
      var ok = "탈퇴하기";
      var content = "탈퇴 후 다시 접속 시에는 해당 메모리얼의 공개 여부에 따라서 승인이 필요할 수 있으니 주의하시기 바랍니다.";

      if(!logout) {
        title = "탈퇴시키시겠습니까?";
        ok = "탈퇴시키기";
        content = "해당 사용자는 탈퇴 후 재 접속 시에 메모리얼의 공개 여부에 따라서 재승인이 필요할수 있습니다.";
      }

      var confirm = $mdDialog.confirm()
        .title(title)
        .content(content)
        .ariaLabel('Lucky day')
        .ok(ok)
        .cancel('취소')
        .targetEvent(event);
      $mdDialog.show(confirm).then(function() {
        Member.removeMember(uid).then(function(){
          if(logout){
            Auth.logout();
            $state.go('login');
          }
        });
      }, function() {
        $scope.alert = 'You decided to keep your debt.';
      });
      
    };

  // from waiting list to member list
  $scope.moveMember = function(uid) {
    var params = { memorialId: ENV.MEMORIAL_KEY, inviteeId: uid} ;
      Composite.addMember(params).then(function(){
      var removeParams = {
          memorialId: ENV.MEMORIAL_KEY,
          requesterId: uid
      };
      Composite.removeWaiting(removeParams).then(function(value){
      })
    }, function(error){
      console.log(error);
    })
  };

  $scope.getWaitingsCnt = function(){
    return Util.objectSize($scope.waitings);
  }

  $scope.getMembersCnt = function(){
    return Util.objectSize($scope.members);
  }

});