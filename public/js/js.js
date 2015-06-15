$(document).ready(function() {
  var steps = $(".step");

  steps.on("click", function() {
    if ($(this).hasClass("current")) {
      $(this).removeClass("current");
    }
    else {
      steps.removeClass("current");
      $(this).addClass("current");
    }
  });
});
