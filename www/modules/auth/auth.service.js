'use strict';

angular.module('doresolApp')
  .factory('Auth', function Auth($location, $q, $rootScope, User, ENV, Composite,$firebaseAuth) {
    
    var ref = new Firebase(ENV.FIREBASE_URI);
    var authObj = $firebaseAuth(ref);

    var currentUser = null;
    
    var getCurrentUserFromFirebase = function(){
      var dfd = $q.defer();
      if(currentUser == null){
        authObj.$onAuth(function(authData) {
          if (authData) {
            setCurrentUser(authData);
            dfd.resolve(authData);
          } else {
            dfd.reject('no user data found');
          }
        });        
      }else{
        dfd.resolve(currentUser);
      }
      return dfd.promise;
    }

    var register =  function(user) {
    	var _register = function() {
        var dfd = $q.defer();

        authObj.$createUser(user.email,user.password).then(function() {
          authObj.$authWithPassword({
            email: user.email,
            password: user.password
          }).then(function(authData) {
            authData.email = user.email;
            dfd.resolve(authData);
          }).catch(function(err){
            dfd.reject(err);
          }).catch(function(err){
            dfd.reject(err);
          });
        });

        return dfd.promise;

      };
      return _register(user).then(User.create);
    }

    var getCurrentUser = function(){
      return currentUser;
    }

    var setCurrentUser = function(authUser) {
      currentUser = authUser;
    }

    var login = function(user){
      var deferred = $q.defer();
      
      authObj.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(authData) {
        User.getCurrentUserFromFirebase(authData.uid).then(function(userValue){
          deferred.resolve(authData);
        });
      }).catch(function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    var _loginFb = function(deferred, value){
      User.getCurrentUserFromFirebase(value.uid).then(function(userValue){
        if(!userValue.profile){
          var profile = {
            name: value.displayName,
            file:{
              location: 'facebook',
              url: value.thirdPartyUserData.picture.data.url,
              updated_at: moment().toString()
            }
          }
          
          User.update(value.uid, 
          {
           uid: value.uid,
           // id: value.id,         
           profile: profile,
           thirdPartyUserData: value.thirdPartyUserData,
           created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          });
        }
        deferred.resolve(value);
      },function(error){
        if(error === 'user is deleted'){
          var profile = {
            name: value.displayName,
            file:{
              location: 'facebook',
              url: value.thirdPartyUserData.picture.data.url,
              updated_at: moment().toString()
            }
          }
          
          User.update(value.uid, 
          {
           uid: value.uid,
           // id: value.id,         
           profile: profile,
           thirdPartyUserData: value.thirdPartyUserData,
           created_at: moment().format("YYYY-MM-DD HH:mm:ss")
          });
        }
        deferred.resolve(value);
      });
      // deferred.resolve(value);
      return deferred;
    }

    var loginFb = function() {
      var deferred = $q.defer();

      authObj.$authWithOAuthPopup("facebook").then(function(authData) {
        _loginFb(deferred,authData);
      }).catch(function(error) {
        authObj.$authWithOAuthRedirect("facebook").then(function(authData){
          _loginFb(deferred,authData);
        }).catch(function(err){
          deferred.reject(err);
        });
      });
      
      return deferred.promise;
    }

    var loginOauth = function(provider){
      switch(provider){
        case 'facebook':
          return loginFb();
        break;
      }
    }

    var logout = function() {
      currentUser = null;
      User.clearCurrentUser();
      authObj.$unauth();
      // auth.$logout();
    }

    var changePassword = function(email, oldPassword, newPassword) {
      // return auth.$changePassword(email, oldPassword, newPassword);
    }

    var resetPassword = function(email) {
      var dfd = $q.defer();

      console.log('--email---');
      console.log(email);


      authObj.$sendPasswordResetEmail(email).then(function() {
        console.log("Password reset email sent successfully!");
        dfd.resolve();
      }).catch(function(error) {
        dfd.reject(error);
      });

      return dfd.promise;
    }

    return {
      register: register,

      login: login,

      loginOauth: loginOauth,

      logout: logout,

      resetPassword: resetPassword,

      getCurrentUser:getCurrentUser,

      getCurrentUserFromFirebase:getCurrentUserFromFirebase,
      changePassword:changePassword

      // isAdmin: function() {
      //   return currentUser.role === 'admin';
      // },

      // changePassword: function(oldPassword, newPassword, callback) {
      //   var cb = callback || angular.noop;

      //   return User.changePassword({ id: currentUser._id }, {
      //     oldPassword: oldPassword,
      //     newPassword: newPassword
      //   }, function(user) {
      //     return cb(user);
      //   }, function(err) {
      //     return cb(err);
      //   }).$promise;
      // }
    };
  });
