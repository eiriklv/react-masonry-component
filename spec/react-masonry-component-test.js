const TestUtils = require('react-dom/test-utils');
const React = require('react');
const ReactDOM = require('react-dom');
const MasonryComponent = require('../lib');
const expect = require('expect');
const assign = require('lodash/assign');

const masonryOptions = {
  columnWidth: 60
};

const childrenElements = ['h4', 'h3', 'h3', 'w2', 'h2'];

describe('React Masonry Component', function() {
  describe('Core features', function() {
    it('should set correct default props', function() {
      const component = TestUtils.renderIntoDocument(<MasonryComponent/>);

      expect(component.props).toEqual({
        enableResizableChildren: false,
        disableImagesLoaded: false,
        updateOnEachImageLoad: false,
        options: {},
        imagesLoadedOptions: {},
        className: '',
        elementType: 'div',
        onLayoutComplete: function() {
        },
        onRemoveComplete: function() {
        }
      });
    });

    it('should render container with correct elementType', function() {
      const componentDiv = TestUtils.renderIntoDocument(<MasonryComponent/>);
      const componentSection = TestUtils.renderIntoDocument(<MasonryComponent elementType="section"/>);

      expect(TestUtils.scryRenderedDOMComponentsWithTag(componentDiv, 'div').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithTag(componentSection, 'section').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithTag(componentSection, 'div').length).toEqual(0);
    });

    it('should render container with correct className', function() {
      const component = TestUtils.renderIntoDocument(<MasonryComponent/>);
      const componentWithClass = TestUtils.renderIntoDocument(<MasonryComponent className="my-class"/>);

      expect(TestUtils.scryRenderedDOMComponentsWithClass(component, '').length).toEqual(1);
      expect(TestUtils.scryRenderedDOMComponentsWithClass(componentWithClass, 'my-class').length).toEqual(1);
    });

    it('should provide a reference to the Masonry instance', function() {
      class Wrapper extends React.Component {
        render() {
          return <MasonryComponent ref={c => this.masonry = c.masonry}/>
        }
      }

      const component = TestUtils.renderIntoDocument(<Wrapper/>);
      const ml = require('masonry-layout');
      expect(component.masonry instanceof ml).toEqual(true);
    });

    it('should support events as props', function(done) {
      let passed = {
        layoutComplete: false,
        removeComplete: false
      };
      const layoutEventHandler = function() {
        passed.layoutComplete = true;
      };
      const removeEventHandler = function() {
        passed.removeComplete = true;
      };

      let masonry;

      let children = childrenElements.slice().map(function(child, index) {
        return <li key={index}>{child}</li>
      });

      class Wrapper extends React.Component {
        render() {
          return (
            <MasonryComponent
              onLayoutComplete={layoutEventHandler}
              onRemoveComplete={removeEventHandler}
              ref={c => masonry = c.masonry}>
              {children}
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper/>, div);

      masonry.remove(children[0]);

      this.timeout(3000);

      setTimeout(function() {
        expect(passed).toEqual({
          layoutComplete: true,
          removeComplete: true
        });
        done();
      }, 2000);
    });

    it('should render children', function() {
      const component = TestUtils.renderIntoDocument(
        <MasonryComponent className="container" elementType="ul" options={masonryOptions}>
          {
            childrenElements.map(function(cn, i) {
              return <li key={i} className={`item ${cn}`}></li>
            })
          }
        </MasonryComponent>
      );

      const children = TestUtils.scryRenderedDOMComponentsWithClass(component, 'item');
      expect(children.length).toEqual(5);
    });

    it('should apply Masonry goodness', function() {
      const Component = <MasonryComponent className="container" elementType="ul" options={masonryOptions}>
        {
          childrenElements.map(function(cn, i) {
            return <li key={i} className={`item ${cn}`}></li>
          })
        }
      </MasonryComponent>;

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(Component, div);

      const elements = div.querySelectorAll('.item');
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

      for (let i = 0; i < elements.length; i++) {
        expect(elements[i].style.left).toEqual(positions[i].left + 'px');
        expect(elements[i].style.top).toEqual(positions[i].top + 'px');
      }
    });
  });

  describe('imagesloaded usage', function() {
    it('should fire the images loaded event when all images have loaded', function(done) {
      const handleImagesLoaded = (instance) => {
        expect(instance.hasAnyBroken).toEqual(false);
        expect(instance.progressedCount).toEqual(1);
        expect(instance.isComplete).toEqual(true);
        done();
      };

      class Wrapper extends React.Component {
        constructor() {
          super();
        }

        render() {
          return (
            <MasonryComponent
              className="container"
              elementType="div"
              options={assign({}, masonryOptions, {transitionDuration: 0})}
              onImagesLoaded={handleImagesLoaded}
            >
                <img className="item" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);
    });

    it('should fire the images loaded event when listening for background images', function(done) {
      const imagesLoadedOptions = {background: '.imagesloaded'};
      const handleImagesLoaded = (instance) => {
        expect(instance.hasAnyBroken).toEqual(false);
        expect(instance.progressedCount).toEqual(1);
        expect(instance.isComplete).toEqual(true);
        expect(instance.options).toEqual(imagesLoadedOptions);
        done();
      };

      class Wrapper extends React.Component {
        constructor() {
          super();
        }

        render() {
          return (
            <MasonryComponent
              className="container"
              elementType="div"
              options={assign({}, masonryOptions, {transitionDuration: 0})}
              imagesLoadedOptions={imagesLoadedOptions}
              onImagesLoaded={handleImagesLoaded}
            >
              <div className="item imagesloaded"></div>
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);
    });
  });

  describe('laying out new elements', function() {
    const firstPositions = {
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

    const secondPositions = {
      0: {
        left: 0,
        top: 0
      },
      1: {
        left: 60,
        top: 0
      },
      2: {
        left: 60,
        top: 30
      },
      3: {
        left: 120,
        top: 30
      },
      4: {
        left: 0,
        top: 50
      }
    };

    it('should correctly layout new elements when completely replacing child items [transitionDuration empty]', function(/*done*/) {
      let wrapperContext;
      class Wrapper extends React.Component {
        constructor() {
          super();
          this.state = {
            items: childrenElements.slice()
          };

          wrapperContext = this;
        }

        render() {
          return (
            <MasonryComponent className="container" elementType="ul" options={masonryOptions}>
              {
                this.state.items.map(function(cn, i) {
                  return <li key={Math.random()} className={`item ${cn}`}></li>
                })
              }
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);

      const firstElements = div.querySelectorAll('.item');


      for (let i = 0; i < firstElements.length; i++) {
        expect(firstElements[i].style.left).toEqual(firstPositions[i].left + 'px');
        expect(firstElements[i].style.top).toEqual(firstPositions[i].top + 'px');
      }

      wrapperContext.setState({items: childrenElements.slice().reverse()});

      setTimeout(() => {
        const secondElements = div.querySelectorAll('.item');

        for (let i = 0; i < secondElements.length; i++) {
          expect(secondElements[i].style.left).toEqual(secondPositions[i].left + 'px');
          expect(secondElements[i].style.top).toEqual(secondPositions[i].top + 'px');
        }
        // done();
      }, 400 );
    });

    it('should correctly layout new elements when completely replacing child items [transitionDuration zero]', function() {
      let wrapperContext;
      class Wrapper extends React.Component {
        constructor() {
          super();
          this.state = {
            items: childrenElements.slice()
          };

          wrapperContext = this;
        }

        render() {
          return (
            <MasonryComponent className="container" elementType="ul" options={assign({}, masonryOptions, {transitionDuration: 0})}>
              {
                this.state.items.map(function(cn, i) {
                  return <li key={Math.random()} className={`item ${cn}`}></li>
                })
              }
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);

      const firstElements = div.querySelectorAll('.item');


      for (let i = 0; i < firstElements.length; i++) {
        expect(firstElements[i].style.left).toEqual(firstPositions[i].left + 'px');
        expect(firstElements[i].style.top).toEqual(firstPositions[i].top + 'px');
      }

      wrapperContext.setState({items: childrenElements.slice().reverse()});
      const secondElements = div.querySelectorAll('.item');

      for (let i = 0; i < secondElements.length; i++) {
        expect(secondElements[i].style.left).toEqual(secondPositions[i].left + 'px');
        expect(secondElements[i].style.top).toEqual(secondPositions[i].top + 'px');
      }
    });
  });

  describe('removing elements', function() {
    const localChildrenElements = [
      { k: 0, cn: 'h4' },
      { k: 1, cn: 'h3' },
      { k: 2, cn: 'h3' },
      { k: 3, cn: 'w2' },
      { k: 4, cn: 'h2' }];

    const firstPositions = {
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

    const secondPositions = {
      0: {
        left: 0,
        top: 0
      },
      1: {
        left: 60,
        top: 0
      },
      2: {
        left: 0,
        top: 70
      },
      3: {
        left: 120,
        top: 0
      }
    };

    const failureMessage = (index, property, expectedValue, actualValue, phase) =>
      `property "${property}" expected to be ${expectedValue} but is ${actualValue} on phase "${phase}" - index ${index}`;

    const expectElementPositionToMatch = (element, expectedPosition, index, phase) => {
      expect(element.style.left).toEqual(expectedPosition.left + 'px',
          failureMessage(index, 'left', expectedPosition.left + 'px', element.style.left, phase))
      expect(element.style.top).toEqual(expectedPosition.top + 'px',
          failureMessage(index, 'top', expectedPosition.top + 'px', element.style.top, phase))
    }

    it('should correctly layout remaining elements when first element is removed [columnWidth empty]', function() {
      let wrapperContext;
      class Wrapper extends React.Component {
        constructor() {
          super();
          this.state = {
            items: localChildrenElements.slice()
          };

          wrapperContext = this;
        }

        render() {
          return (
            <MasonryComponent className="container" elementType="ul" options={{transitionDuration: 0}}>
              {
                this.state.items.map(function(item, i) {
                  return <li key={item.k} className={`item ${item.cn}`}></li>
                })
              }
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);

      const firstElements = div.querySelectorAll('.item');

      for (let i = 0; i < firstElements.length; i++) {
        expectElementPositionToMatch(firstElements[i], firstPositions[i], i, 'before removal');
      }

      wrapperContext.setState({items: localChildrenElements.slice(1)});
      const secondElements = div.querySelectorAll('.item');

      for (let i = 0; i < secondElements.length; i++) {
        expectElementPositionToMatch(secondElements[i], secondPositions[i], i, 'after removal');
      }
    });

    it('should correctly layout remaining elements when first element is removed [columnWidth fixed]', function() {
      let wrapperContext;
      class Wrapper extends React.Component {
        constructor() {
          super();
          this.state = {
            items: localChildrenElements.slice()
          };

          wrapperContext = this;
        }

        render() {
          return (
            <MasonryComponent className="container" elementType="ul" options={{transitionDuration: 0, columnWidth: 60}}>
              {
                this.state.items.map(function(item, i) {
                  return <li key={item.k} className={`item ${item.cn}`}></li>
                })
              }
            </MasonryComponent>
          );
        }
      }

      let div = document.createElement('div');
      document.body.appendChild(div);

      ReactDOM.render(<Wrapper />, div);

      const firstElements = div.querySelectorAll('.item');

      for (let i = 0; i < firstElements.length; i++) {
        expectElementPositionToMatch(firstElements[i], firstPositions[i], i, 'before removal');
      }

      wrapperContext.setState({items: localChildrenElements.slice(1)});
      const secondElements = div.querySelectorAll('.item');

      for (let i = 0; i < secondElements.length; i++) {
        expectElementPositionToMatch(secondElements[i], secondPositions[i], i, 'after removal');
      }
    });
  });
});
