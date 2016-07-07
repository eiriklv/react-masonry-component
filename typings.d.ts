/// <reference path='typings/react/react.d.ts' />

declare module "react-masonry-component" {
    import React = __React;

    interface MasonryPropTypes {
        disableImagesLoaded?: boolean;
        updateOnEachImageLoad?: boolean;
        onImagesLoaded?: (instance: any) => void;
        options?: Object;
        className?: string;
        elementType?: string;
    }

    export var Masonry: React.Component<MasonryPropTypes, void>;
}