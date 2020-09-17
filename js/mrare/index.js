
import './aos';
import './background-images';
import mrCountdown from './countdown';
import mrCountup from './countup';
import mrDropdownGrid from './dropdown-grid';
import './fade-page';
import mrFormEmail from './form-email';
import './jarallax';
import mrOverlayNav from './overlay-nav';
import './navigation';
import './popovers';
import mrSmoothScroll from './smooth-scroll';
import './svg-injector';

(() => {
  if (typeof $ === 'undefined') {
    throw new TypeError('Medium Rare JavaScript requires jQuery. jQuery must be included before theme.js.');
  }
})();

export {
  mrCountdown,
  mrCountup,
  mrDropdownGrid,
  mrFormEmail,
  mrOverlayNav,
  mrSmoothScroll,
};
