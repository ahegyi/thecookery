var ProgressTimer;

ProgressTimer = (function() {
  var progressHtml;

  progressHtml = '<div class="progress-timer" style="display: none; margin-top: 10px;">' +
                 '<p class="timing badge"></p>' +
                 '<div class="progress animated">' +
                 '<div class="progress-bar progress-bar-success" role="progressbar" style="min-width: 5%;">' +
                 '</div></div></div>';

  function ProgressTimer(timerHighlight) {
    self = this;

    var milliSeconds, progressTimer;

    // get actual timed length in minutes and ms
    this.timerHighlight = timerHighlight;
    this.minutes = parseInt(this.timerHighlight.data("minutes"), 10);
    milliSeconds = this.minutes * 60 * 1000;

    // set up our tock
    this.timer = new Tock({
      countdown: true,
      // in ms
      interval: 1000,
      // every interval, run callback
      callback: function() {
        var currentTime, newWidth;
        currentTime = self.prettyPrint(this.msToTime(this.lap()));
        newWidth = (milliSeconds - this.lap()) / milliSeconds;
        // update our current time text and progress bar length
        progressTimer.find(".progress-bar").text(currentTime);
        progressTimer.find(".progress-bar").css("width", newWidth * 100 + "%");
      },
      // runs when done
      complete: function() {
        progressTimer.find(".progress-bar").text("Done!");
        progressTimer.find(".progress").addClass("jello");
        progressTimer.find(".progress-bar").css("background-color", "#B8B8B8");
        progressTimer.find("button.pause, button.reset").remove();
      }
    });

    // add timer with minute count badge to DOM
    progressTimer = $(progressHtml);
    progressTimer.find(".timing").text(this.timerHighlight.text());
    progressTimer.appendTo(this.timerHighlight.closest(".step"));
    progressTimer.show();
  }

  ProgressTimer.prototype.prettyPrint = function(timeStr) {
    var matches = timeStr.match(/0?(\d+):(\d+)\.\d+/);
    var prettified = matches[1] + "m" + matches[2] + "s";
    return prettified;
  };

  ProgressTimer.prototype.start = function() {
    return this.timer.start(this.minutes + ":00");
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
    // start our timer
    new ProgressTimer($(this)).start();
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
