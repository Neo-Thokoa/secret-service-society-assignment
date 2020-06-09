'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DMChannel = function (_Channel) {
      _inherits(DMChannel, _Channel);

      function DMChannel(currentUser, user) {
            _classCallCheck(this, DMChannel);

            // Calculate channel ID
            // Don't like repeating myself, but can't call static methood from constructor
            var username1 = currentUser.name;
            var username2 = user.name;
            var id = void 0;
            if (username1 < username2) {
                  id = username1 + '-' + username2;
            } else {
                  id = username2 + '-' + username1;
            }

            // Init parent

            // Set type to DM
            var _this = _possibleConstructorReturn(this, (DMChannel.__proto__ || Object.getPrototypeOf(DMChannel)).call(this, id, user.name));

            _this.type = Channel.types().DM;
            _this.user = user;
            return _this;
      }

      // Generates a unique ID by combining both usernames


      _createClass(DMChannel, null, [{
            key: 'idForUsernames',
            value: function idForUsernames(username1, username2) {
                  // Order in alpha order
                  if (username1 < username2) {
                        return username1 + '-' + username2;
                  } else {
                        return username2 + '-' + username1;
                  }
            }
      }]);

      return DMChannel;
}(Channel);
