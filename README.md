React Masonry Component
=======================

[![npm version](https://badge.fury.io/js/react-masonry-component.svg)](http://badge.fury.io/js/react-masonry-component)

#### Introduction:
A React.js Masonry component. (Also available as a [mixin](https://github.com/eiriklv/react-masonry-mixin) if needed)

#### Which version should I use?
React Masonary Component 2.x.x is compatible with React 0.14 and above only. For older versions of React, use a 1.x.x version of React Masonry Component.

#### Live demo:
[hearsay.me](http://www.hearsay.me)

#### Usage:

* The component is bundled with Masonry, so no additional dependencies needed!
* You can optionally include Masonry as a script tag if the should be any reason for doing so
`<script src='//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js' />`

* To use the component just require the module and inject `React`

* example code

```js 
var React = require('react');
var Masonry = require('react-masonry-component')(React);
 
var masonryOptions = {
    transitionDuration: 0
};
 
var Gallery = React.createClass({
    render: function () {
        var childElements = this.props.elements.map(function(element){
           return (
                <li className="image-element-class">
                    <img src={element.src} />
                </li>
            );
        });
        
        return (
            <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
            >
                {childElements}
            </Masonry>
        );
    }
});

module.exports = Gallery;
```
