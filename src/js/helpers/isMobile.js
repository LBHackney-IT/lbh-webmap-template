const isMobile = () => !window.matchMedia("(min-width: 48.0625em)").matches;

const mobileDesktopSwitch = (callbackMobile, callbackDesktop) => {
  let wasMobile = isMobile();

  if (wasMobile) {
    callbackMobile();
  } else {
    callbackDesktop();
  }

  window.addEventListener("resize", () => {
    const isMobileNow = isMobile();
    if (isMobileNow && !wasMobile) {
      callbackMobile();
      wasMobile = true;
    } else if (!isMobileNow && wasMobile) {
      callbackDesktop();
      wasMobile = false;
    }
  });
};

export { isMobile, mobileDesktopSwitch };
