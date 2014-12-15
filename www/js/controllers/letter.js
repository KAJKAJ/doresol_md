'use strict';

angular
.module('doresolApp')
.controller('LetterCtrl', function($scope,ENV, Memorial, User, Util, Letter, $state, $mdSidenav){
  $scope.hostUrl = ENV.HOST;

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();

  $scope.storyKeysArray = Letter.getStoryKeysArray();
  $scope.storiesArray = Letter.getStoriesArray();
  $scope.storiesObject = Letter.getStoriesObject();
  $scope.commentsObject = Letter.getCommentsObject();
  $scope.users = User.getUsersObject();

  $scope.role = Memorial.getRole();

  //set focus
  if($state.params.id){
    Util.focus($state.params.id);
  }

  $scope.commentSize = function(storyId){
    return Util.objectSize($scope.commentsObject[storyId]);
  }
  
  $scope.goToDetail = function(storyKey) {
    $state.go('letter_detail', {id: storyKey});
  }

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

});