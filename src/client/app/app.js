angular.module('SecretSocietyChat', ['ngRoute', "ngGravatar", "btford.socket-io"]).config(function(GravatarProvider){
  GravatarProvider.setSize(100);
});
