declare module "react-masonry-component" {
    import React = __React;

    interface MasonryPropTypes {
        disableImagesLoaded?: boolean;
        updateOnEachImageLoad?: boolean;
        onImagesLoaded?: Function;
        options?: Object;
        className?: string;
        elementType: string;

    }

    export var Masonry: React.Component<MasonryPropTypes, void>;
}