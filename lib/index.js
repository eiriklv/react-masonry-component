var isBrowser = typeof window !== 'undefined';
var Masonry = isBrowser ? window.Masonry || require('masonry-layout') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;
var assign = require('lodash.assign');
var elementResizeDetectorMaker = require('element-resize-detector');
var debounce = require('lodash.debounce');
var omit = require('lodash.omit');
var React = require('react');
var refName = 'masonryContainer';

var propTypes = {
    enableResizableChildren: React.PropTypes.bool,
    disableImagesLoaded: React.PropTypes.bool,
    onImagesLoaded: React.PropTypes.func,
    updateOnEachImageLoad: React.PropTypes.bool,
    options: React.PropTypes.object,
    elementType: React.PropTypes.string,
    onLayoutComplete: React.PropTypes.func,
    onRemoveComplete: React.PropTypes.func
};

var MasonryComponent = React.createClass({
    masonry: false,
	  erd: undefined,
    domChildren: [],
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
            onLayoutComplete: function() {},
            onRemoveComplete: function() {}
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

            this.domChildren = this.getNewDomChildren();
        }
    },

    getNewDomChildren: function() {
        var node = this.refs[refName];
        var children = this.props.options.itemSelector ? node.querySelectorAll(this.props.options.itemSelector) : node.children;
        return Array.prototype.slice.call(children);
    },

    diffDomChildren: function() {
        var oldChildren = this.domChildren.filter(function(element) {
            /*
             * take only elements attached to DOM
             * (aka the parent is the masonry container, not null)
             */
            return !!element.parentNode;
        });

        var newChildren = this.getNewDomChildren();

        var removed = oldChildren.filter(function(oldChild) {
            return !~newChildren.indexOf(oldChild);
        });

        var domDiff = newChildren.filter(function(newChild) {
            return !~oldChildren.indexOf(newChild);
        });

        var beginningIndex = 0;

        // get everything added to the beginning of the DOMNode list
        var prepended = domDiff.filter(function(newChild, i) {
            var prepend = (beginningIndex === newChildren.indexOf(newChild));

            if (prepend) {
                // increase the index
                beginningIndex++;
            }

            return prepend;
        });

        // we assume that everything else is appended
        var appended = domDiff.filter(function(el) {
            return prepended.indexOf(el) === -1;
        });

        /*
         * otherwise we reverse it because so we're going through the list picking off the items that
         * have been added at the end of the list. this complex logic is preserved in case it needs to be
         * invoked
         *
         * var endingIndex = newChildren.length - 1;
         *
         * domDiff.reverse().filter(function(newChild, i){
         *     var append = endingIndex == newChildren.indexOf(newChild);
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

        if (removed.length === 0) {
            moved = oldChildren.filter(function(child, index) {
                return index !== newChildren.indexOf(child);
            });
        }

        this.domChildren = newChildren;

        return {
            old: oldChildren,
            new: newChildren,
            removed: removed,
            appended: appended,
            prepended: prepended,
            moved: moved
        };
    },

    performLayout: function() {
        var diff = this.diffDomChildren();

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

        if (diff.moved.length > 0) {
            this.masonry.reloadItems();
        }

        this.masonry.layout();
    },

    imagesLoaded: function() {
        if (this.props.disableImagesLoaded) return;

        imagesloaded(this.refs[refName])
            .on(
                this.props.updateOnEachImageLoad? 'progress' : 'always',
                debounce(
                    function(instance) {
                        if(this.props.onImagesLoaded) this.props.onImagesLoaded(instance);
                        this.masonry.layout();
                    }.bind(this), 100)
            );
    },

    initializeResizableChildren: function() {
        if (!this.props.enableResizableChildren) return;

        this.erd = elementResizeDetectorMaker({
            strategy: 'scroll'
        });

		    this.domChildren.forEach(this.listenToElementResize, this);
	  },

        listenToElementResize: function(el) {
		    this.erd.listenTo(el, function() {this.masonry.layout()}.bind(this))
	  },

    destroyErd: function() {
        if (this.erd) {
            this.domChildren.forEach(this.erd.uninstall, this.erd);
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
            this.masonry.off('removeComplete', this.props.onLayoutComplete);
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
