import { storiesOf } from '@storybook/html';
import '..';
import './screen-sections.stories.css';

const getSection = (i, classList = '') => `
  <div class="section-content ${classList}" data-title="Slide ${i}">Slide ${i}</div>
`;

storiesOf('snapping-scroll-sections', module)
  .add(
    'Default configuration',
    () => `
      <snapping-scroll-sections class="screen-sections">
        ${Array(12)
          .fill(0)
          .map((_, i) => {
            return getSection(i + 1);
          })
          .join('')}
      </snapping-scroll-sections>
    `
  )
  .add(
    'With controls',
    () => `
      <snapping-scroll-sections class="screen-sections">
        ${Array(12)
          .fill(0)
          .map((_, i) => {
            return getSection(i + 1);
          })
          .join('')}
        <snapping-scroll-controls slot="controls" />
      </snapping-scroll-sections>
    `
  )
  .add('Stress test (1000 sections)', () => {
    const screenSections = document.createElement('snapping-scroll-sections');
    let html = '';
    for (let i = 0; i <= 1000; i++) {
      html += getSection(i + 1);
    }
    screenSections.insertAdjacentHTML('beforeend', html);

    screenSections.insertAdjacentHTML('beforeend', '<snapping-scroll-controls slot="controls" />');

    return screenSections;
  })
  .add('Extreme test (5000 sections and unequal height distribution)', () => {
    const screenSections = document.createElement('snapping-scroll-sections');
    let html = '';
    for (let i = 0; i <= 5000; i++) {
      html += i % 3 ? getSection(i + 1) : getSection(i + 1, 'high');
    }
    screenSections.insertAdjacentHTML('beforeend', html);
    return screenSections;
  });
