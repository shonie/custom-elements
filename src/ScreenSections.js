import scrollSnapPolyfill from 'css-scroll-snap-polyfill';

scrollSnapPolyfill();

export default class ScreenSections extends HTMLElement {
  get style() {
    return `
      .sections {
        max-height: 100vh;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
      }

      .proximity {
        scroll-snap-type: y proximity;
      }

      .section {
        height: 100vh;
        width: 100vw;
        /* where to stop scroll */
        scroll-snap-align: start;
        /* forces the scroll container to stop on that element before the user can continue to scroll */
        scroll-snap-stop: always;
      }
      .
    `;
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const sections = Array.prototype.map
      .call(this.children, () => {
        return `
          <section class="section">
            <slot name="section"></slot>
          </section>
        `;
      })
      .join('');

    shadow.innerHTML = `
      <style>${this.style}</style>
      <div class="sections">
        ${sections}
      </div>
    `;
  }
  connectedCallback() {
    this.fitIntoChildren();
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
  }

  fitIntoChildren() {
    const sections = this.shadowRoot.querySelectorAll('section');
    let hasHighSection = false;

    Array.prototype.forEach.call(this.children, (child, i) => {
      const higherThanViewport = child.clientHeight > window.innerHeight;

      if (higherThanViewport && sections[i]) {
        hasHighSection = true;
        sections[i].style.height = `${child.clientHeight}px`;
        sections[i].style['scroll-snap-align'] = '';
      }
    });

    if (hasHighSection) {
      this.shadowRoot.querySelector('.sections').classList.add('proximity');
    }
  }
}
