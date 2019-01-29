import { SECTIONS } from './elementNames';
import { SNAP_CHANGE } from './eventTypes';

const style = `
  #controls {
    position: absolute;
    display: block;
    left: 48px;
    top: 50%;
    transform: translateY(-50%);
    height: 66px;
    overflow-y: hidden;
    color: white;
    z-index: 3;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    line-height: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.3px;
  }

  #controls-inner-wrapper {
    transform: translateY(0);
    transition: transform 250ms ease-in-out;
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
        <div id="controls-inner-wrapper">

        </div>
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

    this.get('controls').addEventListener('pointerdown', e => {
      console.log(e);
    });
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
    const CONTROLS_COUNT = 3;

    const elements = this.sections.getUserElements();

    const startIndex = this._active === 0 ? 0 : Math.ceil(this._active - CONTROLS_COUNT / 2);

    const shownControls =
      this._active === elements.length - 1
        ? elements.slice(-CONTROLS_COUNT)
        : elements.slice(startIndex, startIndex + CONTROLS_COUNT);

    const divs = elements.map((el, i) => {
      const title = el.getAttribute('data-title');

      const originalIndex = i;
      // const originalIndex = elements.indexOf(el);

      const isActive = this._active === originalIndex;

      const div = document.createElement('div');

      div.classList.add('title');

      if (isActive) {
        div.classList.add('active');
      }

      div.addEventListener('click', () => this.sections.scrollTo(originalIndex));

      div.innerHTML = isActive ? title : '';

      return div;
    });

    const fragment = document.createDocumentFragment();

    for (const div of divs) {
      fragment.appendChild(div);
    }

    const controls = this.get('controls-inner-wrapper').childNodes;

    const activeControl = controls[this._active];

    const firstShownControl = controls[Math.ceil(this._active - CONTROLS_COUNT / 2)];

    const y =
      activeControl === undefined
        ? 0
        : firstShownControl === undefined
        ? activeControl.offsetTop
        : firstShownControl.offsetTop;

    this.get('controls-inner-wrapper').style.transform = `translateY(${-y}px)`;
    this.get('controls-inner-wrapper').innerHTML = '';
    this.get('controls-inner-wrapper').appendChild(fragment);
  }
}
