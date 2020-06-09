angular.module('SecretSocietyChat')
.filter('channel', function() {
  return function(input, isUser) {
        if(isUser) {
             return '@' + input;
      } else {
            return '#' + input;
      }
  };
});
