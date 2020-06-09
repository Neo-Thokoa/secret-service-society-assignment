'use strict';

angular.module('SecretSocietyChat').controller('LoginController', ['Users', '$scope', '$location', '$http', function(Users, $scope, $location, $http){
      var vm = this;

      gapi.load('auth2', function() { // Loads the auth2 component of gapi
            gapi.auth2.init({ // initialize the auth2 using your credentials
              client_id: '668988752508-s1gu02k5f9jmkg0l5ssvvs63qenljogv.apps.googleusercontent.com'
            }).then(function onInit() { // on complete of init
              gapi.signin2.render("g-signin2", { // render the HTML button on the screen providing the ID of the element (g-signin2)
                onsuccess: function(googleUser) { // This executes when a user successfully authorizes you to their data by clicking the button and selecting their account.
                  $scope.userFound = true;
                  $scope.user = {};
                  var profile = googleUser.getBasicProfile();
                  console.log('ID: ' + profile.getId());
                  $scope.user.id = profile.getId();
                  console.log('Name: ' + profile.getName());
                  $scope.user.name = profile.getName();
                  console.log('Image URL: ' + profile.getImageUrl());
                  $scope.user.photo = profile.getImageUrl();
                  console.log('Email: ' + profile.getEmail());
                  $scope.user.email = profile.getEmail();
                  var authResponse = googleUser.getAuthResponse();
                  $scope.user.domain      = googleUser.getHostedDomain();
                  $scope.user.idToken     = authResponse.id_token;
                  $scope.user.expiresAt   = authResponse.expires_at;
                  console.log('Domain: ' + $scope.user.domain);
                  console.log('idToken: ' + $scope.user.idToken);
                  console.log('expiresAt: ' + $scope.user.expiresAt);
                  var username = Users.randomID()
                  $http({ method: 'get', url: '/users/available?username=' + $scope.user.id }).then(function successCallback(response) {
                        if (response.data.isAvailable) {
                              Users.setUser(username);
                              $location.path('/chat');
                        } else {
                              // Display error message
                              self.info = 'username is not available. Try something else';
                        }
                  });
                }
              });
            });
          });

}]);
