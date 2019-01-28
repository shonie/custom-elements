import { SECTIONS, CONTROLS } from './elementNames';
import SnappingScrollSections from './SnappingScrollSections';
import SnappingScrollControls from './SnappingScrollControls';

window.customElements.define(CONTROLS, SnappingScrollControls);

window.customElements.define(SECTIONS, SnappingScrollSections);
