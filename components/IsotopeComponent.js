import React, { Component, PropTypes } from 'react';
import { assign } from 'lodash';
import defaultProps from './defaultProps';

const isBrowser = typeof window !== 'undefined';
const Isotope = isBrowser ? ( Isotope || window.Isotope || require( 'isotope-layout' ) ) : null;
const imagesloaded = isBrowser ? require( 'imagesloaded' ) : null;

const refName = 'isotopeContainer';

function getDiff ( listA, listB ) {
  // get differences between two lists
  return listA.filter( diffItem => !~listB.indexOf( diffItem ) )
}

function getPrepended ( diff, updated ) {
  // get everything added to the beginning of the DOMNode list
  let beginningIndex = 0;

  return diff.filter(
    newChild => {
      const prepend = beginningIndex === updated.indexOf( newChild );

      if ( prepend ) {
        // increase the index
        beginningIndex++;
      }

      return prepend;
    }
  );
}

/*
 * otherwise we reverse it because so we're going through the list picking off the items that
 * have been added at the end of the list. this complex logic is preserved in case it needs to be
 * invoked
  function getPrependedReverse ( diff, updated ) {
    let endingIndex = updated.length - 1;

    diff.reverse().filter(
      newChild => {
        const append = endingIndex = updated.indexOf( newChild );

        if ( append ) {
          endingIndex--;
        }

        return append;
      }
    )
  }
*/

function getAppended ( diff, prepended ) {
  // we assume that everything else is appended
  return diff.filter( el => prepended.indexOf( el ) === -1 );
}

function getMoved ( newChildren, oldChildren ) {
  // get everything added to the end of the DOMNode list
  return oldChildren.filter( ( child, index ) => index !== newChildren.indexOf( child ) );
}

export default class IsotopeComponent extends Component {
  constructor ( props, context ) {
    super( props, context );

    this.displayName = 'IsotopeComponent';
    this.state       = { mounted : false };
    this.domChildren = [];
    this.refs;
    this.isotope;
  }

  initializeIsotope ( force ) {
    if ( !this.isotope || force ) {
      this.isotope = new Isotope(
        this.refs[ refName ],
        this.props.options
      );

      this.domChildren = this.getNewDomChildren();
    }
  }

  getNewDomChildren ( ) {
    const node = this.refs[ refName ];
    const children = this.props.options.itemSelector ? node.querySelectorAll( this.props.options.itemSelector ) : node.children;

    return Array.prototype.slice.call( children );
  }


  diffDomChildren ( ) {
    /*
     * take only elements attached to DOM
     * (aka the parent is the isotope container, not null)
     */
    const oldChildren = this.domChildren.filter( element => !!element.parentNode );
    const newChildren = this.getNewDomChildren();

    const removed = getDiff( oldChildren, newChildren );
    const domDiff = getDiff( newChildren, oldChildren );
    const prepended = getPrepended( domDiff, newChildren );
    const appended  = getAppended(  domDiff, prepended );
    const moved = removed.length === 0 ? getMoved( newChildren, oldChildren ) : [];

    this.domChildren = newChildren;

    return {
      oldChildren,
      newChildren,
      removed,
      appended,
      prepended,
      moved
    };
  }

  performLayout ()  {
    const diff = this.diffDomChildren();

    if ( diff.removed.length > 0 ) {
      this.isotope.remove( diff.removed );
      this.isotope.reloadItems();
    }

    if ( diff.appended.length > 0 ) {
      this.isotope.appended( diff.appended );

      if ( diff.prepended.length === 0 ) {
        this.isotope.reloadItems();
      }
    }

    if ( diff.prepended.length > 0 ) {
      this.isotope.prepended( diff.prepended );
    }

    if ( diff.moved.length > 0 ) {
      this.isotope.reloadItems();
    }

    this.isotope.layout();
  }

  imagesLoaded ( ) {
    if ( this.props.disableImagesLoaded ) {
      return;
    }

    imagesloaded(
      this.refs[ refName ],
      instance => {
        if ( this.props.onImagesLoaded ) {
          this.props.onImagesLoaded( instance );
        }

        this.isotope.layout();
      }
    );
  }

  componentDidMount ( ) {
    this.initializeIsotope();
    this.imagesLoaded();
    this.state.mounted = true;
  }

  componentDidUpdate ( ) {
    this.performLayout();
    this.imagesLoaded();
  }

  componentWillReceiveProps ( ) {
    this._timer = setTimeout( ( ) => {
      this.isotope.reloadItems();
      this.state.mounted && this.forceUpdate();
    } );
  }

  componentWillUnmount ( ) {
    clearTimeout( this._timer );
    this.isotope.destroy();
    this.state.mounted = false;
  }

  render ( ) {
    return React.createElement( this.props.elementType, assign( {}, this.props, { ref: refName } ), this.props.children );
  }
}

IsotopeComponent.propTypes = {
  disableImagesLoaded: PropTypes.bool,
  onImagesLoaded:      PropTypes.func,
  options:             PropTypes.object
};

IsotopeComponent.defaultProps = defaultProps;
