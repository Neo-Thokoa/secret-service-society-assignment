"use strict";

angular.module('SecretSocietyChat').service('Users', ['socket', '$http', 'SocketEvent', function(socket, $http, SocketEvent){
      this.activeUsers = [];
      this.user = {};
      this.hasDownloadUsers = false;

      this.setUser = function(username){
            this.user = new User(username);
            socket.emit('add user', username);
      }

      this.getUser = function(){
            return this.user;
      }

      this.addUser = function(user){
            this.activeUsers.push(user);
            this.sendNewUserToServer(user);
      }


      this.sendNewUserToServer = function(user){
            socket.emit(SocketEvent.ADD_USER, user.name);
      }

      this.getExistingActiveUsers = function(){

            var self = this;
            getExistingUsersRequest().then(function successCallback(response) {
                  var users = response.data;

                  this.activeUsers = users;
                  this.hasDownloadUsers = true;
            });
      }

      this.getExistingUsersRequest = function(){
            return $http({ method: 'get', url: '/users' });
      }

      this.removeUserWithUsername = function(username){

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

      this.randomID = function(){

            length =  5;
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
            
      }
}]);
