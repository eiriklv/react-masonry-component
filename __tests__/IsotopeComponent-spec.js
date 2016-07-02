jest.unmock( '../components/IsotopeComponent' );
jest.mock( 'isotope-layout', ( ) => Object );

import React from 'react';
import ReactDOM from 'react-dom';

import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

import IsotopeComponent from '../components/IsotopeComponent';
import defaultProps from '../components/defaultProps';

const childrenElements = [ 'h4', 'h3', 'h3', 'w2', 'h2' ];
const isotopeOptions = {
  columnWidth: 60
};


describe( 'React Isotope Component', function() {
  it( 'should set correct default props', function() {
    console.log( TestUtils.renderIntoDocument( <IsotopeComponent /> ).props, ( <IsotopeComponent /> ).props, defaultProps );

    // const component = TestUtils.renderIntoDocument( <IsotopeComponent /> );
    // expect( component.props ).toEqual( defaultProps );
  } );

  xit( 'should render container with correct elementType', function() {
    const componentDiv     = TestUtils.renderIntoDocument( <IsotopeComponent /> );
    const componentSection = TestUtils.renderIntoDocument( <IsotopeComponent elementType="section" /> );

    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentDiv,     'div' ).length     ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentSection, 'section' ).length ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentSection, 'div' ).length     ).toEqual( 0 );
  } );

  xit( 'should render container with correct className', function() {
    const component          = TestUtils.renderIntoDocument( <IsotopeComponent/> );
    const componentWithClass = TestUtils.renderIntoDocument( <IsotopeComponent className="my-class"/> );

    expect( TestUtils.scryRenderedDOMComponentsWithClass( component,          ''         ).length ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithClass( componentWithClass, 'my-class' ).length ).toEqual( 1 );
  } );

  xit( 'should render children', function() {
    const component = TestUtils.renderIntoDocument(
      <IsotopeComponent className="container" elementType="ul" options={isotopeOptions}>
        {
          childrenElements.map( ( cn, i ) => <li key={i} className={`item ${cn}`}></li> )
        }
      </IsotopeComponent>
    );
    const children = TestUtils.scryRenderedDOMComponentsWithClass( component, 'item' );

    expect( children.length ).toEqual( 5 );
  } );

  xit('should apply Isotope goodness', function() {
    const Component = (
      <IsotopeComponent className="container"
                        elementType="ul"
                        options={isotopeOptions}>
      {
        childrenElements.map( ( cn, i ) => <li key={i} className={`item ${cn}`}></li> )
      }
      </IsotopeComponent>
    );

    let div = document.createElement( 'div' );

    document.body.appendChild( div );

    ReactDOM.render( Component, div );

    const elements = document.querySelectorAll( '.item' );
    const positions = {
      0: {
        left: 0,
        top: 0
      },
      1: {
        left: 60,
        top: 0
      },
      2: {
        left: 120,
        top: 0
      },
      3: {
        left: 60,
        top: 70
      },
      4: {
        left: 0,
        top: 90
      }
    };

    for ( let i = 0; i < elements.length; i++ ) {
      expect( elements[ i ].style.left ).toEqual( positions[ i ].left + 'px' );
      expect( elements[ i ].style.top  ).toEqual( positions[ i ].top  + 'px' );
    }
  } );

  xit( 'should allow custom props', function() {
    const handler = () => {};
    const component = TestUtils.renderIntoDocument( <IsotopeComponent onClick={handler} test="testProp" /> );

    expect( component.props ).toEqual( {
      disableImagesLoaded: false,
      options:             {},
      className:           '',
      elementType:         'div',
      onClick:             handler,
      test:                'testProp'
    } );
  } );

  xit( 'should provide a reference to the Isotope instance', function() {
    const Wrapper = React.createClass({
      render() {
        return <IsotopeComponent ref={c => this.isotope = c.isotope} />
      }
    } );
    const component = TestUtils.renderIntoDocument( <Wrapper /> );
    const il = require( 'isotope-layout' );

    expect( component.isotope instanceof il ).toEqual( true );
  } );
} );
