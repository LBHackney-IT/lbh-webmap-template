const isMobile = () => !window.matchMedia("(min-width: 48.0625em)").matches;

const mobileDesktopSwitch = (callbackMobile, callbackDesktop) => {
  let wasMobile = isMobile();
  window.addEventListener("resize", () => {
    const isMobileNow = isMobile();
    if (isMobileNow && wasMobile) {
      callbackDesktop();
      wasMobile = false;
    } else if (!isMobileNow && !wasMobile) {
      callbackMobile();
      wasMobile = true;
    }
  });
};

export { isMobile, mobileDesktopSwitch };
