'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// A channel object contains information about a chat room and it's messages
var Channel = function () {

      // If no name is provided use the channel id
      function Channel(id) {
            var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id;

            _classCallCheck(this, Channel);

            this.id = id;
            this.name = name;

            if (name === 'secretsocietychat') {
                  this.isSecretSociety = true;
            }

            this.created = new Date();
            this.type = Channel.types().CHANNEL;
            this.messages = [];
            this.unreadCount = 0;
      }

      _createClass(Channel, [{
            key: 'addMessage',


            // Adds a message to the messages array
            value: function addMessage(message) {
                  this.messages.push(message);
            }
      }, {
            key: 'markAsRead',


            // Resets the unread count
            value: function markAsRead() {
                  this.unreadCount = 0;
            }
      }, {
            key: 'isChannel',


            // Checks if channel is public to all users
            get: function get() {
                  return this.type == Channel.types().CHANNEL;
            }
      }, {
            key: 'isDM',


            // Checks if channel is a private channel (direct message betwen users)
            get: function get() {
                  return this.type == Channel.types().DM;
            }
      }, {
            key: 'conversationStatus',
            get: function get() {
                  if (this.status) {
                        return this.status;
                  } else {
                        return '';
                  }
            }
      }, {
            key: 'hasUnreadMessage',
            get: function get() {
                  return this.unreadCount > 0;
            }
      }], [{
            key: 'types',
            value: function types() {
                  return {
                        CHANNEL: 0,
                        DM: 1
                  };
            }
      }]);

      return Channel;
}();

