export default class ScreenSections extends HTMLElement {
  constructor() {
    super();

    console.log('ScollSections constuctor stage', this);
  }

  connectedCallback() {
    this.addEventListener('scroll');
  }

  disconnectedCallback() {}

  scollListener = e => {
    console.log(e);
  };
}
