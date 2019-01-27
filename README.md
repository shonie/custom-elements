# Overview
This package provides a simple wrapper (with help of Custom Elements) for the implementation of [scroll-snapping](https://www.w3.org/TR/css-scroll-snap-1/) effect.

# Demo
- See [Storybook](https://shonie.github.io/snapping-scroll-sections)

# Usage
Wrap your layout by `<snapping-scroll-sections>` tag like this:
```html
<snapping-scroll-sections>
    <section class="your-section">
        Section 1
    </section>
    <section class="your-section">
        Section 2
    </section>
</snapping-scroll-sections>
```
Direct children of `scroll-snapping-element` will be slotted to the default slot and will get these css properties:
```css
/* where to stop scroll */
scroll-snap-align: start;
/* forces the scroll container to stop on that element before the user can continue to scroll */
scroll-snap-stop: always;
```
While host element will get:
```css
/* it will be "scroll-snap-type: y proximity;" in case if direct children will have not equal heights */
scroll-snap-type: y mandatory;
```

# Resources
- https://www.w3.org/TR/css-scroll-snap-1/
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap
- https://css-tricks.com/practical-css-scroll-snapping/