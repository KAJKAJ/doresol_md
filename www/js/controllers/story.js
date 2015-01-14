'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
.module('doresolApp')
.controller('StoryCtrl', function($scope,ENV,$state, Memorial, User, MyStory, Util, $mdSidenav){
  $scope.pageClass = 'page-login';
  $scope.hostUrl = ENV.HOST;

  $scope.memorial = Memorial.getCurrentMemorial();
  $scope.user = User.getCurrentUser();
  $scope.users = User.getUsersObject();
  
  $scope.mode = 'overview';
  $scope.storiesArray = MyStory.getStoriesArray();
  $scope.storiesObject = MyStory.getStoriesObject();
  $scope.storiesCnt = MyStory.getStoriesCnt();

  $scope.role = Memorial.getRole();
console.log($scope.storiesObject);
  //set focus
  if($state.params.id){
    Util.focus($state.params.id);
  }
  
  $scope.objectSize = function(object){
    if(object){
      return Util.objectSize(object);
    }else{
      return 0;
    }
  }


  $scope.formatDate = function(date) {
    return moment(date).format('LLL');
  }

  $scope.goToDetail = function(storyId) {
    $state.go('story_detail', {id: storyId});
  }

  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  
  
});