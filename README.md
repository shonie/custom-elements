# Overview
This package provides simple wrapper (with help of Custom Elements) for the implementation of [scroll-snapping](https://www.w3.org/TR/css-scroll-snap-1/) effect.

# Usage
Wrap your layout by `<snapping-scroll-sections>` tag like this:
```html
<scroll-snapping-sections>
    <section class="your-section">
        Section 1
    </section>
    <section class="your-section">
        Section 2
    </section>
</scroll-snapping-sections>
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
/* it will be "scroll-snap-type: y proximity;" in case if direct children will have not equal heights
scroll-snap-type: y mandatory;
```

# Resources
- https://www.w3.org/TR/css-scroll-snap-1/
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap
- https://css-tricks.com/practical-css-scroll-snapping/