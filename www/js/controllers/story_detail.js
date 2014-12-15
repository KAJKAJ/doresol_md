'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('StoryDetailCtrl', function($scope,ENV,$firebase,Composite, Memorial, User, $stateParams, MyStory, Comment, $mdDialog, Util){
  $scope.hostUrl = ENV.HOST;

  $scope.user = User.getCurrentUser();
  $scope.story = MyStory.getStoryObj($stateParams.id);
  $scope.mode = 'detail';
  $scope.role = Memorial.getRole();
  $scope.commentsObject = {};

  //scroll to top
  Util.scrollToTop();

  var _loadStoryComments = function(story) {
    $scope.users = User.getUsersObject();
    $scope.newComment = {};

    $scope.commentsTotalCnt = 0;

    var storyCommentsRef = new Firebase(ENV.FIREBASE_URI + '/memorials/' + ENV.MEMORIAL_KEY + '/stories/'+ $scope.story.$id + '/comments/');
    var _comments = $firebase(storyCommentsRef).$asArray();
    
    var commentsRef = new Firebase(ENV.FIREBASE_URI + '/comments');

    _comments.$watch(function(event){
      switch(event.event){
        case "child_removed":
          delete $scope.commentsObject[event.key];
          $scope.commentsTotalCnt--;
        break;
        case "child_added":
          var childRef = commentsRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(valueComment){
            valueComment.fromNow = moment(valueComment.created_at).fromNow();
            if($scope.commentsObject == undefined) $scope.commentsObject = {};
            $scope.commentsObject[event.key] = valueComment;
            User.setUsersObject(valueComment.ref_user);
          });
          $scope.commentsTotalCnt ++;
        break;
      }
    });
  }

  // first loading comments
  _loadStoryComments();

  $scope.addComment = function(storyKey,comment){
    if(comment.body){
      Composite.createCommentFromStoryInMemorial(ENV.MEMORIAL_KEY,storyKey,comment);
      $scope.newComment = {}; 
    }
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

  $scope.deleteComment = function(storyKey, commentKey) {
    delete $scope.commentsObject[commentKey];
    Comment.removeCommentFromStoryInMemorial(ENV.MEMORIAL_KEY, storyKey, commentKey);
  }

  $scope.formatDate = function(date) {
    return moment(date).format('LLL');
  }

});