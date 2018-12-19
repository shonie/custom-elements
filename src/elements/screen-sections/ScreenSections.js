import scrollSnapPolyfill from 'css-scroll-snap-polyfill';

scrollSnapPolyfill();

export default class ScreenSections extends HTMLElement {
  get _stylesheet() {
    return `
      :host {
        display: block; /* by default, custom elements are display: inline */
        contain: content; /* CSS containment FTW. */
      }

      #sections-wrapper {
        max-height: 100vh;
        overflow-y: scroll;
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
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>${this._stylesheet}</style>
      <div id="sections-wrapper">
        <slot id="sections" name="sections"></slot>
      </div>
    `;

    this._observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        switch (mutation.type) {
          case 'childList':
            this._normalizeSnapping();
            break;
        }
      });
    });

    this._observer.observe(this, {
      childList: true,
    });
  }

  disconnectedCallback() {
    this._observer.disconnect();
  }

  _normalizeSnapping() {
    const equalHeights = this._testEqualHeightDistribution();
    if (!equalHeights) {
      this.shadowRoot.getElementById('sections-wrapper').classList.add('proximity');
    }
  }

  _testEqualHeightDistribution() {
    const parent = this.shadowRoot.getElementById('sections-wrapper');
    const sections = this.shadowRoot.getElementById('sections');
    const [childNode] = sections.assignedElements();
    const parentHeight = parent.clientHeight;
    const childHeight = childNode.clientHeight;
    const distributedEqually = Math.floor(parentHeight % childHeight) === 0;
    return distributedEqually;
  }
}
