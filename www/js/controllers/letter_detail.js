'use strict';

angular
.module('doresolApp')
.controller('LetterDetailCtrl', function($scope,ENV,$state,$stateParams,$firebase,Composite, Memorial, User, Comment, Story, Util, Letter,$mdDialog){
  $scope.storyKey = $stateParams.id;
  
  $scope.hostUrl = ENV.HOST;

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();

  $scope.newComment = {};

  $scope.storyKeysArray = Letter.getStoryKeysArray();
  $scope.storiesArray = Letter.getStoriesArray();
  $scope.storiesObject = Letter.getStoriesObject();
  $scope.commentsObject = Letter.getCommentsObject();
  $scope.story = Letter.getStoryObj($stateParams.id);
  // console.log($scope.story);
  $scope.users = User.getUsersObject();

  $scope.role = Memorial.getRole();

  //scroll to top
  Util.scrollToTop();

  $scope.removeStory = function(story){
    // console.log(story);
    Story.removeStoryFromStoryline(story.ref_memorial,story.$id,story.pagingKey);
    $state.go('letter');
  }

  $scope.removeStoryConfirm = function(ev,story){
    // console.log(story);
    var confirm = $mdDialog.confirm()
      .title('편지 삭제')
      .content('편지를 삭제하시겠습니까?')
      .ok('삭제')
      .cancel('취소')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.removeStory(story);
    }, function() {
      // $scope.alert = 'You decided to keep your debt.';
    });
  }

  $scope.addComment = function(storyKey,comment){
    if(comment.body){
      Composite.createComment(storyKey, comment);
      $scope.newComment = {}; 
    }
  }

  $scope.deleteComment = function(storyKey, commentKey) {
    delete $scope.commentsObject[storyKey][commentKey];
    Comment.removeCommentFromStory(storyKey, commentKey);
  }

  $scope.deleteCommentConfirm = function(ev, storyKey, commentKey) {
    var confirm = $mdDialog.confirm()
      .title('댓글 삭제')
      .content('댓글을 삭제하시겠습니까?')
      .ok('삭제')
      .cancel('취소')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.deleteComment(storyKey, commentKey);
    }, function() {
      // $scope.alert = 'You decided to keep your debt.';
    });
  };
  
});