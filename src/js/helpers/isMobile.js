import PubSub from "pubsub-js";

const isMobile = () => !window.matchMedia("(min-width: 768px)").matches;

const mobileDesktopSwitch = (callbackMobile, callbackDesktop) => {
  const wasMobile = isMobile();
  window.addEventListener("resize", event => {
    const isMobileNow = isMobile();
    if (isMobileNow && wasMobile) {
      callBackDesktop();
      wasMobile = false;
    } else if (!isMobileNow && !wasMobile) {
      callbackMobile();
      wasMobile = true;
    }
  });
};

export { isMobile, mobileDesktopSwitch };
