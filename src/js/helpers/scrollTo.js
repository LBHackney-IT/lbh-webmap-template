// Adapted from https://gist.github.com/joshcanhelp/a3a669df80898d4097a1e2c01dea52c1

function scrollTo(selector, duration, callback) {
  if (typeof selector === "string") {
    // Assuming this is a selector we can use to find an element
    const scrollToObj = document.querySelector(selector);

    if (
      scrollToObj &&
      typeof scrollToObj.getBoundingClientRect === "function"
    ) {
      selector = window.pageYOffset + scrollToObj.getBoundingClientRect().top;
    } else {
      throw 'error: No element found with the selector "' + scrollTo + '"';
    }
  } else if (typeof selector !== "number") {
    // If it's nothing above and not an integer, we assume top of the window
    selector = 0;
  }

  // Set this a bit higher
  const anchorHeightAdjust = 30;
  if (selector > anchorHeightAdjust) {
    selector = selector - anchorHeightAdjust;
  }

  //
  // Set a default for the duration
  //
  if (typeof duration !== "number" || duration < 0) {
    duration = 1000;
  }

  // Declarations

  const cosParameter = (window.pageYOffset - selector) / 2;
  let scrollCount = 0;
  let oldTimestamp = window.performance.now();

  function step(newTimestamp) {
    var tsDiff = newTimestamp - oldTimestamp;

    // Performance.now() polyfill loads late so passed-in timestamp is a larger offset
    // on the first go-through than we want so I'm adjusting the difference down here.
    // Regardless, we would rather have a slightly slower animation than a big jump so a good
    // safeguard, even if we're not using the polyfill.

    if (tsDiff > 100) {
      tsDiff = 30;
    }

    scrollCount += Math.PI / (duration / tsDiff);

    // As soon as we cross over Pi, we're about where we need to be

    if (scrollCount >= Math.PI) {
      callback();
      return;
    }

    var moveStep = Math.round(
      selector + cosParameter + cosParameter * Math.cos(scrollCount)
    );
    window.scrollTo(0, moveStep);
    oldTimestamp = newTimestamp;
    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}

//
// Performance.now() polyfill from:
// https://gist.github.com/paulirish/5438650
//

(function() {
  if ("performance" in window == false) {
    window.performance = {};
  }

  Date.now =
    Date.now ||
    function() {
      // thanks IE8
      return new Date().getTime();
    };

  if ("now" in window.performance == false) {
    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart;
    }

    window.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
});

export { scrollTo };
