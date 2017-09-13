var isBrowser = typeof window !== 'undefined';
var Masonry = isBrowser ? window.Masonry || require('masonry-layout') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;
var assign = require('lodash.assign');
var elementResizeDetectorMaker = require('element-resize-detector');
var debounce = require('lodash.debounce');
var omit = require('lodash.omit');
var PropTypes = require('prop-types');
var React = require('react');
var createReactClass = require('create-react-class');
var refName = 'masonryContainer';

var propTypes = {
  enableResizableChildren: PropTypes.bool,
  disableImagesLoaded: PropTypes.bool,
  onImagesLoaded: PropTypes.func,
  updateOnEachImageLoad: PropTypes.bool,
  options: PropTypes.object,
  elementType: PropTypes.string,
  onLayoutComplete: PropTypes.func,
  onRemoveComplete: PropTypes.func
};

var MasonryComponent = createReactClass({
  masonry: false,
  erd: undefined,
  latestKnownDomChildren: [],
  displayName: 'MasonryComponent',
  propTypes: propTypes,

  getDefaultProps: function() {
    return {
      enableResizableChildren: false,
      disableImagesLoaded: false,
      updateOnEachImageLoad: false,
      options: {},
      className: '',
      elementType: 'div',
      onLayoutComplete: function() {
      },
      onRemoveComplete: function() {
      }
    };
  },

  initializeMasonry: function(force) {
    if (!this.masonry || force) {
      this.masonry = new Masonry(
        this.refs[refName],
        this.props.options
      );

      if (this.props.onLayoutComplete) {
        this.masonry.on('layoutComplete', this.props.onLayoutComplete);
      }

      if (this.props.onRemoveComplete) {
        this.masonry.on('removeComplete', this.props.onRemoveComplete);
      }

      this.latestKnownDomChildren = this.getCurrentDomChildren();
    }
  },

  getCurrentDomChildren: function() {
    var node = this.refs[refName];
    var children = this.props.options.itemSelector ? node.querySelectorAll(this.props.options.itemSelector) : node.children;
    return Array.prototype.slice.call(children);
  },

  diffDomChildren: function() {
    var forceItemReload = false;

    var knownChildrenStillAttached = this.latestKnownDomChildren.filter(function(element) {
      /*
       * take only elements attached to DOM
       * (aka the parent is the masonry container, not null)
       * otherwise masonry would try to "remove it" again from the DOM
       */
      return !!element.parentNode;
    });

    /*
     * If not all known children are attached to the dom - we have no other way of notifying
     * masonry to remove the ones not still attached besides invoking a complete item reload.
     * basically all the rest of the code below does not matter in that case.
     */
    if (knownChildrenStillAttached.length !== this.latestKnownDomChildren.length) {
      forceItemReload = true;
    }

    var currentDomChildren = this.getCurrentDomChildren();

    /*
     * Since we are looking for a known child which is also attached to the dom AND
     * not attached to the dom at the same time - this would *always* produce an empty array.
     */
    var removed = knownChildrenStillAttached.filter(function(attachedKnownChild) {
      return !~currentDomChildren.indexOf(attachedKnownChild);
    });

    /*
     * This would get any children which are attached to the dom but are *unkown* to us
     * from previous renders
     */
    var newDomChildren = currentDomChildren.filter(function(currentChild) {
      return !~knownChildrenStillAttached.indexOf(currentChild);
    });

    var beginningIndex = 0;

    // get everything added to the beginning of the DOMNode list
    var prepended = newDomChildren.filter(function(newChild) {
      var prepend = (beginningIndex === currentDomChildren.indexOf(newChild));

      if (prepend) {
        // increase the index
        beginningIndex++;
      }

      return prepend;
    });

    // we assume that everything else is appended
    var appended = newDomChildren.filter(function(el) {
      return prepended.indexOf(el) === -1;
    });

    /*
     * otherwise we reverse it because so we're going through the list picking off the items that
     * have been added at the end of the list. this complex logic is preserved in case it needs to be
     * invoked
     *
     * var endingIndex = currentDomChildren.length - 1;
     *
     * newDomChildren.reverse().filter(function(newChild, i){
     *     var append = endingIndex == currentDomChildren.indexOf(newChild);
     *
     *     if (append) {
     *         endingIndex--;
     *     }
     *
     *     return append;
     * });
     */

    // get everything added to the end of the DOMNode list
    var moved = [];

    /*
     * This would always be true (see above about the lofic for "removed")
     */
    if (removed.length === 0) {
      /*
       * 'moved' will contain some random elements (if any) since the "knownChildrenStillAttached" is a filter
       * of the "known" children which are still attached - All indexes could basically change. (for example
       * if the first element is not attached)
       * Don't trust this array.
       */
      moved = knownChildrenStillAttached.filter(function(child, index) {
        return index !== currentDomChildren.indexOf(child);
      });
    }

    this.latestKnownDomChildren = currentDomChildren;

    return {
      old: knownChildrenStillAttached, // Not used
      new: currentDomChildren, // Not used
      removed: removed,
      appended: appended,
      prepended: prepended,
      moved: moved,
      forceItemReload: forceItemReload
    };
  },

  performLayout: function() {
    var diff = this.diffDomChildren();

    // Would never be true. (see comments of 'diffDomChildren' about 'removed')
    if (diff.removed.length > 0) {
      if (this.props.enableResizableChildren) {
        diff.removed.forEach(this.erd.removeAllListeners, this.erd);
      }
      this.masonry.remove(diff.removed);
      this.masonry.reloadItems();
    }

    if (diff.appended.length > 0) {
      this.masonry.appended(diff.appended);

      if (diff.prepended.length === 0) {
        this.masonry.reloadItems();
      }

      if (this.props.enableResizableChildren) {
        diff.appended.forEach(this.listenToElementResize, this);
      }
    }

    if (diff.prepended.length > 0) {
      this.masonry.prepended(diff.prepended);

      if (this.props.enableResizableChildren) {
        diff.prepended.forEach(this.listenToElementResize, this);
      }
    }

    if (diff.forceItemReload || diff.moved.length > 0) {
      this.masonry.reloadItems();
    }

    this.masonry.layout();
  },

  imagesLoaded: function() {
    if (this.props.disableImagesLoaded) {
      return;
    }

    imagesloaded(this.refs[refName])
      .on(
        this.props.updateOnEachImageLoad ? 'progress' : 'always',
        debounce(
          function(instance) {
            if (this.props.onImagesLoaded) {
              this.props.onImagesLoaded(instance);
            }
            this.masonry.layout();
          }.bind(this), 100)
      );
  },

  initializeResizableChildren: function() {
    if (!this.props.enableResizableChildren) {
      return;
    }

    this.erd = elementResizeDetectorMaker({
      strategy: 'scroll'
    });

    this.latestKnownDomChildren.forEach(this.listenToElementResize, this);
  },

  listenToElementResize: function(el) {
    this.erd.listenTo(el, function() {
      this.masonry.layout()
    }.bind(this))
  },

  destroyErd: function() {
    if (this.erd) {
      this.latestKnownDomChildren.forEach(this.erd.uninstall, this.erd);
    }
  },

  componentDidMount: function() {
    this.initializeMasonry();
    this.initializeResizableChildren();
    this.imagesLoaded();
  },

  componentDidUpdate: function() {
    this.performLayout();
    this.imagesLoaded();
  },

  componentWillUnmount: function() {
    this.destroyErd();

    // unregister events
    if (this.props.onLayoutComplete) {
      this.masonry.off('layoutComplete', this.props.onLayoutComplete);
    }

    if (this.props.onRemoveComplete) {
      this.masonry.off('removeComplete', this.props.onRemoveComplete);
    }

    this.masonry.destroy();
  },

  render: function() {
    var props = omit(this.props, Object.keys(propTypes));
    return React.createElement(this.props.elementType, assign({}, props, {ref: refName}), this.props.children);
  }
});

module.exports = MasonryComponent;
module.exports.default = MasonryComponent;
