"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Users = function () {
      function Users(socket, $http, SocketEvent) {
            _classCallCheck(this, Users);

            this.socket = socket;
            this.$http = $http;
            this.SocketEvent = SocketEvent;

            this.activeUsers = [];
            this.user = {};
            this.hasDownloadUsers = false;
      }

      // generates random ID for a username


      _createClass(Users, [{
            key: "randomID",
            value: function randomID(length) {
                  // If length not present, then use default length
                  length = length || 5;
                  var text = "";
                  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                  for (var i = 0; i < 5; i++) {
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                  }
                  return text;
            }
      }, {
            key: "removeUserWithUsername",
            value: function removeUserWithUsername(username) {
                  console.log('removing user ' + username);
                  // Remove user
                  for (var i = 0; i < this.activeUsers.length; i++) {
                        if (this.activeUsers[i].name === username) {
                              console.log('found removing user ' + username);

                              // Remove from array
                              this.activeUsers.splice(i, 1);
                              break;
                        }
                  }
            }
      }, {
            key: "getExistingUsersRequest",
            value: function getExistingUsersRequest() {
                  return $http({ method: 'get', url: '/users' });
            }

            // Gets currently active users from server

      }, {
            key: "getExistingActiveUsers",
            value: function getExistingActiveUsers() {
                  var self = this;
                  getExistingUsersRequest().then(function successCallback(response) {
                        var users = response.data;
                        // self.removeUserWithUsername(user.name, users);
                        self.activeUsers = users;
                        self.hasDownloadUsers = true;
                  });
            }
      }, {
            key: "sendNewUserToServer",
            value: function sendNewUserToServer(user) {
                  // Tell the server your username
                  this.socket.emit(this.SocketEvent.ADD_USER, user.name);
            }

            // Adds user to active users

      }, {
            key: "addUser",
            value: function addUser(user) {
                  this.activeUsers.push(user);
                  this.sendNewUserToServer(user);
            }
      }, {
            key: "getUser",
            value: function getUser() {
                  return this.user;
            }

            // Sets current user and send new user message to server

      }, {
            key: "setUser",
            value: function setUser() {
                  var username = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.randomID();

                  this.user = new User(username);
                  this.socket.emit('add user', username);
            }
      }]);

      return Users;
}();

Users.$inject = ['socket', '$http', 'SocketEvent'];
angular.module('SecretSocietyChat').service('Users', Users);
