
$(function() {
  /**notification alert */
    $('#Notification').click(function() {
        $('.Notification-alert').toggleClass("left-0").siblings() .removeClass("left-0");;
      });

      $('#close-Notification').click(function(){
        $('.Notification-alert').toggleClass("left-0").siblings() .removeClass("left-0");
      });
      /**Chat alert */
      $('#Chat').click(function() {
        $('.message-alert').toggleClass("left-0").siblings() .removeClass("left-0");;
      });
      /**friend-alert */
      $('#friend-alert').click(function() {
        $('.friend-alert').toggleClass("left-0").siblings() .removeClass("left-0");;
      });
      /**Chat alert */
      $('#seting-alert').click(function() {
        $('.seting-alert').toggleClass("left-0").siblings() .removeClass("left-0");;
      });
  });