'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
      function LoginController(Users, $scope, $location, $http) {
            _classCallCheck(this, LoginController);

            this.Users = Users;
            this.username = '';
            this.$location = $location;
            this.$http = $http;
      }

      // Checks with the server that the username is available, if it is, login the user


      _createClass(LoginController, [{
            key: 'attemptToLogin',
            value: function attemptToLogin(username) {
                  var self = this;
                  this.$http({ method: 'get', url: '/users/available?username=' + username }).then(function successCallback(response) {
                        if (response.data.isAvailable) {
                              self.login(username);
                        } else {
                              // Display error message
                              self.info = 'username is not available. Try something else';
                        }
                  });
            }

            // Performs login operation and reroutes view

      }, {
            key: 'login',
            value: function login(username) {
                  // Login user
                  this.Users.setUser(username);
                  // Show Chat view
                  this.$location.path('/chat');
            }

            // Called when form is submitted

      }, {
            key: 'processLogin',
            value: function processLogin(shouldGenerateUsername) {
                  // Check if should generate a random username
                  if (shouldGenerateUsername) {
                        this.attemptToLogin(this.Users.randomID());
                  } else {
                        var username = this.username;
                        this.attemptToLogin(username);
                  }
            }
      }]);

      return LoginController;
}();

angular.module('SecretSocietyChat').controller('LoginController', LoginController);
LoginController.$inject = ['Users', '$scope', '$location', '$http'];
