
class MessageFormController {

      constructor($http, Events, Channels) {
            this.$http = $http;
            this.Events = Events;
            this.Channels = Channels;

            this._typing = false;
            this.message = {};
            this.typingTimeout = 1000;
            this.lastTypingTime = 0;
      }

      // descriptive getter for _typing
      get isTyping() {
            return this._typing;
      }

      // Set isTyping to new state if not already at the new state. In addition to notifying events
      set isTyping(newState) {
            // Check that the desired new state is different from old
            if(this.isTyping !== newState) {
                  // Set new state
                  this._typing = newState;
                  // Send notification
                  if(newState) {
                        this.Events.sendTypingNotification();
                  } else {
                        this.Events.sendStopTypingNotification();
                  }
            }
      }

      // Checks that message text is correct and suitable to be sent.
      // more checks could be added here such as offensive language checks.
      messageIsValid(messageText) {
            return messageText.length > 0;
      }

      didReachTypingTimeout(timeDifference, timeout, isTyping) {
            return timeDifference >= timeout && isTyping;
      }

      send() {
            if(this.messageIsValid(this.message.text)) {
                  this.isTyping = false;
                  // Call service to send message
                  this.Events.sendMessage(this.message.text);
                  // Reset message
                  this.message = {};
            }
      }

      // Periodically checks whether has reached typing timeout, if so set isTyping to false
      checkTyping() {
            const self = this;

            const typingTimer = (new Date()).getTime();
            const duration = typingTimer - self.lastTypingTime;
            if (self.didReachTypingTimeout(duration, self.typingTimeout, self.isTyping)) {
                  self.isTyping = false;
            }
      }

      // Called when the text box value changes
      textBoxDidUpdate() {
            // user is typing because the value of the textbox just changed
            this.isTyping = true;
            this.lastTypingTime = (new Date()).getTime();
            // Create Timer event
            setTimeout(() => {this.checkTyping()}, this.typingTimeout);
      }
}

angular.module('WebChat').controller( 'MessageFormController', MessageFormController);
MessageFormController.$inject = ['$http', 'Events', 'Channels'];
