'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MessageFormController = function () {
      function MessageFormController($http, Events, Channels) {
            _classCallCheck(this, MessageFormController);

            this.$http = $http;
            this.Events = Events;
            this.Channels = Channels;

            this._typing = false;
            this.message = {};
            this.typingTimeout = 1000;
            this.lastTypingTime = 0;
      }

      // descriptive getter for _typing


      _createClass(MessageFormController, [{
            key: 'messageIsValid',


            // Checks that message text is correct and suitable to be sent.
            // more checks could be added here such as offensive language checks.
            value: function messageIsValid(messageText) {
                  return messageText.length > 0;
            }
      }, {
            key: 'didReachTypingTimeout',
            value: function didReachTypingTimeout(timeDifference, timeout, isTyping) {
                  return timeDifference >= timeout && isTyping;
            }
      }, {
            key: 'send',
            value: function send() {
                  if (this.messageIsValid(this.message.text)) {
                        this.isTyping = false;
                        // Call service to send message
                        this.Events.sendMessage(this.message.text);
                        // Reset message
                        this.message = {};
                  }
            }

            // Periodically checks whether has reached typing timeout, if so set isTyping to false

      }, {
            key: 'checkTyping',
            value: function checkTyping() {
                  var self = this;

                  var typingTimer = new Date().getTime();
                  var duration = typingTimer - self.lastTypingTime;
                  if (self.didReachTypingTimeout(duration, self.typingTimeout, self.isTyping)) {
                        self.isTyping = false;
                  }
            }

            // Called when the text box value changes

      }, {
            key: 'textBoxDidUpdate',
            value: function textBoxDidUpdate() {
                  var _this = this;

                  // user is typing because the value of the textbox just changed
                  this.isTyping = true;
                  this.lastTypingTime = new Date().getTime();
                  // Create Timer event
                  setTimeout(function () {
                        _this.checkTyping();
                  }, this.typingTimeout);
            }
      }, {
            key: 'isTyping',
            get: function get() {
                  return this._typing;
            }

            // Set isTyping to new state if not already at the new state. In addition to notifying events
            ,
            set: function set(newState) {
                  // Check that the desired new state is different from old
                  if (this.isTyping !== newState) {
                        // Set new state
                        this._typing = newState;
                        // Send notification
                        if (newState) {
                              this.Events.sendTypingNotification();
                        } else {
                              this.Events.sendStopTypingNotification();
                        }
                  }
            }
      }]);

      return MessageFormController;
}();

angular.module('SecretSocietyChat').controller('MessageFormController', MessageFormController);
MessageFormController.$inject = ['$http', 'Events', 'Channels'];

