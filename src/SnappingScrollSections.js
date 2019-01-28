import scrollSnapPolyfill from 'css-scroll-snap-polyfill';
import { createObserver } from './domUtil';
import { SNAP_CHANGE } from './eventTypes';

scrollSnapPolyfill();

const style = `
  :host {
    display: block; /* by default, custom elements are display: inline */
    contain: content; /* CSS containment FTW. */
  }

  #sections-wrapper {
    max-height: 100vh;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
  }

  #sections-wrapper.proximity {
    scroll-snap-type: y proximity;
  }

  #sections::slotted(*) {
    /* for reducing reflow cost we initially set display: none */
    height: 100vh;
    width: 100vw;
    /* where to stop scroll */
    scroll-snap-align: start;
    /* forces the scroll container to stop on that element before the user can continue to scroll */
    scroll-snap-stop: always;
  }
`;

export default class SnappingScrollSections extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>${style}</style>
      <div id="sections-wrapper">
        <slot id="sections"></slot>
        <slot name="controls"></slot>
      </div>
    `;

    this._observer = createObserver(this, {
      childList: this._normalizeSnapping,
    });

    this._active = 0;

    this._lastScrollTop = 0;
  }

  connectedCallback() {
    this.get('sections-wrapper').addEventListener('scroll', this._handleScroll, false);
  }

  disconnectedCallback() {
    this._observer.disconnect();

    this.get('sections-wrapper').removeEventListener('scroll', this._handleScroll, false);
  }

  scrollTo(index) {
    const children = this.get('sections').assignedElements();

    if (typeof children[index] !== 'undefined') {
      children[index].scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  getActiveUserElement() {
    return this.getUserElements(this._active);
  }

  getUserElements() {
    return this.get('sections')
      .assignedNodes()
      .filter(el => el.nodeType === el.ELEMENT_NODE);
  }

  get(id) {
    return this.shadowRoot.getElementById(id);
  }

  _handleScroll = () => {
    const wrapper = this.get('sections-wrapper');

    const elements = this.getUserElements();

    const scrollTop = wrapper.scrollTop;

    const down = scrollTop > this._lastScrollTop;

    const activeElementOffsetTop = elements[this._active].offsetTop;

    const reachedBottomThreshold = scrollTop > activeElementOffsetTop;

    const reachedTopThreshold = scrollTop < activeElementOffsetTop;

    if (down && reachedBottomThreshold) {
      this._active++;
    } else if (!down && reachedTopThreshold) {
      this._active--;
    }

    if (reachedBottomThreshold || reachedTopThreshold) {
      this.dispatchEvent(
        this._createSnapEvent({
          active: this._active,
        })
      );
    }

    this._lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  _normalizeSnapping() {
    const equalHeights = this._testEqualHeightDistribution();

    if (!equalHeights) {
      this.get('sections-wrapper').classList.add('proximity');
    }
  }

  _createSnapEvent(detail, type = SNAP_CHANGE) {
    return new CustomEvent(type, {
      detail,
      bubbles: true,
    });
  }

  _testEqualHeightDistribution() {
    const parent = this.get('sections-wrapper');

    const [childNode] = this.getUserElements();

    const parentHeight = parent.clientHeight;

    const childHeight = childNode.clientHeight;

    const distributedEqually = Math.floor(parentHeight % childHeight) === 0;

    return distributedEqually;
  }
}
