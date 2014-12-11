angular.module('doresolApp')
.config(function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise('/story');

  /**
   * @ngdoc event
   * @name core.config.route
   * @eventOf core.config
   * @description
   *
   * Define routes and the associated paths
   *
   * - When the path is `'/'`, route to home
   * */
  $stateProvider
    .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro.html',
      controller: 'LoginCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl',
      authenticate: true
    })
    .state('story', {
      url: '/story',
      templateUrl: 'templates/story.html',
      controller: 'StoryCtrl',
      authenticate: true
    })
    .state('story_detail', {
      url: '/story_detail/:id',
      templateUrl: 'templates/story_detail.html',
      controller: 'StoryDetailCtrl',
      authenticate: true
    })
    .state('letter', {
      url: '/letter',
      templateUrl: 'templates/letter.html',
      controller: 'LetterCtrl',
      authenticate: true
    })
    .state('letter_detail', {
      url: '/letter_detail:id',
      templateUrl: 'templates/letter_detail.html',
      controller: 'LetterDetailCtrl',
      authenticate: true
    })
    .state('letter_new', {
      url: '/letter_new',
      templateUrl: 'templates/letter_new.html',
      controller: 'LetterNewCtrl',
      authenticate: true
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'LoginCtrl'
    })
    .state('passwd_reset', {
      url: '/passwd_reset',
      templateUrl: 'templates/passwd_reset.html',
      controller: 'LoginCtrl'
    })
    .state('member', {
      url: '/member',
      templateUrl: 'templates/member.html',
      controller: 'MemberCtrl',
      authenticate: true
    });
});
