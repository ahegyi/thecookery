$(document).ready(function() {
  var steps = $(".step");
  var btnEl = $("button.start-cooking");
  var resetEl = $("button.start-over");
  var currentStep = -1;

  steps.on("click", function() {
    currentStep = steps.index(this);
    toggleStep(steps, currentStep);
    checkButtonText(steps, currentStep, btnEl);
    resetEl.show();
  });

  btnEl.on("click", function() {
    currentStep += 1;

    toggleStep(steps, currentStep);
    checkButtonText(steps, currentStep, btnEl);

    if (currentStep >= steps.length) {
      currentStep = -1;
      resetEl.hide();
    }
    else {
      resetEl.show();
    }
  });

  resetEl.on("click", function() {
    currentStep = -1;
    checkButtonText(steps, currentStep, btnEl);
    steps.removeClass("current");
    resetEl.hide();
  });
});

var toggleStep = function(steps, currentStep) {
  steps.removeClass("current");

  if (currentStep !== -1) {
    steps.eq(currentStep).addClass("current");
  }
};

var checkButtonText = function(steps, currentStep, btnEl) {
  if (currentStep === steps.length - 1) {
    btnEl.text("Done!");
  }
  else if (currentStep === -1 || currentStep === steps.length) {
    btnEl.text("Let's Cook!");
  }
  else {
    btnEl.text("Next step...");
  }
};
