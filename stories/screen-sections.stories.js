import { storiesOf } from '@storybook/html';
import '../src'; // just register custom component
import './screen-sections.stories.css';

const getSection = (i, classList = '') => `
  <div class="section-content ${classList}" slot="section">Slide ${i}</div>
`;

storiesOf('ScreenSections', module).add('Default configuration', () => {
  return `
      <screen-sections class="screen-sections">
        ${Array(12)
          .fill(0)
          .map((_, i) => {
            return i % 3 ? getSection(i + 1) : getSection(i + 1, 'high');
          })
          .join('')}
      </screen-sections>
    `;
});
