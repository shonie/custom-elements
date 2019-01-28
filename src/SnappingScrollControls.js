import { SECTIONS } from './elementNames';
import { SNAP_CHANGE } from './eventTypes';

const style = `
  #controls {
    position: absolute;
    display: block;
    left: 48px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    z-index: 3;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.3px;
  }

  .title {
    margin-bottom: 6px;
  }

  .title:hover {
    cursor: pointer;
  }

  .title::before {
    content: '';
    position: relative;
    left: 0;
    bottom: 3px;
    display: inline-block;
    background-color: white;
    opacity: 0.3;
    width: 16px;
    height: 2px;
    margin-right: 16px;
    transition: width 250ms ease-in-out;
  }

  .title.active::before {
    left: -4px;
    width: 24px;
    opacity: 1;
  }
`;

export default class SnappingScrollControls extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>${style}</style>
      <div id="controls">
      </div>
    `;

    this.sections = this.closest(SECTIONS);

    if (!this.sections) {
      throw new Error(`Controls should be mounted inside the ${SECTIONS} element`);
    }

    this._active = 0;
  }

  connectedCallback() {
    this.sections.get('sections').addEventListener('slotchange', this._handleSlotChange);

    this.sections.addEventListener(SNAP_CHANGE, this._setActive);
  }

  disconnectedCallback() {
    this.sections.removeEventListener('slotchange', this._render);
  }

  get(id) {
    return this.shadowRoot.getElementById(id);
  }

  _setActive = ({ detail: { active } }) => {
    this._active = active;

    this._render();
  };

  _handleSlotChange = () => {
    this._render();
  };

  _render() {
    const elements = this.sections.getUserElements();

    const divs = elements.map((el, i) => {
      const title = el.getAttribute('data-title');

      const isActive = i === this._active;

      const div = document.createElement('div');

      div.classList.add('title');

      if (isActive) {
        div.classList.add('active');
      }

      div.addEventListener('click', () => this.sections.scrollTo(i));

      div.innerHTML = isActive ? title : '';

      return div;
    });

    const fragment = document.createDocumentFragment();

    for (const div of divs) {
      fragment.appendChild(div);
    }

    this.get('controls').innerHTML = '';

    this.get('controls').appendChild(fragment);
  }
}
