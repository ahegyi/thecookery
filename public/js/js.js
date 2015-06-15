var ProgressTimer;

ProgressTimer = (function() {
  var progressHtml;

  progressHtml = '<div class="progress-timer" style="display: none; margin-top: 10px;">' + '<p class="timing badge"></p>' + '<div class="progress">' + '<div class="progress-bar" role="progressbar" style="min-width: 5%;">' + '</div></div></div>';

  function ProgressTimer(timerHighlight) {
    var milliSeconds, progressTimer;
    this.timerHighlight = timerHighlight;
    progressTimer = $(progressHtml);
    progressTimer.find('.timing').text(this.timerHighlight.text());
    progressTimer.appendTo(this.timerHighlight.closest('.step'));
    progressTimer.show();
    this.minutes = parseInt(this.timerHighlight.data('minutes'), 10);
    milliSeconds = this.minutes * 60 * 1000;
    this.timer = new Tock({
      countdown: true,
      interval: 1000,
      callback: function() {
        var currentTime, newWidth;
        currentTime = this.msToTime(this.lap());
        progressTimer.find('.progress-bar').text(currentTime);
        newWidth = (milliSeconds - this.lap()) / milliSeconds;
        progressTimer.find('.progress-bar').css('width', newWidth * 100 + '%');
      },
      complete: function() {
        return console.log('timer is done');
      }
    });
  }

  ProgressTimer.prototype.start = function() {
    return this.timer.start(this.minutes + ':00');
  };

  return ProgressTimer;

})();


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

  steps.find(".timer").one("click", function(evt){
    // get out of this function if not the current step
    // i.e. don't activate timer unless current
    if (!$(this).closest(".step").hasClass("current")) {
      return true;
    }

    var p = new ProgressTimer($(this));
    p.start();
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
