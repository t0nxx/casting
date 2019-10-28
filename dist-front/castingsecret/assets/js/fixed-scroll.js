
$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
      $(".homepage-sidebar").addClass("fixed-sidebar");
  } else {
     $(".homepage-sidebar").removeClass("fixed-sidebar");
  }
});