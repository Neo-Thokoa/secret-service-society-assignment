"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notifications = function () {
      function Notifications() {
            _classCallCheck(this, Notifications);
      }

      _createClass(Notifications, [{
            key: "send",
            value: function send(text) {
                  // Let's check if the browser supports notifications
                  if (!("Notification" in window)) {
                        alert("This browser does not support desktop notification");
                  }

                  // Let's check whether notification permissions have already been granted
                  else if (Notification.permission === "granted") {
                              // If it's okay let's create a notification
                              var notification = new Notification(text);
                        }

                        // Otherwise, we need to ask the user for permission
                        else if (Notification.permission !== 'denied') {
                                    Notification.requestPermission(function (permission) {
                                          // If the user accepts, let's create a notification
                                          if (permission === "granted") {
                                                var notification = new Notification(text);
                                          }
                                    });
                              }
            }
      }]);

      return Notifications;
}();
//export Notifications;


angular.module('SecretSocietyChat').service('Notifications', Notifications);
