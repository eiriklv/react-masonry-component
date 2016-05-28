const TestUtils = require( 'react/lib/ReactTestUtils' );
const expect = require( 'expect' );
const React = require( 'react' );
const ReactDOM = require( 'react-dom' );
const MasonryComponent = require( '../lib' ).default;

const childrenElements = [ 'h4', 'h3', 'h3', 'w2', 'h2' ];
const masonryOptions = {
  columnWidth: 60
};

describe( 'React Masonry Component', function() {
  it( 'should set correct default props', function() {
    const component = TestUtils.renderIntoDocument( <MasonryComponent /> );

    expect( component.props ).toEqual( {
      disableImagesLoaded: false,
      options:             {},
      className:           '',
      elementType:         'div'
    } );
  } );

  it( 'should render container with correct elementType', function() {
    const componentDiv = TestUtils.renderIntoDocument( <MasonryComponent /> );
    const componentSection = TestUtils.renderIntoDocument( <MasonryComponent elementType="section" /> );

    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentDiv,     'div' ).length     ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentSection, 'section' ).length ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithTag( componentSection, 'div' ).length     ).toEqual( 0 );
  } );

  it( 'should render container with correct className', function() {
    const component = TestUtils.renderIntoDocument( <MasonryComponent/> );
    const componentWithClass = TestUtils.renderIntoDocument( <MasonryComponent className="my-class"/> );

    expect( TestUtils.scryRenderedDOMComponentsWithClass( component,          ''         ).length ).toEqual( 1 );
    expect( TestUtils.scryRenderedDOMComponentsWithClass( componentWithClass, 'my-class' ).length ).toEqual( 1 );
  } );

  it( 'should render children', function() {
    const component = TestUtils.renderIntoDocument(
      <MasonryComponent className="container" elementType="ul" options={masonryOptions}>
        {
          childrenElements.map( ( cn, i ) => <li key={i} className={`item ${cn}`}></li> )
        }
      </MasonryComponent>
    );
    const children = TestUtils.scryRenderedDOMComponentsWithClass( component, 'item' );

    expect( children.length ).toEqual( 5 );
  } );

  it('should apply Masonry goodness', function() {
    const Component = (
      <MasonryComponent className="container"
                        elementType="ul"
                        options={masonryOptions}>
      {
        childrenElements.map( ( cn, i ) => <li key={i} className={`item ${cn}`}></li> )
      }
      </MasonryComponent>
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

  it( 'should allow custom props', function() {
    const handler = () => {};
    const component = TestUtils.renderIntoDocument( <MasonryComponent onClick={handler} test="testProp" /> );

    expect( component.props ).toEqual( {
      disableImagesLoaded: false,
      options:             {},
      className:           '',
      elementType:         'div',
      onClick:             handler,
      test:                'testProp'
    } );
  } );

  it( 'should provide a reference to the Masonry instance', function() {
    const Wrapper = React.createClass({
      render() {
        return <MasonryComponent ref={c => this.masonry = c.masonry} />
      }
    } );
    const component = TestUtils.renderIntoDocument( <Wrapper /> );
    const ml = require( 'masonry-layout' );

    expect( component.masonry instanceof ml ).toEqual( true );
  } );
} );
