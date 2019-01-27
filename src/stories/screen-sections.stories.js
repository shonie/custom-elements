import { storiesOf } from '@storybook/html';
import '..';
import './screen-sections.stories.css';

const getSection = (i, classList = '') => `
  <div class="section-content ${classList}">Slide ${i}</div>
`;

storiesOf('elements/screen-sections', module)
  .add('Default configuration', () => {
    return `
      <screen-sections class="screen-sections">
        ${Array(12)
          .fill(0)
          .map((_, i) => {
            return getSection(i + 1);
          })
          .join('')}
      </screen-sections>
    `;
  })
  .add('Stress test (1000 sections)', () => {
    const screenSections = document.createElement('screen-sections');
    let html = '';
    for (let i = 0; i <= 1000; i++) {
      html += getSection(i + 1);
    }
    screenSections.insertAdjacentHTML('beforeend', html);
    return screenSections;
  })
  .add('Extreme test (5000 sections and unequal height distribution)', () => {
    const screenSections = document.createElement('screen-sections');
    let html = '';
    for (let i = 0; i <= 5000; i++) {
      html += i % 3 ? getSection(i + 1) : getSection(i + 1, 'high');
    }
    screenSections.insertAdjacentHTML('beforeend', html);
    return screenSections;
  });
