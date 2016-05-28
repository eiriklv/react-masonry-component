React Masonry Component
=======================

[![npm version](https://badge.fury.io/js/react-masonry-component.svg)](http://badge.fury.io/js/react-masonry-component)
[![Build Status](https://travis-ci.org/eiriklv/react-masonry-component.svg?branch=master)](https://travis-ci.org/eiriklv/react-masonry-component)

### IE8 support
if you wish to have IE8 support, v2 with React 0.14 is the highest version available.

### Table of contents
1. [Usage](#usage)
  1. [Basic usage](#basic-usage)
  2. [Custom props](#custom-props)
  3. [Accessing Masonry instance](#accessing-masonry-instance)
  4. [Events](#events)
3. [Using with Webpack](#using-with-webpack)
  1. [Dependencies](#dependencies)
  2. [Webpack config](#webpack-config)

#### Introduction:
A React.js Masonry component. (Also available as a [mixin](https://github.com/eiriklv/react-masonry-mixin) if needed)

#### Live demo:
[hearsay.me](http://www.hearsay.me)

#### Usage:

* The component is bundled with Masonry, so no additional dependencies needed!
* You can optionally include Masonry as a script tag if there should be any reason for doing so
`<script src='//cdnjs.cloudflare.com/ajax/libs/masonry/3.1.5/masonry.pkgd.min.js' />`

* To use the component just require the module.

##### Basic usage

```js
import React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
    transitionDuration: 0
};

export default class Gallery extends React.Component {
    render ( ) {
        const childElements = this.props.elements.map( element => (
            <li className="image-element-class">
                <img src={element.src} />
            </li>
        ) );

        return (
            <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'}             // default 'div'
                options={masonryOptions}       // default {}
                disableImagesLoaded={false}    // default false
            >
                {childElements}
            </Masonry>
        )
    }
}
```

##### Custom props
You can also include your own custom props - EG: inline-style and event handlers.

```js
import React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
    transitionDuration: 0
};

const style = {
    backgroundColor: 'tomato'
};


export default class Gallery extends React.Component {
    handleClick ( ) { /* ... */ }
    
    render ( ) {
        return (
            <Masonry
                className={'my-gallery-class'}
                style={style}
                onClick={e => this.handleClick()}
            >
                {...}
            </Masonry>
        )
    }
}
```

##### Accessing Masonry instance
Should you need to access the instance of Masonry (for example to listen to masonry events)
you can do so by using `refs`.

 ```js
 import React from 'react';
 import Masonry from 'react-masonry-component';

 export default class Gallery extends React.Component {
     handleLayoutComplete ( ) { }

     componentDidMount ( ) {
         this.masonry.on( 'layoutComplete', this.handleLayoutComplete );
     }

     componentWillUnmount ( ) {
         this.masonry.off( 'layoutComplete', this.handleLayoutComplete );
     }

     render ( ) {
         return (
             <Masonry
                 ref={c => this.masonry = c.masonry}
             >
                 {...}
             </Masonry>
         )
     }
 }
 ```

##### Events

- `onImagesLoaded` - triggered after all images have been loaded

```jsx
export default class Gallery extends React.Component {
    componentDidMount ( ) {
        this.hide();
    }
    
    handleImagesLoaded ( imagesLoadedInstance ) {
        this.show();
    }
    
    render ( ) {
        return (
            <Masonry
                onImagesLoaded={this.handleImagesLoaded}
            >
                {...}
            </Masonry>
        )
    }
}
```

#### Using with Webpack
Because webpack resolves AMD first, you need to use the imports-loader in order to disable AMD
and require as commonJS modules.

##### Dependencies
First ensure you have the imports-loader installed
```sh
npm install imports-loader --save
```

##### Webpack config
Then add the rules for the imports-loader to your webpack config.
The `babel-loader` is used below to show how you can use the 2 together.
```js
loaders: [
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
    },
    {
        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window'
    }
]
```
