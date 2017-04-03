5.0.4
=====
- Correctly removes onRemoveComplete listener

5.0.3
=====
- Fixes `let` to `var`
- DEV-ONLY Adds eslint

5.0.2
=====
- Fixes es6 syntax used in index.js

5.0.1
=====
- reverted 5.0.0 change
- Fixes removing first element

5.0.0
=====
- old children are now passed to the diffing algorithm without filtering 
 
4.4.0
=====
- Handle `onLayoutComplete` and `onRemoveComplete` callback handlers as part of the component  

4.3.2
=====
- Fixes TypeScript to use `export as namespace` syntax

4.3.1
=====
- Fixes unmount when monitor children resize is disabled

4.3.0
=====
- Removes willReceiveProps function as not needed
- Make resizable children trigger masonry layout

4.2.3-beta
==========
- Removes willReceiveProps function as possibly not needed

4.2.2
=====
- Exports component as `default` to support import statement

4.2.0
=====
- Adds Typescript 2.0 typings definition
- Fixes unknownProps error (no longer passes unknown props to masonry el)

4.1.0
=====
- Add onImagesLoaded event
- Use lodash.assign instead of own extend function
- Add option to fire imagesloaded after each image is loaded 

4.0.4
=====
- Call masonry.destroy() on component unmount

4.0.3
=====
- Fix layout of prepended elements

4.0.2
=====
- Fix peer dependency typos...(derp)

4.0.1
=====
- Update React peer dependencies to include >=15.0.0

4.0.0
=====
- Update masonry-layout to ^4.0.0

3.0.0
=====
- Add peer dependency on React >= 0.14
- No longer need to pass in React or execute component as a function
- Use NPM dependencies instead of forked dependencies
- Allow addition of custom props

2.0.0
=====
- Remove < React 0.14 compatibility.
- Compatible with React 0.14 and above only
