'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function () {
      function Message(text, user, createdAt) {
            _classCallCheck(this, Message);

            this.text = text;
            this.user = user;
            if (createdAt === undefined) {
                  this.createdAt = new Date();
            }

            this.createdAt = createdAt;
      }

      _createClass(Message, [{
            key: 'setChannelID',
            value: function setChannelID(channelID) {
                  this.channel = channelID;
                  return this;
            }
      }, {
            key: 'type',
            get: function get() {
                  return 'message';
            }
      }, {
            key: 'isUserMessage',
            get: function get() {
                  return true;
            }
      }]);

      return Message;
}();

var NotificationMessage = function (_Message) {
      _inherits(NotificationMessage, _Message);

      function NotificationMessage(text) {
            _classCallCheck(this, NotificationMessage);

            var systemUser = { name: 'System' };
            return _possibleConstructorReturn(this, (NotificationMessage.__proto__ || Object.getPrototypeOf(NotificationMessage)).call(this, text, systemUser));
      }

      _createClass(NotificationMessage, [{
            key: 'isNotification',
            get: function get() {
                  return true;
            }
      }, {
            key: 'isUserMessage',
            get: function get() {
                  return false;
            }
      }, {
            key: 'type',
            get: function get() {
                  return 'notification';
            }
      }]);

      return NotificationMessage;
}(Message);
